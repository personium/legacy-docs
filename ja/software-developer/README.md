# サーバ開発者向けガイド

Personiumのサーバソフトウェアそのものの開発に貢献したい人向けのドキュメントです

## サーバソフトウェアの構成

Personiumの主要構成要素は以下2つのJava Web アプリケーションプログラムで、いずれもサーブレットコンテナ上で動作します。

|モジュール名|概要|JavaDoc|
|:--|:--|:--|
|[personium-core](https://github.com/personium/personium-core)|Personiumのメインサーバプログラム|準備中|
|[personium-engine](https://github.com/personium/personium-engine)|coreの配下でEngine機能を担当するサブサーバプログラム|準備中|

これらサーバプログラムをTomcatなどのJavaサーブレットコンテナで動作させ、NginxやApacheなどのリバースプロキシサーバ経由で適切に用いて構築することでPersoniumのユニットとなります。

またバックエンドとして以下のミドルウェアに依存しています。

|モジュール名|概要|必須|用途|
|:--|:--|:--|:--|
|ElasticSearch|Scalable NoSQL Search Engine|Yes|Datastore to support our OData interface.|
|ActiveMQ|Java Message Service (JMS) 実装 |Yes|Event Handling|
|Memcached|汎用の分散型メモリキャッシュシステム|no|Lock/Cache|


## 依存ライブラリとその管理

Personium のサーバモジュール (core/engine)は以下のライブラリやその他のオープンソースライブラリに依存しています。

|ライブラリ|概要|依存モジュール|JavaDoc|
|:--|:--|:--|:--|
|personium-lib-common|core/engineで共通的に使うユーティリティ|core, engine|準備中|
|personium-lib-es-adapter|ElasticSearchへの接続を担うモジュール。ElasticSearchバージョンアップに伴う軽微非互換を吸収することを主たる目的としています。|core, engine|準備中|
|personium-client-java|Personium のJava client ライブラリ. Engineで使用|engine|準備中|
|personium-plugin-base|Personium プラグイン記述のためのベース|core|準備中|
|personium-ex-base|Personium エンジン拡張記述のためのベース|engine|準備中|

ライブラリの依存関係についてはMavenにて管理しており、現在は以下にあるプロジェクトのmavenリポジトリで管理をしています。

    http://personium.io/mvnrepo/

詳しくは各プロジェクトのルートにあるpom.xmlを参照してください。Personiumプロジェクトでは私たちの成果物をApache 2.0ライセンスに基づいてユーザの皆さんに使っていただけるよう、同ライセンスと互換性のあるライブラリのみで構成するポリシーとしています。


### 関連するリポジトリ

* [personium-core](https://github.com/personium/personium-core)
* [personium-engine](https://github.com/personium/personium-engine)
* [personium-lib-common](https://github.com/personium/personium-lib-common)
* [personium-lib-es-adapter](https://github.com/personium/personium-lib-es-adapter)
* [personium-client-java](https://github.com/personium/personium-client-java)
