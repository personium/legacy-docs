# 認証Pluginのセットアップ
## 認証Plugin
認証PluginはCellが持つOAuth2トークンエンドポイントの振舞を拡張するためのものです。  
認証Pluginをユニットに導入することで、そのユニット上のすべてのCellのOAuth2トークンエンドポイントにはプラグインに定義された拡張された振舞が追加されます。  
OAuth2においてトークンエンドポイントは、リソースアクセスのためのアクセストークン発行を担うものです。  
OAuth2.0仕様では、このエンドポイントの必須パラメタであるgrant_typeは仕様上の定義値の他にも任意の絶対URIを定義して使用可能となっています。  

参考: https://tools.ietf.org/html/rfc6749#section-4.5

認証Pluginはこれと対応する形で記述するものです。  

## 認証Pluginの振舞
認証Pluginを導入することで以下が拡張されます。  

- [Account登録](../apiref/current/212_Create_Account.md)時、認証Pluginに定義されたTypeが指定可能になります
- 認証Pluginに定義されたgrant_typeで[OAuth 2.0 トークンエンドポイント](../apiref/current/293_OAuth2_Token_Endpoint.md)を呼び出すことで、認証Pluginの認証機能を呼び出すことが可能になります
- 認証Pluginに定義されたgrant_typeで[OAuth 2.0 トークンエンドポイント](../apiref/current/293_OAuth2_Token_Endpoint.md)を呼び出した場合、Bodyに自由なkey-valueを指定することが可能になります

## Repositories
* [personium-plugin-sample](https://github.com/personium/personium-plugin-sample)

## Installation
Personium Open Sourceで公開している認証Pluginのセットアップ方法を記載します。  
### JARファイルの作成
認証PluginのビルドにはMavenが必要です。  
http://maven.apache.org/install.html を参考にインストールを行ってください。  

対象のリポジトリ(personium-plugin-xxxxx)をチェックアウトし、以下を行ってください。  
```
cd personium-plugin-xxxxx
mvn clean package -DskipTests
```
"personium-plugin-xxxxx/target"配下にJARファイルが作成されます。

### Install
JARファイルをAPサーバに配備し、再起動してください。  
デフォルトの配備先Pathは"/personium/personium-core/plugins"です。  
```
# cp personium-plugin-xxxxx/target/personium-plugin-xxxxx.jar /personium/personium-core/plugins
# systemctl restart tomcat
```

### Update
認証Pluginをアップデートしたい場合は、JARファイルを上書きして、インストール時と同様に再起動を行ってください。
