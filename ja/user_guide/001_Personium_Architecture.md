# Personiumのアーキテクチャ

## 基本となる3階層のオブジェクト
Personiumはデータ主体中心のICT実現のため以下3階層の基本オブジェクトを定義しています。

![3階層オブジェクト](image/3LayerStructure.png "3階層オブジェクト")

|名称|概要|URL例|
|:--|:--|:--|
|Unit|多数のCellをホストするサーバ|https://personium.example/|
|Cell|データ主体ごとのデータストア|https://personium.example/john.doe/|
|Box|アプリケーション毎のデータ領域|https://personium.example/john.doe/schedule/|

### Unit

* Unitは、一意のFQDNを持つPersoniumを実行するシステムインフラストラクチャです。
* Personiumは独自の分散アーキテクチャを採用しているため、Unit間の関係を作成し、それに基づいて特権を与えることが可能です。
* Unitでは、複数のCellを作成することができます。

### Cell

* Cellは、Personiumの基本的な概念です。
* 各Cellは、マルチテナント・モデルで異なるテナントであるかのように独立しています。
* Cellは以下の機能を提供します。

	* 認証と承認
	* アクセス制御
	* アプリケーション用データストア（Box）
	* イベント処理、メッセージング、スクリプト実行


### Box

* Boxは、アプリケーション用のデータストアです。
* Boxには、以下のデータを格納できます。

	* ディレクトリ
	* ファイルオブジェクト
	* ODataデータサービス


## 国際標準に基づく設計

Personiumは様々な国際標準をベースにこれを拡張したり組み合わせて構築されています。

* 認可のためのOAuth2.0
* ファイル操作のためのWebDAV
* リレーショナルデータのOData
