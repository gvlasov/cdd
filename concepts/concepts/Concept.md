A concept is a [cohesion](/concepts/cohesion/Cohesion.md) unit: the unifying principle of representations held together by meaning.

A concept has:

- Name
- Attributes
- The set of all instances of its reflections
- 1+ kinds

In a CDD  software project, a concept is represented as a collection of files in a directory. The files are the concept's representations. The directory name is also a representation of the concept: it gives the concept a name and makes it addressable in the project.

Examples:

```
/concepts/orders/
  Orders.php          # repository of orders
  Order.php           # order entity representation
  OrderView.vue       # order UI representation
  OrderRepository.php # order persistence representation
  OrderController.php # HTTP representation of order actions
  CreateOrdersTable.php # database state representation of orders
  ImportOrder.php     # command module for importing orders
  Order.md            # written description of the order concept
  screenshots/        # visual representations of orders in the product
```

```
/concepts/products/
  Products.php          # repository of products
  Product.php           # product entity representation
  ProductCard.vue       # product UI representation
  ProductImage.png      # visual product representation
  ProductRepository.php # product persistence representation
  Product.md            # written description of the product concept
```

```
/concepts/users/
  Users.php          # repository of users
  User.php           # user entity representation
  UserProfile.vue    # user UI representation
  UserAvatar.png     # visual user representation
  UserRepository.php # user persistence representation
  User.md            # written description of the user concept
```

A concept is not one class, model, file, table, or component. Those are possible [reflections](/concepts/reflections/Reflection.md) of a concept. The concept is the identity of the cohesive set of reflections.

A concept consists only of its representations. Its name is one of those representations, and not a separate substance behind them.

There is no canonical reflection of a concept apart from its name. Every reflection is a facet of the whole concept.

## Plural and singleton concepts

Concepts tend to exist as a set, is its name is plural most of the time. But some concepts reflect a set of 1 instance, they are called singletons as in OOP:

Most practical concepts are plural, but it is fine to have singleton concepts

The name of a plural concept must be in plural, e.g. `bills`, `products`, `apples`

The name of a singleton concept must be in singular, e.g. `jimmy-the-client`

Also [Substance](/concepts/substances/Substances.md) are called in singular.

### Examples of singleton concepts

- project author for the solo-founder project
- country in an application that only works in one country and should not know about any other countries
- customer in a project where the client is a single guy that hired a team of developers to build him a project

## Concept directory

Example: `/concept/users` - the concept of users

A concept directory exists to keep the concept's reflections together.

Representations inside one concept directory are highly cohesive because they are about the same part of reality. This makes the concept easier for humans to navigate and easier for an LLM to understand: the whole directory can be passed as context, and the LLM can see the concept in its entirety instead of reconstructing it from scattered technical-role directories.

### Runtime mechanisms

A reflection belongs to the concept whose meaning it expresses, not to the runtime mechanism that executes it.

A controller for a concept is a concept reflection. An `OrderController` belongs to the order concept because it exposes order actions to users through HTTP. The HTTP server, routing engine, middleware pipeline, and framework bootstrapping belong to platform.

A migration for a concept is also a concept reflection. A migration that creates or changes an orders table belongs to the order concept because it describes how orders exist in database state. The migration runner, database connection setup, and migration discovery mechanism belong to platform.

If a file seems to belong to both a concept and a runtime mechanism, split the concept-specific reflection from the mechanism-specific adapter. The concept-specific part stays with the concept; the generic mechanism stays in platform.

## Concept and class

A concept is similar to a class in that both name a cohesive phenomenon.

A concept is different from an object-oriented class because a class is one possible reflection of a category of objects, while a concept is the set of all cohesive reflections of that part of reality. A concept may include classes, templates, data, documentation, commands, tests, assets, and other files related by meaning.

## Project hierarchy

A [project](/concepts/projects/Project.md) is a cohesion unit composed of concepts, stakeholders, processes, and platform.

A concept sits below the project in the hierarchy of cohesion: a project contains concepts, and a concept contains reflections.

The name of a concept in combination with the name of the project it originates from provides the concept's identity. Identifying concepts between projects is not usually useful, but in theory it can be done.

## Categorizing concept reflections

There are ways to categorize reflections of the same concept.

### Kinds

Kinds are subconcepts that partition a concept completely. This is similar to how an exhaustive set of concrete classes can implement an abstract class.

For example, a country concept can define a data class and flag image for every country:

- `/concepts/countries/kinds/USA.php`
- `/concepts/countries/kinds/USA.png`
- `/concepts/countries/kinds/China.php`
- `/concepts/countries/kinds/China.png`

The reflections can also be grouped by kind to strengthen cohesion:

- `/concepts/countries/kinds/usa/USA.php`
- `/concepts/countries/kinds/usa/flag.png`
- `/concepts/countries/kinds/china/China.php`
- `/concepts/countries/kinds/china/flag.png`


### Examples

If a concept is complex and needs representation by complex examples, it makes sense to create an `$concept/examples` directory
