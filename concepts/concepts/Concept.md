
A concept is a cohesive part of reality.

It sits in the hierarchy of units of cohesion: project is a cohesion unit consists of concepts that consists of reflections.

A concept is similar to a class in that it is a software representation of some cohesive phenomenon with a human-readable name.

A concept is different from a class in that a class is a reflection of a category of objects, while a concept is a set of all possible reflections of a category of objects, which may include classes, templates, data, documentation related to that concept.

A concept consists of
- Its name
- A set of reflections

Thus, software projects are collections of concepts, and a concept is an identity of the set of its reflections

Example in a codebase: a concept of orders consists of Order.vue view, Orders.php repository, Order.php active record. 

There is no canonical reflection of a concept apart from its name. Every reflection is a facet of the whole concept.

The name of a concept in combination with the name of the project it originates from provides the concept's identity. Identifying concepts between projects in not too useful, but in theory you could do it.

## Categorizing concept reflections

There are ways to categorize reflections of the same concepts:
### Kinds

When a set of subconcepts partitions a concept completely. This is very similar to how an exhaustive set of concrete classes implements an abstract class. E.g. for a concept of a country we could define a data class + a flag image for every country:
  
	- `/concepts/countries/kinds/USA.php`
	-  `/concepts/countries/kinds/USA.png
	- `/concepts/countries/kinds/China.php
	-  `/concepts/countries/kinds/China.png
	- etc
- 

Or you could even group the reflections by the kind to further strengthen cohesion: 

- `/concepts/countries/kinds/usa/USA.php
-  `/concepts/countries/kinds/usa/flag.png
- `/concepts/countries/kinds/china/China.php
-  `/concepts/countries/kinds/china/flag.png