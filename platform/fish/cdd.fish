if functions --query help
    functions --copy help __original_help
end

function cdd-help
    set seen cdd
    for dir in ./commands
        test -d $dir || continue
        for filepath in $dir/*
            test -f $filepath || continue
            set name (basename $filepath)
            contains -- $name $seen
            and continue
            set --append seen $name
            set desc (tail -n +2 $filepath | awk 'NF && /^#/ { print; exit }' | sed 's/^#[[:space:]]*//' | sed 's/./\L&/')
            cdd-help-command "$name" "$desc"
        end
    end
end

function cdd-help-command
    set grey '\033[90m'
    set reset '\033[0m'
    set name $argv[1]
    set desc $argv[2]

    if test -n "$desc"
        set desc (echo "$desc" | sed 's/./\L&/')
        echo -e "$name $grey- $desc$reset"
    else
        echo $name
    end
end

function help
    if test -d ./commands
        cdd-help
    else
        __original_help $argv
    end
end

# Fish wrapper so `cdd projects:cd <project>` can change the current shell directory.
function cdd
    if test (count $argv) -eq 2; and test "$argv[1]" = "projects:cd"
        set -l project_path (command cdd projects:cd "$argv[2]")
        or return $status
        cd "$project_path"
        return $status
    end

    command cdd $argv
end

function cdd-cd
    cd (git rev-parse --show-toplevel)
end

# Keep the current cdd project's ./commands directory on PATH, and only that one.
# Re-evaluated on every directory change so switching projects swaps the scripts,
# and leaving every cdd project removes them entirely.
function __cdd_find_project_root
    set -l dir $PWD
    while test -n "$dir"
        if test -d $dir/commands
            echo $dir
            return 0
        end
        test "$dir" = / && break
        set dir (path dirname $dir)
    end
    return 1
end

function __cdd_sync_commands_path --on-variable PWD
    # Drop the previously added commands directory, if any.
    if set --query CDD_COMMANDS_PATH_ENTRY; and test -n "$CDD_COMMANDS_PATH_ENTRY"
        if set -l idx (contains --index -- $CDD_COMMANDS_PATH_ENTRY $PATH)
            set --erase PATH[$idx]
        end
    end
    set --erase CDD_COMMANDS_PATH_ENTRY

    # Add the current project's commands directory, if we're in a cdd project.
    set -l root (__cdd_find_project_root)
    and set --global --export CDD_COMMANDS_PATH_ENTRY (realpath $root/commands)
    and set --global --export PATH $CDD_COMMANDS_PATH_ENTRY $PATH
end

__cdd_sync_commands_path
