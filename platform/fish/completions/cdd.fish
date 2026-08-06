complete -c cdd -f
complete -c cdd -n '__fish_use_subcommand' -a self-help -d 'Show cdd subcommands'
complete -c cdd -n '__fish_use_subcommand' -a help -d 'Show available project commands'
complete -c cdd -n '__fish_use_subcommand' -a 'github:open' -d 'Open this project in GitHub'
complete -c cdd -n '__fish_use_subcommand' -a 'ide:open' -d "Open a file in the user's editor"
complete -c cdd -n '__fish_use_subcommand' -a 'ide:which' -d 'Print the IDE command CDD will use'
complete -c cdd -n '__fish_use_subcommand' -a init -d 'Initialize a CDD directory structure'
complete -c cdd -n '__fish_use_subcommand' -a print -d 'Print indexed project code'
complete -c cdd -n '__fish_use_subcommand' -a 'source-code:print' -d 'Print indexed project code'
complete -c cdd -n '__fish_use_subcommand' -a 'source-code:volume' -d 'Print the indexed source-code volume in bytes'
complete -c cdd -n '__fish_use_subcommand' -a 'source-code:volume:analyze' -d 'Print source files ordered by indexed byte size'
complete -c cdd -n '__fish_use_subcommand' -a 'source-code:volume:assess' -d 'Browse source-code items by volume'
complete -c cdd -n '__fish_use_subcommand' -a 'skill:print' -d 'Print the freshest installed CDD skill'
complete -c cdd -n '__fish_use_subcommand' -a self-upgrade -d 'Self-upgrade CDD support from CDD_SOURCE_PATH'
complete -c cdd -n '__fish_use_subcommand' -a projects -d 'List, resolve, or print projects'
complete -c cdd -n '__fish_use_subcommand' -a '(__cdd_top_level_commands)'
complete -c cdd -n '__fish_seen_subcommand_from init' -a '(__fish_complete_directories)'
complete -c cdd -f -n '__cdd_help_should_complete_commands' -a '(__cdd_help_commands)'
complete -c cdd -f -n '__cdd_ide_should_complete_paths' -a '(__fish_complete_path (commandline -ct))'
complete -c cdd -f -n '__cdd_commands_ln_should_complete_paths' -a '(__fish_complete_path (commandline -ct))'
complete -c cdd -f -n '__cdd_source_code_should_complete_paths' -a '(__cdd_source_code_paths)'
complete -c cdd -n '__fish_seen_subcommand_from feature problem' -a '(__cdd_plans_open_complete (commandline -opc)[2] (commandline -ct))'
complete -c cdd -n '__fish_seen_subcommand_from plans:finish' -a '(__cdd_plans_finish_complete (commandline -ct))'
complete -c cdd -f -n '__cdd_projects_should_complete_subcommands' -a '(__cdd_projects_subcommands)'
complete -c cdd -f -n '__cdd_projects_should_complete_paths' -a '(__cdd_projects_paths)'

function __cdd_plans_finish_complete
    set -l current $argv[1]
    set -l plan_root plans
    set -l prefix "$plan_root/$current"
    set -l completions

    if test -z "$current"; and status --is-interactive
        set current (commandline -ct)
        set prefix "$plan_root/$current"
    end

    for entry in (__fish_complete_path "$prefix")
        set -l path (string split -m 1 \t -- "$entry")[1]
        set path (string replace -r "^$plan_root/" "" -- "$path")
        echo "$path"
    end
end

function __cdd_plans_open_complete
    set -l kind $argv[1]
    set -l current $argv[2]

    if test (count $argv) -lt 2
        set -l tokens (commandline -opc)
        if test (count $tokens) -lt 2
            return 1
        end

        set kind $tokens[2]
        set current (commandline -ct)
    end

    set -l plan_root (string join '' plans/ $kind s)
    set -l prefix "$plan_root/$current"

    for entry in (__fish_complete_path "$prefix")
        set -l path (string split -m 1 \t -- "$entry")[1]
        set path (string replace -r "^$plan_root/" "" -- "$path")
        echo "$path"
    end
end

function __cdd_top_level_commands
    set -l seen cdd self-help help github:open init print source-code:print source-code:volume source-code:volume:analyze source-code:volume:assess skill:print self-upgrade projects
    for dir in ./commands ./concepts/cdd-cli-commands/kinds
        test -d "$dir"; or continue
        for filepath in $dir/*
            test -f "$filepath"; or continue
            string match -q -- '*.sh' (basename "$filepath"); and continue
            set -l name (basename "$filepath")
            contains -- $name $seen; and continue
            set --append seen $name
            set -l description (__cdd_command_description "$filepath")
            if test -n "$description"
                printf "%s\t%s\n" "$name" "$description"
            else
                echo $name
            end
        end
    end
end

function __cdd_command_description
    set -l filepath $argv[1]

    if not test -f "$filepath"
        return 1
    end

    set -l description (tail -n +2 "$filepath" | awk 'NF && /^#/ { print; exit }' | sed 's/^#[[:space:]]*//')

    if test -n "$description"
        echo $description
    end
end

function __cdd_projects_subcommands
    printf "%s\n" ls cd pwd
end

function __cdd_help_commands
    set -l seen
    for dir in ./commands ./concepts/plans ./concepts/projects ./concepts/ides
        test -d "$dir"; or continue
        for filepath in $dir/*
            test -f "$filepath"; or continue
            test -x "$filepath"; or continue
            string match -q -- '*.sh' (basename "$filepath"); and continue
            set -l name (basename "$filepath")
            contains -- $name $seen; and continue
            set --append seen $name
            set -l description (__cdd_command_description "$filepath")
            if test -n "$description"
                printf "%s\t%s\n" "$name" "$description"
            else
                echo $name
            end
        end
    end
end

function __cdd_help_should_complete_commands
    set -l tokens (commandline -opc)
    if test (count $tokens) -lt 2
        return 1
    end

    switch $tokens[2]
        case help
            return 0
    end

    return 1
end

function __cdd_ide_should_complete_paths
    set -l tokens (commandline -opc)
    if test (count $tokens) -lt 2
        return 1
    end

    switch $tokens[2]
        case ide:open
            return 0
    end

    return 1
end

function __cdd_commands_ln_should_complete_paths
    set -l tokens (commandline -opc)
    if test (count $tokens) -ne 2
        return 1
    end

    switch $tokens[2]
        case 'commands:ln'
            return 0
    end

    return 1
end

function __cdd_source_code_should_complete_paths
    set -l tokens (commandline -opc)
    if test (count $tokens) -lt 2
        return 1
    end

    switch $tokens[2]
        case print source-code:print source-code:volume source-code:volume:analyze
            return 0
    end

    return 1
end

function __cdd_source_code_paths
    set -l current (commandline -ct)
    for path in $current*
        if test -e "$path"
            echo "$path"
        end
    end
end

function __cdd_projects_should_complete_subcommands
    set -l tokens (commandline -opc)
    if test (count $tokens) -eq 2; and test "$tokens[2]" = projects
        return 0
    end

    return 1
end

function __cdd_projects_should_complete_paths
    set -l tokens (commandline -opc)

    if test (count $tokens) -lt 3
        return 1
    end

    switch $tokens[3]
        case cd pwd
            return 0
    end

    return 1
end

function __cdd_projects_paths
    set -l projects_root
    set projects_root (set -q CDD_PROJECTS_DIRECTORY; and echo $CDD_PROJECTS_DIRECTORY; or echo "$HOME/Projects")

    set -l current (commandline -ct)
    for path in $projects_root/$current*
        if test -d "$path"
            echo (basename "$path")
        end
    end
end
