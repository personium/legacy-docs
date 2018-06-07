# Engine Extensionのセットアップ
Engine ExtensionはEngine Libraryの機能を拡張するための機構です。  
詳細は[Personium Engine](../app-developer/Personium-Engine.md)をご覧ください。  

ここでは、Personium Open Sourceで公開しているEngine Extensionのセットアップ方法を記載します。  

## Repositories
* [personium-ex-httpclient](https://github.com/personium/personium-ex-httpclient)
* [personium-ex-mailsender](https://github.com/personium/personium-ex-mailsender)
* [personium-ex-slack-messenger](https://github.com/personium/personium-ex-slack-messenger)
* [personium-ex-ew-services](https://github.com/personium/personium-ex-ew-services)

## Installation
### JARファイルの作成
Engine ExtensionのビルドにはMavenが必要です。  
http://maven.apache.org/install.html を参考にインストールを行ってください。  

対象のリポジトリ(personium-ex-xxxxx)をチェックアウトし、以下を行ってください。  
```
cd personium-ex-xxxxx
mvn clean package -DskipTests
```
"personium-ex-xxxxx/target"配下にJARファイルが作成されます。

### Install
JARファイルをAPサーバに配備し、再起動してください。  
デフォルトの配備先Pathは"/personium/personium-engine/extensions"です。  
```
# cp personium-ex-xxxxx/target/personium-ex-xxxxx.jar /personium/personium-engine/extensions
# systemctl restart tomcat
```

### Update
Engine Extensionをアップデートしたい場合は、JARファイルを上書きして、インストール時と同様に再起動を行ってください。
