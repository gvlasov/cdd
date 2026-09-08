// A Subject is any entity to which we can naturally ascribe agency.
export default [
  [
    { kind: 'identity', value: 'cdd.subject' },
    { kind: 'concept', value: 'cdd.concept' },
    { kind: 'slug', value: 'subject' },
    { kind: 'name', value: 'Subject' },
    {
      kind: 'definition',
      value:
        'an entity that can start a process and may consume its outcome to drive decisions.',
    },
    {
      kind: 'examples',
      value: [
        'cdd.subject:examples:systemdDaemon',
        'cdd.subject:examples:user',
        'cdd.subject:examples:scheduler',
        'cdd.subject:examples:browser',
        'cdd.subject:examples:backend',
      ],
    },
  ],
  [
    { kind: 'identity', value: 'cdd.subject:examples:systemdDaemon' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'a systemd daemon on a host.' },
  ],
  [
    { kind: 'identity', value: 'cdd.subject:examples:user' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'instance', value: 'cdd.user' },
    { kind: 'description', value: 'a user of a system.' },
  ],
  [
    { kind: 'identity', value: 'cdd.subject:examples:scheduler' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'a multithreaded scheduler.' },
  ],
  [
    { kind: 'identity', value: 'cdd.subject:examples:browser' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'a browser when communicating with a backend over an API.' },
  ],
  [
    { kind: 'identity', value: 'cdd.subject:examples:backend' },
    { kind: 'concept', value: 'cdd.example' },
    { kind: 'description', value: 'a backend when communicating with a browser over an API.' },
  ],
]
