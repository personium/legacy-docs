# Personiumの概念

### 国際標準に基づく設計

Personiumは国際標準をベースに構築されています。

* 認可のためのOAuth2.0
* ファイル操作のためのWebDAV
* リレーショナルデータのOData

### 基本となる3階層のオブジェクト
Personiumは基本となる以下の3階層で構成されています。

![3階層オブジェクト](image/3LayerStructure.png "3階層オブジェクト")

#### Unit

* Unitは、一意のFQDNを持つPersoniumを実行するシステムインフラストラクチャです。

* Personiumは独自の分散アーキテクチャを採用しているため、Unit間の関係を作成し、それに基づいて特権を与えることが可能です。

* Unitでは、複数のCellを作成することができます。

#### Cell

* Cellは、Personiumの基本的な概念です。
* 各Cellは、マルチテナント・モデルで異なるテナントであるかのように独立しています。

* Cellは以下の機能を提供します。

	* 認証と承認
	* アクセス制御
	* アプリケーション用データストア（Box）
	* イベント処理、メッセージング、スクリプト実行


#### Box

* Boxは、アプリケーション用のデータストアです。

* Boxには、以下のデータを格納できます。

	* ディレクトリ
	* ファイルオブジェクト
	* ODataデータサービス

### Boxインストール
* barファイルを使って指定されたパスにBoxをインストールすることが可能です。
* 詳細は[こちら](./006_Box_install.html)をご覧下さい。


### Collection
* Collectionは、Boxの中に格納されたデータ集合です。
* 以下の3種類が存在します。

	* ###### [WebDAVモデル](./007_WebDAV_model.html)
	* ###### ODataモデル
	* ###### サービスのモデル

### Cell制御オブジェクト
![Cell制御オブジェクトE-R図](image/cell_ctrl_obj.png "Cell制御オブジェクトE-R図")

![セル制御オブジェクトの$link作成組み合わせ一覧](image/LinkingCellControlObjects.gif "セル制御オブジェクトの$link作成組み合わせ一覧")

### Account
準備中

### Role
準備中

### Relation
準備中

### ExtCell
準備中

### ExtRole
準備中
