complete -c cdd -f
complete -c cdd -n '__fish_use_subcommand' -a help -d 'Show CDD command help'
complete -c cdd -n '__fish_use_subcommand' -a init -d 'Initialize a CDD directory structure'
complete -c cdd -n '__fish_use_subcommand' -a self-upgrade -d 'Self-upgrade CDD support from CDD_SOURCE_PATH'
complete -c cdd -n '__fish_use_subcommand; and begin; test -d ./commands/dev; or test -d ./platform/cli; end' -a '(set seen help init self-upgrade; for dir in ./commands/dev ./platform/cli; test -d $dir; or continue; for filepath in $dir/*; test -f $filepath; or continue; set name (basename $filepath); contains -- $name $seen; and continue; set --append seen $name; echo $name; end; end)' -d 'Run project command'
complete -c cdd -n '__fish_seen_subcommand_from init' -a '(__fish_complete_directories)'
