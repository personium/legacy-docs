# データの管理
### 2種類のデータ管理
PersoniumではユーザのデータをElasticsearchとファイルシステムで管理している。<br>Elasticsearch上のデータはOData、ファイルシステム上のデータはWebDAVのインターフェースに従っている。

* OData (Open Data Protocol)<br>Webアプリにおいてデータのアクセス方法を標準化したプロトコル。<br>WebAPIの標準的なHTTPリクエストでJSONやXMLデータをレスポンスとして返す。<br>OData公式 : http://www.odata.org/

* WebDAV (Web-based Distributed Authoring and Versioning)<br>HTTP1.1を拡張したWebサーバ上のファイル管理を目的としたプロトコル。<br>純粋なHTTP拡張の為Proxy環境下などでも問題なく利用が可能。<br>HTTP標準に加え、PROPFINDなどいくつかのメソッドが追加されている。<br>WebDAV公式 : http://webdav.org/

### 各オブジェクトデータの管理
Personiumの各オブジェクトの管理を示す。

|分類|オブジェクト|インターフェース種別|
|:--|:--|:--|
|ユニット制御オブジェクト|Cell|OData|
|Cell制御オブジェクト|Role<br>Account<br>Box<br>ExtCell<br>Relation<br>ExtRole<br>SentMessage<br>ReceivedMessage|OData|
|Boxリソーススキーマ|ODataServiceCollection<br>WebDAVServiceCollection<br>EngineServiceCollection|WebDAV|
|Boxリソース<br>ファイル|ファイル<br>サービスコレクションソース|WebDAV|
|Boxリソース<br>OData|EntityType<br>AssociationEnd<br>ComplexType<br>Property<br>ComplexTypeProperty<br>Entity|OData|
|アクセス制御設定|ACL (Cell Level)<br>ACL (Box Level)|WebDAV|
<br>
#### 参考情報
例えばバックアップ目的などでセル内のデータを取得したい場合、PersoniumのAPIを実行することで可能。
> Accountのパスワードは取得不可。<br>今後一括でデータ取得可能なAPIを実装予定。

##### OData空間のデータ取得
該当するオブジェクトそれぞれの一覧取得APIを実行しデータを取得。<br>データ量が多い場合などはAPI実行時のクエリを活用し、複数回に分けて取得すると良い。

* $inlinecount : 検索結果の件数を取得する
* $top : 取得する件数を制限する
* $skip : 指定した数だけ検索結果をスキップして取得する
* $orderby : 検索結果をソートする

##### WebDAV空間のデータ取得
**ACL (Cell Level)**<br>Cellのプロパティ取得APIを実行する。<br>

**Boxリソース**<br>コレクション設定取得APIをdepth=1で実行する。<br>コレクション設定取得APIで以下の情報が取得できる。

* Resource Path
* Resource Type (ODataServiceCollection, WebDAVServiceCollection, EngineServiceCollection, ファイル)
* ACL

Resource TypeがWebDAVServiceCollection or EngineServiceCollectionの場合、その配下に対して再帰的にコレクション設定取得APIを実行し情報を取得する。<br>Resource Typeがファイルの場合、ファイル取得APIを実行しファイルを取得する。

##### 取得したデータの投入
該当するオブジェクトの作成/登録APIを実行する。<br>複数データが存在する場合は再帰的に実行する。
