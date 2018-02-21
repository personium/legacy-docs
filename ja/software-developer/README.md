# サーバ開発者向けガイド

Personiumのサーバソフトウェアそのものの開発に貢献したい人向けのドキュメントです

## サーバソフトウェアの構成

Personiumの主要構成要素は以下2つのJava Web アプリケーションプログラムで、いずれもサーブレットコンテナ上で動作します。

|モジュール名|概要|JavaDoc|
|:--|:--|:--|
|[personium-core](https://github.com/personium/personium-core)|Personiumのメインサーバプログラム|準備中|
|[personium-engine](https://github.com/personium/personium-engine)|coreの配下でEngine機能を担当するサブサーバプログラム|準備中|

これらのモジュールは以下の共通ライブラリに依存しています。

|ライブラリ|概要|依存モジュール|リポジトリ|JavaDoc|
|:--|:--|:--|
|personium-lib-common|core/engineで共通的に使うユーティリティ|core, engine|
|personium-lib-es-adapter|ElasticSearchへの接続を担うモジュール。ElasticSearchバージョンアップに伴う軽微非互換を吸収することを主たる目的としています。|core, engine|
|personium-client-java|Personium のJava client ライブラリ. Engineで使用|engine|
|personium-plugin-base|Personium プラグイン記述のためのベース|core|
|personium-ex-base|Personium エンジン拡張記述のためのベース|engine|

ライブラリの依存関係についてはMavenにて管理しており、現在は以下にあるプロジェクトのmavenリポジトリで管理をしています。

    http://personium.io/mvnrepo/


## Personium Core

* Javadoc情報などを今後掲載予定
* 依存ライブラリはmavenのpom.xmlをご覧ください。

## Personium Engine

* Javadoc情報などを今後掲載予定
* 依存ライブラリはmavenのpom.xmlをご覧ください。


### 関連するリポジトリ

* [personium-core](https://github.com/personium/personium-core)
* [personium-engine](https://github.com/personium/personium-engine)
* [personium-lib-common](https://github.com/personium/personium-lib-common)
* [personium-lib-es-adapter](https://github.com/personium/personium-lib-es-adapter)
* [personium-client-java](https://github.com/personium/personium-client-java)
