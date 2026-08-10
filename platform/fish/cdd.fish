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

for dir in ./commands
    if test -d $dir
        set --global --export PATH (realpath $dir) $PATH
    end
end
