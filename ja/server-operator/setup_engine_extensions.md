# Engine Extensionのセットアップ
Engine ExtensionはEngine Libraryの機能を拡張するための機構です。  
詳細は[Personium Engine](../app-developer/Personium-Engine.md)をご覧ください。  

ここでは、Personium Open Sourceで公開しているEngine Extensionのセットアップ方法を記載します。  

## Repositories
* [personium-ex-httpclient](https://github.com/personium/personium-ex-httpclient)
* [personium-ex-mailsender](https://github.com/personium/personium-ex-mailsender)
* [personium-ex-slack-messenger](https://github.com/personium/personium-ex-slack-messenger)
* [personium-ex-ew-services](https://github.com/personium/personium-ex-ew-services)

## ビルド済Extensionのインストール  
JARファイルをAPサーバに配備し、再起動してください。  
デフォルトの配備先Pathは"/personium/personium-engine/extensions"です。  
```
# cd /personium/personium-engine/extensions
# curl -O https://personium.io/mvnrepo/io/personium/personium-ex-${COMPONENT}/${VERSION}/personium-ex-${COMPONENT}-${VERSION}-libs.jar
# systemctl restart tomcat
```

## Build and install the latest extensions  
最新のEngine ExtensionをbuildしてAPサーバーに配備したい場合は下記を実施してください。

### Pre-requisite (Maven)  
Engine ExtensionのビルドにはMavenが必要です。  
http://maven.apache.org/install.html を参考にインストールを行ってください。  

### Procedures  
対象のリポジトリ(personium-ex-xxxxx)をチェックアウトし、以下を行ってください。  
"personium-ex-xxxxx/target"配下にJARファイルが作成されます。  
```
# cd personium-ex-xxxxx
# mvn clean package -DskipTests
# cp personium-ex-xxxxx/target/personium-ex-xxxxx.jar /personium/personium-engine/extensions
# systemctl restart tomcat
```
