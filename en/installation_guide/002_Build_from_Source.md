#### Retrieve Source Codes

Clone the following repositories.

* personium-core (https://github.com/personium/personium-core.git)
* personium-engine (https://github.com/personium/personium-engine.git)


```bash
$ git clone https://github.com/personium/personium-core.git
```
#### core

Run maven package, then `core/target/dc1-core.war` is created.

```bash
$ cd ./io/core
$ mvn package -DskipTests=true
```

#### engine

Run maven package, then `engine/target/dc1-engine.war` is created.

```bash
$ cd ./io/engine
$ mvn package -DskipTests=true
```
