complete -c cdd -f
complete -c cdd -n '__fish_use_subcommand' -a help -d 'Show CDD command help'
complete -c cdd -n '__fish_use_subcommand' -a init -d 'Initialize a CDD directory structure'
complete -c cdd -n '__fish_use_subcommand; and test -d ./platform/cli' -a '(for filepath in ./platform/cli/*; test -f $filepath; and basename $filepath; end)' -d 'Run project command'
complete -c cdd -n '__fish_seen_subcommand_from init' -a '(__fish_complete_directories)'
