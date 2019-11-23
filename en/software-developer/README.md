# Server Developer's Guide  

It is a document for people who are interested in contributing to the development of the Personium's server program itself.

## Server software composition

Main components of Personium are the following two Java Web Applications, which run on servlet containers.

|Module|Description|JavaDoc|
|:--|:--|:--|
|[personium-core](https://github.com/personium/personium-core)|Personium Main Server program|To be provided|
|[personium-engine](https://github.com/personium/personium-engine)|Secondary server program that runs under the above core program and support the engine functions|To be provided|

By running these server programs on Java Servlet Containers such as Tomcat, and  using behind an appropriately configured reverse proxy server such as Nginx or Apache, it will form a Personium Unit.

These programs depend on the following middlewares as their backend.

|Module|Description|Required|Purpose of use|
|:--|:--|:--|:--|
|ElasticSearch|Scalable NoSQL Search Engine|Yes|Datastore to support our OData interface.|
|ActiveMQ|Java Message Service (JMS) Implementation |Yes|Event Handling|
|Memcached|Generic Memory Caching server|no|Lock/Cache|

## How to prepare your development environment

For those wishing to have an environment for development please see [Procedure for developing environment for development](./build_development_environment.md).

## Depending Libraries

Some portion of Personium's server (core/engine) implementation is implemented in the form of the following libraries. In some cases of server development, Modifications against these modules may be necessary.

|Libraries|Description|Depending Modules|JavaDoc|
|:--|:--|:--|:--|
|[personium-lib-common](https://github.com/personium/personium-lib-common)|Utilities and common functions used in both core and engine|core, engine|To be provided|
|[personium-lib-es-adapter](https://github.com/personium/personium-lib-es-adapter)|A module for ElasticSearch connection. Its main objective is to absorb the minor version differences among various ElasticSearch versions|core|To be provided|
|[personium-client-java](https://github.com/personium/personium-client-java)|Java client for Personium core API's. Used in Engine.|engine|To be provided|
|[personium-plugin-base](https://github.com/personium/personium-plugin-base)|Base module for Personium Plugin Development|core|To be provided|
|[personium-ex-base](https://github.com/personium/personium-ex-base)|Base module for Personium Engine Extensions programming |engine|To be provided|

Personium also uses lots of open source libraries other than these. 
We use apache maven to all the dependent libraries. Our libraries on the above 
are managed on the project maven repository below.

    http://personium.io/mvnrepo/

See the pom.xml located at the root directory of each project for details.

### License Consideration

Personium project thinks it is important to distribute our product under Apache 2.0 license so that the users can freely and safely use it.
So we have a policy that our product should be consisted only of libraries compatible with the same license.
To be more specific, we do not use the libraries with a license that include redistribution limitation terms.

## Testing for quality

* Personium server software assures its quality with [Automated Tests](./personium_tests.md) 
* When you make a Pull Request, please issue it after running relevant part of the automated tests, and making sure there are no errors.
* It is a necessary condition for the PR merge that all of the whole automated tests pass after running them on the CI environment.
* If new feature is developed, corresponding automated test is also necessary.

### Related Repositories

  - [personium-core](https://github.com/personium/personium-core)
  - [personium-engine](https://github.com/personium/personium-engine)
  - [personium-lib-common](https://github.com/personium/personium-lib-common)
  - [personium-lib-es-adapter](https://github.com/personium/personium-lib-es-adapter)
  - [personium-client-java](https://github.com/personium/personium-client-java)
