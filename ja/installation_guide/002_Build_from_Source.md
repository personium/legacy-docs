
####ソースコードを取得する

次のリポジトリをクローンします。

* personium-core（https://github.com/personium/personium-core.git）
* personium-engine（https://github.com/personium/personium-engine.git）


``` bash
$ git clone https://github.com/personium/personium-core.git
```
####コア

mavenパッケージを実行すると、 `core / target / personium-core.war`が作成されます。

```bash
$ cd ./io/personium/core
$ mvn package -DskipTests=true
```

####エンジン

mavenパッケージを実行すると、 `engine / target / personium-engine.war`が作成されます。

```bash
$ cd ./io/personium/engine
$ mvn package -DskipTests=true
```
