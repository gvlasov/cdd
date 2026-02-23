if functions --query help
    functions --copy help __original_help
end

function cdd-help
    set grey '\033[37m'
    set reset '\033[0m'
    for filepath in ./platform/cli/*
        test -f $filepath || continue
        set name (basename $filepath)
        set desc (tail -n +2 $filepath | awk 'NF && /^#/ { print; exit }' | sed 's/^#[[:space:]]*//' | sed 's/./\L&/')
        if test -n "$desc"
            echo -e "$name $grey- $desc$reset"
        else
            echo $name
        end
    end
end

function help
    if test -d ./platform/cli
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
        fish_add_path $dir
    end
end