# Unitの設定一覧
ユニット設定ファイルは、Personiumユニットの設定を管理するファイルです。  
デフォルトの設定は、GitHubソース上の"personium-unit-config-default.properties"ファイルで定義されています。  
デフォルトの設定は変更しないでください。  
設定を変更したい場合、"personium-unit-config.properties"という名前のjavaプロパティファイルを配置し、サーブレットコンテナを起動してください。  
その後ユニットは、"personium-unit-config.properties"で定義された各設定項目の値で、"personium-unit-config-default.properties"で定義されているデフォルト値を置き換えます。  

"personium-unit-config.properties"の配置場所はJavaのシステムプロパティで指定可能です。
```
io.personium.configurationFile={ファイル名まで含めたPath}
```
指定されたファイルが存在しない、またはシステムプロパティで指定されていない場合、クラスパス上の"personium-unit-config.properties"を読み込みます。
<br>
#### キー名について
すべてのキーは、以下のキープレフィックスを持ちます。
```
io.personium.core.
```
例としてユニット証明書の設定には次のキーを使用する必要があります。
```
io.personium.core.x509.crt
```
<br>
### 変更必須設定
Personiumを運用する上でデフォルトから変更を必須としている設定です。

|キー|説明|値|記載例|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|x509.key|X509秘密鍵を配置したパス|DER形式秘密鍵のフルパス|/opt/x509/localhost.key|core, engine|<br>|
|x509.crt|X509証明書を配置したパス|DER形式証明書のフルパス|/opt/x509/localhost.crt|core, engine|<br>|
|x509.root|X509ルート証明書を配置したパス|信頼すべきDER形式ルート証明書のフルパス<br>スペース区切りで複数指定可能|/opt/x509/personium_ca.crt|core, engine|何も指定しなければ(キーの定義もしない)、Personium公式CAの証明書は自動的に信頼されます。|
|security.secret16|トークンとファイル生成時の暗号化キー|16桁の16進文字列|secret16abcdefgh|core, engine|<br>|
|security.auth.password.salt|パスワードハッシュソルト値|16桁の16進文字列|saltijkl|core|<br>|
|unitUser.issuers|ユニットユーザトークン発⾏者として認定する文字列<br>セルURLを指定することでそのセルをユニットユーザトークン発行者として指定できます|文字列URL<br>スペース区切りで複数指定可能|http://localhost:8080/UnitUserCell/ |core|<br>|

<br>
### 変更任意設定
Personiumを運用する上でデフォルトからの変更を任意としている設定です。

#### 基本設定
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|version|バージョン|文字列|1.5.3|core, engine|<br>|
|thread.pool.num|スレッドプール数|int|20|core|PersoniumUnit全体のスレッドプール数。今後機能ごとにスレッドプールを分割予定。|
|plugin.path|Personiumプラグイン配置先パス|プラグイン配置先フルパス|/personium/personium-core/plugins|core|<br>|
|unitScheme|ユニットのスキーム設定|"http" または "https"|https|core|開発用途にhttpを設定することも可能ですが、運用時には必ずhttpsを設定してください。|
|masterToken|マスタートークン|トークン文字列||core, engine|デフォルトは無効です。開発用途などで設定することもできますが、運用時には設定しないでください。|


#### OData
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|
|odata.batch.bulkRequestMaxSize|$batch処理を行う際のリクエスト最大件数|Int|1000|core|<br>|
|odata.batch.timeoutInMillis|$batch処理のタイムアウト時間(msec)|Long|270000|core|<br>|
|odata.batch.sleepInMillis|$batch処理のスリープ時間(msec)|Long|50|core|<br>|
|odata.batch.sleepIntervalInMillis|$batch処理のスリープ間隔(msec)|Long|1000|core|<br>|
|odata.links.NtoN.maxnum|N:Nの$linksが作成可能な最大件数|Int|10000|core|<br>|
|odata.query.expand.top.maxnum|$expand指定時の$top最大数|Int|100|core|<br>|
|odata.expand.retrieve.maxnum|$expandの最大展開数（一件取得時）|Int|1000|core|<br>|
|odata.query.top.maxnum|$topの最大値数|Int|10000|core|<br>|
|odata.query.skip.maxnum|$skipの最大値数|Int|100000|core|<br>|
|odata.query.top.defaultnum|一覧取得時のデフォルト返却件数|Int|25|core|<br>|
|odata.query.expand.property.maxnum.list|$expandのプロパティの最大値数（一覧取得時）|Int|2|core|<br>|
|odata.query.expand.property.maxnum.retrieve|$expandのプロパティの最大値数（一件取得時）|Int|10|core|<br>|

#### アカウント
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|account.lastauthenticated.enabled|パスワード認証成功時に、Accountの最終ログイン時刻を更新するか|true:更新する<br>false:更新しない|true|core|最終更新日時を記録すると認証処理内部で登録処理が⾏われるため、書き込みの多重ロックの影響を受けます（ロック範囲はセル単位）。<br>また書き込みが発生するため性能の低下が発生します。<br>Basic認証はこの設定で最終ログイン日時の記録は行われません。|

#### WebDAV
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|dav.childresource.maxnum|コレクションの子要素の最大数|Int|1024|core|<br>|
|dav.depth.maxnum|コレクションの階層の深さの最大数|Int|50|core|<br>|

#### セキュリティ
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|security.dav.encrypt.enabled|WebDAVファイルを暗号化するか|true:暗号化する<br>false:暗号化しない|false|core|<br>|

#### Lock
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|lock.type|Lockのタイプ|"memcached":Memcached<br>"inProcess":InProcess|memcached|core|<br>|
|lock.accountlock.time|アカウントロックの有効期限(sec)<br>認証失敗時にそのアカウントの認証をロックし、認証を失敗させる期間|Int|1|core|<br>|
|lock.retry.times|ロック取得時のリトライ回数|Int|50|core|<br>|
|lock.retry.interval|ロック取得リトライ時の間隔(msec)|Long|100|core|<br>|
|lock.cell.retry.times|セルロック取得時のリトライ回数|Int|50|core|<br>|
|lock.cell.retry.interval|セルロック取得リトライ時の間隔(msec)|Long|100|core|<br>|
|lock.memcached.host|ロックをmemcachedに保持する際のmemcachedホスト名|ホスト名|localhost|core|<br>|
|lock.memcached.port|ロックをmemcachedに保持する際のmemcachedポート番号|ポート番号|11211|core|<br>|
|lock.memcached.opTimeout|ロック用memcached operationタイムアウト値(msec)|Long|12000|core|<br>|

#### Elasticsearch
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|es.hosts|Elasticsearch ホスト名|Elasticsearchのノードを{host:port}形式で指定<br>カンマ区切りで複数指定可能|localhost:9300|core, engine|接続可能なノードが１つでも指定されていれば動作可能です。|
|es.cluster.name|Elasticsearch クラスタ名|文字列|clusterpersonium|core, engine|<br>|
|es.unitPrefix|Elasticsearchを使用する際、index生成時のindex名に用いるプレフィックス|文字列|u0|core, engine|通常はユニット名を指定します。|
|es.topnum|Elasticsearch の検索結果出力上限数|Int|10000|core|<br>|
|es.retryTimes|エラー発生時のリトライ回数|Int|3|core|<br>|
|es.retryInterval|エラー発生時のリトライ間隔(msec)|Int|1500|core|<br>|

#### BinaryData
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|binaryData.physical.delete.mode|ファイル削除時に物理削除するか|true:物理削除<br>false:論理削除|true|core|論理削除時は削除されたファイルが残り続けるためディスクを圧迫する可能性があります。|
|binaryData.fsync.enabled|ファイルへの書き込み時にfsyncを有効にするか|true:有効<br>false:無効|false|core, engine|有効にした場合WebDAVのファイルを書き込む際にfsyncを行うためWebDAV登録性能が劣化します。<br>バックアップをスナップショットなどで取得したりディスクへの書き込みを厳密にする必要がある場合は有効にします。|
|binaryData.dav.retry.count|Davファイルのハードリンク作成/改名/削除時のリトライ回数|Int|100|core|<br>|
|binaryData.dav.retry.interval|Davファイルのハードリンク作成/改名/削除時のリトライ間隔(msec)|Long|50|core|<br>|

#### BlobStore
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|blobStore.root|blobデータを格納するルートパス|ディレクトリのフルパス|/personium_nfs/personium-core/dav|core, engine|<br>|

#### ユーザデータ
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|box.odata.schema.MaxEntityTypes|EntityTypeの最大数|Int|100|core|<br>|
|box.odata.schema.MaxProperties|EntityTypeに含まれるプロパティの最大数|Int|400|core|<br>|
|box.odata.schema.property.LayerLimits.SimpleType|各階層のSimpleTypeの最大数|Int<br>カンマ区切り|*,50,30,10|core|<br>|
|box.odata.schema.property.LayerLimits.ComplexType|各階層のComplexTypeの最大数|Int<br>カンマ区切り|20,5,2,0|core|<br>|

#### Event
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|event.log.current.dir|イベントログファイルの格納ディレクトリ|ディレクトリのフルパス|/personium_nfs/personium-core/eventlog|core|<br>|

#### キャッシュ
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|cache.type|キャッシュのタイプ|"memcached":memcachedでキャッシュ<br>"none":キャッシュ無効|memcached|core|noneにした場合管理情報を毎回Elasticsearchに問い合わせるためElasticsearchの負荷が上昇します。|
|cache.cell.enabled|Cellのキャッシュを有効とするか|true:有効<br>false:無効|true|core|<br>|
|cache.box.enabled|Boxのキャッシュを有効とするか|true:有効<br>false:無効|true|core|<br>|
|cache.schema.enabled|Schemaのキャッシュを有効とするか|true:有効<br>false:無効|true|core|<br>|
|cache.memcached.host|memcachedホスト名|ホスト名|localhost|core|<br>|
|cache.memcached.port|memcachedポート番号|ポート番号|11212|core|<br>|
|cache.memcached.opTimeout|memcached operationタイムアウト値(msec)|Long|12000|core|<br>|
|cache.memcached.expiresin|キャッシュ有効期間(sec)|Int|86400|core|<br>|

#### Engine
Engine設定はCoreからEngineへアクセスする際に使用します。
```
http://{engine.host}:{engine.port}/{engine.path}
```
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|engine.host|Engineサーバのホスト名|ホスト名|localhost|core|<br>|
|engine.port|Engineサーバのポート番号|ポート番号|8080|core|<br>|
|engine.path|Engineのパス|パス|personium-engine|core|<br>|

#### barファイル
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|bar.file.maxSize|barファイルの最大ファイルサイズ(MB)|Long|100|core|<br>|
|bar.entry.maxSize|barファイル内エントリの最大ファイルサイズ(MB)|Long|10|core|<br>|
|bar.userdata.linksOutputStreamSize|ユーザデータのリンク処理時にレスポンスを返却するサイズ|Long|5|core|<br>|
|bar.userdata.bulkSize|ユーザデータの一括登録件数|Long|1000|core|<br>|
|bar.installfile.dir|barファイルやログ詳細の格納用ルートディレクトリ|ディレクトリのフルパス|/personium_nfs/personium-core/barInstall|core|<br>|
|bar.progress.expireInSec|memcachedに格納するbarインストール処理状況の有効期限(sec)|Int|259200|core|<br>|

#### OpenID Connect
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|oidc.google.trustedClientIds|Google OpenID Connectにおいて、このユニットが信頼するClientID<br>スペース区切りで複数指定可能|文字列|*|core|"*"を指定した場合全てのClientIDを信頼する<br><b>将来的にPlugin独自設定として移動予定</b>|

#### CellSnapshot
|キー|説明|値|デフォルト値|使用コンポーネント|備考|
|:--|:--|:--|:--|:--|:--|
|cellSnapshot.root|snapshotデータを格納するルートパス|ディレクトリのフルパス|/personium_nfs/personium-core/snapshot|core|<br>|
