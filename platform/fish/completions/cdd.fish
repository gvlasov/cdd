complete -c cdd -f
complete -c cdd -n '__fish_use_subcommand' -a self-help -d 'Show cdd subcommands'
complete -c cdd -n '__fish_use_subcommand' -a help -d 'Show available project commands'
complete -c cdd -n '__fish_use_subcommand' -a init -d 'Initialize a CDD directory structure'
complete -c cdd -n '__fish_use_subcommand' -a print -d 'Print indexed project code'
complete -c cdd -n '__fish_use_subcommand' -a self-upgrade -d 'Self-upgrade CDD support from CDD_SOURCE_PATH'
complete -c cdd -n '__fish_use_subcommand; and test -d ./commands' -a '(set seen cdd self-help help init print self-upgrade; for filepath in ./commands/*; test -f $filepath; or continue; set name (basename $filepath); contains -- $name $seen; and continue; set --append seen $name; echo $name; end)' -d 'Run project command'
complete -c cdd -n '__fish_seen_subcommand_from init' -a '(__fish_complete_directories)'
