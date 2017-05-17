
####ソースコードを取得する

次のリポジトリをクローンします。

* personium-core（https://github.com/personium/personium-core.git）
* personium-engine（https://github.com/personium/personium-engine.git）


`` bash
$ git clone https://github.com/personium/personium-core.git
`` ``
####コア

mavenパッケージを実行すると、 `core / target / dc1-core.war`が作成されます。

```bash
$ cd ./io/core
$ mvn package -DskipTests=true
```

####エンジン

mavenパッケージを実行すると、 `engine / target / dc1-engine.war`が作成されます。

```bash
$ cd ./io/engine
$ mvn package -DskipTests=true
```
