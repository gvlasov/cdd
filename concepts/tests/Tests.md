Put test files near the files they test, usually in a concept or a stakeholder (if they are testing e.g. auth implementation)

Example:

```
/concepts/orders/OrderRepository.php
/concepts/orders/OrderRepositoryTest.php
/concepts/stakeholders/users/auth.php
/concepts/stakeholders/users/AuthTest.php
```

It is a strong convention that all tests should be ran by `tests` CDD command (`./commands/tests`) that can proxy its arguments to a test runner, e.g. with phpunit:

