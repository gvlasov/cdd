// Static browsable reflection of Tests.
export default [
  [
    {
      "kind": "identity",
      "value": "cdd.tests"
    },
    {
      "kind": "concept",
      "value": "cdd.concept"
    },
    {
      "kind": "slug",
      "value": "tests"
    },
    {
      "kind": "name",
      "value": "Tests"
    },
    {
      "kind": "definition",
      "value": "Put test files near the files they test, usually in a concept or a stakeholder (if they are testing e.g. auth implementation)"
    },
    {
      "kind": "details",
      "value": "Example:\n\n```\n/concepts/orders/OrderRepository.php\n/concepts/orders/OrderRepositoryTest.php\n/concepts/stakeholders/users/auth.php\n/concepts/stakeholders/users/AuthTest.php\n```\n\nIt is a strong convention that all tests should be ran by `tests` CDD command (`./commands/tests`) that can proxy its arguments to a test runner, e.g. with phpunit:"
    }
  ]
]
