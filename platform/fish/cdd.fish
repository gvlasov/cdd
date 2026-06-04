if functions --query help
    functions --copy help __original_help
end

function cdd-help
    cdd-help-command "cdd help" "Show available CDD commands"
    cdd-help-command "cdd init [directory]" "Initialize a CDD project directory"
    cdd-help-command "cdd print" "Print indexed project code"
    cdd-help-command "cdd self-upgrade" "Self-upgrade CDD support from CDD_SOURCE_PATH"
    set seen help init print self-upgrade
    for dir in ./commands/dev ./platform/cli
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
    if test -d ./commands/dev; or test -d ./platform/cli
        cdd-help
    else
        __original_help $argv
    end
end

function cdd-cd
    cd (git rev-parse --show-toplevel)
end

for dir in ./platform/cli ./commands/dev
    if test -d $dir
        set --global --export PATH (realpath $dir) $PATH
    end
end
