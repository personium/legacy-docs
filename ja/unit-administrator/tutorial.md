**※この文書はPersonium Version 1.6.15 以降をご利用される方を対象としています。**
# Personiumユニット管理 チュートリアル
##### [1. 本文書の目的](#sect1)
##### [2. 本文書の読者](#sect2)
##### [3. Unit, Cell, Boxの概要説明](#sect3)
##### [4. トークンについて](#sect4)
##### [5. PDSを利用者に払い出す](#sect5)
##### 　　[5-1. Cellの作成](#sect5.1)
##### 　　[5-2. Cellの管理者Accountの作成](#sect5.2)
##### 　　　　[5-2-1. Accountの作成](#sect5.2.1)
##### 　　　　[5-2-2. Roleの作成](#sect5.2.2)
##### 　　　　[5-2-3. AccountとRoleの紐づけ](#sect5.2.3)
##### 　　　　[5-2-4. ACLの設定](#sect5.2.4)
##### 　　[5-3. メインBoxへの最初のデータ配置](#sect5.3)
##### 　　　　[5-3-1. profile.json を置く](#sect5.3.1)
##### 　　[5-4. 一般ユーザー向けの操作画面を設定する](#sect5.4)
##### 　　[5-5. GUIから使ってみる](#sect5.5)
##### [6. 払い出したPDSを削除する](#sect6)
##### [7. GUI操作のデモ動画を見てみる](#sect7)
##### [8. PDSの払い出しを自動化する](#sect8)


## <a name="sect1">1. 本文書の目的</a>
本文書は、Personiumを初めてご利用される方でも、すぐにPersoniumユニットを管理するための基本的な流れをご理解いただけるよう具体的な手順を説明したものです。  

Personiumでは全ての機能をREST APIで提供しておりますので、OSや開発言語を問わずご利用いただけます。
javascriptを用いたサンプルソースが公開されていますので、是非ご活用ください。

* [MinimalApp](https://github.com/personium/template-app-cell) … 「Hello world」相当の最小限のアプリ。
* [MyBoard](https://github.com/personium/app-myboard) … ACL管理・データ開示の操作をdemoするPersoniumアプリ。

なお、本文書でAPIを呼び出すサンプルについては、すべて[cURL](https://curl.haxx.se/)を使用しています。

## <a name="sect2">2. 本文書の読者</a>

本文書は、Personiumを初めて使用される方を対象としています。
本文書を読むためには、以下の知識が必要です。

* インターネットに関する基本的な知識
* Representational State Transfer(REST)に関する基本的な知識
* 使用するオペレーティングシステムに関する基本的な知識

## <a name="sect3">3. Unit, Cell, Boxの概要説明</a>
「Personium」を使用する上で最低限押えてべきキーワードを抜粋しました。
本チュートリアル内でも何度も出てくるキーワードになります。

|キーワード<br>|概要<br>|
|:--|:--|
|Unit<br>|「Personium」のサーバ内で、複数のセルから構成されるデータ領域。<br>完全修飾ドメイン名（UnitFQDN）を持ち、絶対ドメイン名として参照される。<br>|
|Cell<br>|データ主体ごとのData Strore。個人で使う場合はPDS(Personal Data Store)となる。<br>「Personium」では、データ主体という概念を人のみでなく組織やモノなどにも拡張したモデル化を行っているため、組織やモノのデータストアとしても使うことが可能。<br>（例、私のCell, あなたのCell, ○○会社のCell, ○○部のCell, 私の車のCell）<br>|
|Box<br>|アプリケーションに用いるデータを格納する領域。<br>自身もWebDAVコレクションの一つである。一意の名前とスキーマURLを持つ。<br>Cellは、Box未作成でも初期状態で1つのBox（メインボックス） を持ち、削除は不可。<br>|

## <a name="sect4">4. トークンについて</a>

本文書では、Personiumユニットの操作のためユニットマスタートークン、またはユニットユーザートークンを使用します。ユニットマスタートークンやユニットユーザートークンの詳細については[こちら](Unit-User.md)を参照ください。  

Ansible を使って構築した環境のユニットマスタートークンやユニットユーザーのアカウント名／パスワードの確認方法は[こちら](../server-operator/Confirm_environment_settings.md)を参照してください。  
独自に環境を構築された場合はサーバソフトウェア管理者に確認してください。

## <a name="sect5">5. PDSを利用者に払い出す</a>
実際のPersoniumの運用において、これら一連のAPI操作はプログラムで自動化することになるかと思いますが、本チュートリアルでは一つ一つ手動で実施してみましょう。

### <a name="sect5.1">5-1. Cellの作成</a>
何も入っていない空のCell(PDS)を作ります。

新たなCellを追加作成する前に、Cell一覧取得APIで事前の状態を確認してみましょう。
構築直後のPersoniumユニットには、ユニット管理用のCellのみ登録されている状態です。

```sh
curl "https://{Personium_FQDN}/__ctl/Cell" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {Token}"
```

ユニット管理用のCellの情報1件がレスポンスに返ります。
この状態が Personiumユニット の初期状態です。

```json
{
	"d": {
		"results": [
			{
				"__metadata": {
					"uri": "https:\/\/jp-west-1-dev-2034289.k5personium.cloud\/__ctl\/Cell('unitadmin')",
					"etag": "W\/\"1-1537265056908\"",
					"type": "UnitCtl.Cell"
				},
				"Name": "unitadmin",
				"__published": "\/Date(1537265056908)\/",
				"__updated": "\/Date(1537265056908)\/"
			}
		]
	}
}
```

では、実際にCellを作成してみましょう。
Cell作成APIを呼び出す際に、Cellの名前を任意に指定します。
この例では "usercell" が Cell名になります。
>**（注意）**
>**CellのルートURLは公開となります。**
>**Cell名にメールアドレスなどをそのまま使用すると、レスポンスに依って存在の有無が判明してしまいますので注意が必要です。**

```sh
curl "https://{Personium_FQDN}/__ctl/Cell" \
-X POST -i -k \
-d "{\"Name\":\"usercell\"}" \
-H "Authorization:Bearer {Token}"
```

成功すると、今回作成されたCellの情報がレスポンスに返ります。

```json
{
	"d": {
		"results": {
			"__metadata": {
				"uri": "https://{Personium_FQDN}/__ctl/Cell('usercell')",
				"etag": "W\/\"1-1539241336221\"",
				"type": "UnitCtl.Cell"
			},
			"Name": "usercell",
			"__published": "\/Date(1539241336221)\/",
			"__updated": "\/Date(1539241336221)\/"
		}
	}
}
```

再度Cell一覧取得APIを呼び出すと"usercell"が追加されている状態がレスポンスに返ります。

```json
{
	"d": {
		"results": [
			{
				"__metadata": {
					"uri": "https:\/\/jp-west-1-dev-2034289.k5personium.cloud\/__ctl\/Cell('unitadmin')",
					"etag": "W\/\"1-1537265056908\"",
					"type": "UnitCtl.Cell"
				},
				"Name": "unitadmin",
				"__published": "\/Date(1537265056908)\/",
				"__updated": "\/Date(1537265056908)\/"
			},
			{
				"__metadata": {
					"uri": "https:\/\/jp-west-1-dev-2034289.k5personium.cloud\/__ctl\/Cell('usercell')",
					"etag": "W\/\"1-1539241336221\"",
					"type": "UnitCtl.Cell"
				},
				"Name": "usercell",
				"__published": "\/Date(1539241336221)\/",
				"__updated": "\/Date(1539241336221)\/"
			}
		]
	}
}
```

### <a name="sect5.2">5-2. Cellの管理者Accountの作成</a>
Accountは特定のCellに属するユーザを意味し、アカウント名やパスワードといった情報に依って保持されます。
1つのCellに対して複数のAccount登録が可能です。

#### <a name="sect5.2.1">5-2-1. Accountの作成</a>
前項で作成したCellにAccountを作成します。

Accountを追加作成する前に、Account一覧取得APIで事前の状態を確認してみましょう。
作成したばかりのCellにはAccountが登録されていない状態です。

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Account" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {Token}"
```

Accountの情報が無い様子がレスポンスに返ります。
```json
{
	"d": {
		"results": []
	}
}
```

Accountを作成してみましょう。
Account作成APIを呼び出す際に、Accountの名前を任意に指定します。
この例では"me"がAccount名、"password"がパスワードになります。

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Account" \
-X POST -i -k \
-d "{\"Name\":\"me\"}" \
-H "X-Personium-Credential:password" -H "Content-Type: application/json" -H "Authorization:Bearer {Token}"
```

成功すると、今回作成されたAccountの情報がレスポンスとして返ります。
```json
{
	"d": {
		"results": {
			"__updated": "/Date(1484724933394)/",
			"__published": "/Date(1484724933394)/",
			"Cell": null,
			"Type": "basic",
			"LastAuthenticated": null,
			"Name": "me",
			"__metadata": {
				"type": "CellCtl.Account",
				"etag": "W/\"1-1484724933394\"",
				"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')"
			}
		}
	}
}
```

再度Account一覧取得APIを呼び出すと"me"が在る状態がレスポンスに返ります。

```json
{
	"d": {
		"results": [
			{
				"_ReceivedMessageRead": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')/_ReceivedMessageRead"
					}
				},
				"__metadata": {
					"type": "CellCtl.Account",
					"etag": "W/\"1-1484724933394\"",
					"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')"
				},
				"Name": "me",
				"LastAuthenticated": null,
				"Type": "basic",
				"Cell": null,
				"__published": "/Date(1484724933394)/",
				"__updated": "/Date(1484724933394)/",
				"_Role": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')/_Role"
					}
				}
			}
		]
	}
}
```

#### <a name="sect5.2.2">5-2-2. Roleの作成</a>
前項でAccountを作成したCellにRoleを作成します。
Roleとは、administorator、teacher、studentといった役割を表しており、Cellにアクセスする権限を設定し保持するものです。

Roleを追加作成する前に、Role一覧取得APIで事前の状態を確認してみましょう。
作成したばかりのCellにはRoleが登録されていない状態です。

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {Token}"
```

Roleの情報が無い様子がレスポンスに返ります。

```json
{
	"d": {
		"results": []
	}
}
```

Roleを作成してみましょう。
Role作成APIを呼び出す際に、Roleの名前を任意に指定します。
この例では"adminrole"がRole名になります。

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role" \
-X POST -i -k \
-d "{\"Name\":\"adminrole\"}" \
-H "Accept:application/json" -H "Authorization:Bearer {Token}"
```

成功すると、今回作成されたRoleの情報がレスポンスとして返ります。

```json
{
	"d": {
		"results": {
			"_Box.Name": null,
			"__updated": "/Date(1484728984079)/",
			"__published": "/Date(1484728984079)/",
			"Name": "adminrole",
			"__metadata": {
				"type": "CellCtl.Role",
				"etag": "W/\"1-1484728984079\"",
				"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)"
			}
		}
	}
}
```

再度Account一覧取得APIを呼び出すと"adminrole"が在る状態がレスポンスに返ります。

```json
{
	"d": {
		"results": [
			{
				"_Relation": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_Relation"
					}
				},
				"_ExtRole": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_ExtRole"
					}
				},
				"__metadata": {
					"type": "CellCtl.Role",
					"etag": "W/\"1-1484728984079\"",
					"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)"
				},
				"Name": "adminrole",
				"_Box.Name": null,
				"__published": "/Date(1484728984079)/",
				"__updated": "/Date(1484728984079)/",
				"_Box": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_Box"
					}
				},
				"_Account": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_Account"
					}
				},
				"_ExtCell": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_ExtCell"
					}
				}
			}
		]
	}
}
```

#### <a name="sect5.2.3">5-2-3. AccountとRoleの紐づけ</a>
作成したAccountとRoleを関係付けます。
これまでに作成したAccountとRoleは同じCellに属する形で存在しますが、それぞれは直接的な関係性を持たず独立している状態です。

操作を行う前にRole $links一覧取得APIで事前の状態を確認してみましょう。
Roleは作成直後の状態であり、対Accountに限らず紐付けの設定は無い状態です。

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role('adminrole')/\$links/_Account" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {Token}"
```

Roleに設定された関係性の情報が無い様子がレスポンスに返ります。

```json
{
	"d": {
		"results": []
	}
}
```

Role_$links登録APIを呼び出してAccountを相手とする紐付けを行ってみましょう。
(この逆方向の操作としてAccount_$links登録APIをRole相手に呼び出しても同じ結果となります)

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role('adminrole')/\$links/_Account" \
-X POST -i -k \
-d "{\"uri\":\"https://{Personium_FQDN}/usercell/__ctl/Account('me')\"}" \
-H "Accept:application/json" -H "Authorization:Bearer {Token}"
```

このAPIはjson形式のレスポンス(ボディ)を返しません。
ステータスが204で返れば成功です。

```
HTTP/1.1 204 No Content
```

再度Role $links一覧取得APIを呼び出すと(Roleに対して)紐付いたAccountの情報がレスポンスに返ります。

```json
{
	"d": {
		"results": [
			{
				"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')"
			}
		]
	}
}
```

#### <a name="sect5.2.4">5-2-4. ACLの設定</a>
作成したCellに対してアクセス権を設定します。
すべてのrole(役割)に対して設定('root'指定)することも、細かくRole別にアクセス権を設定する事も可能です。
前項のRoleとAccountの紐付けに従い、Account(User)のアクセス権限が決定します。

セルレベルアクセス制御設定APIを使用します。

```sh
curl "https://{Personium_FQDN}/usercell" \
-X ACL -i -k \
-d "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
<D:acl xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\" xml:base=\"https://{Personium_FQDN}/usercell/__role/__/\">\
<D:ace><D:principal><D:href>adminrole</D:href></D:principal><D:grant><D:privilege>\
<p:root/></D:privilege></D:grant></D:ace></D:acl>" \
-H "Accept:application/json" -H "Authorization: Bearer {Token}"
```

(リクエストボディ部分の展開表示)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns" xml:base="https://{Personium_FQDN}/usercell/__role/__/">
	<D:ace>
		<D:principal>
			<D:href>adminrole</D:href>
		</D:principal>
		<D:grant>
			<D:privilege>
				<p:root/>
			</D:privilege>
		</D:grant>
	</D:ace>
</D:acl>
```

このAPIはjson形式のレスポンス(ボディ)を返しません。
ステータスが200で返れば成功です。

```
HTTP/1.1 200 OK
```

### <a name="sect5.3">5-3. メインBoxへの最初のデータ配置</a>
メインBoxとは、Cellの作成時にデフォルトで作成される、”__”(アンダーバー2つ)と名づけられた特別なBoxです。
この特別なBoxは、削除出来ない事を除き通常のBoxと同様です。
アプリケーションデータを保管したり、そのCellの固有情報（json形式を用いる）を格納したりする目的に使われます。

#### <a name="sect5.3.1">5-3-1. profile.json を置く</a>
profile.jsonファイルは、PDSの公開プロフィール情報を配置するために必要なjson形式のファイルです。
PersoniumのPDS事業者間の相互接続運用のために、profile.jsonファイルをメインBoxの直下に配置することを推奨しています。
profile.jsonのサンプルは[こちら](https://demo.personium.io/app-uc-cell-creator-wizard/__/defaultProfile.json)をご覧ください。
>※このファイルを置かないでPDSを運用することもできます。
>APIの振舞いとしてこのファイルを特別に扱うということはありませんが、後述のサンプルGUIを操作する場合も、このファイルの存在と匿名アクセス(Authorizationヘッダなしアクセス)可能性を前提としています。

実際にprofile.jsonを配置してみましょう。
配置するにはファイル登録更新APIを使用します。
この例では"John Doe"が表示名、"Senior Director, Personium Project"が説明になります。
また、Imageの値にはプロフィール画像のURLを指定します。以下の例では画像データのデータURIスキームを指定しています。

```sh
curl "https://{Personium_FQDN}/usercell/__/profile.json" \
-X PUT -i -k \
-d "{\"DisplayName\":\"John Doe\",\"Description\": \"Senior Director, Personium Project\",\
\"Image\": \"{画像データをBase64エンコードしたもの}\"}" \
-H "Authorization:Bearer {Token}"
```

このAPIはjson形式のレスポンス(ボディ)を返しません。
ステータスが201で返れば成功です。

```
HTTP/1.1 201 Created
```

profile.jsonを配置後、profile.jsonに対してアクセス権を設定します。
アクセス制御設定APIを使用します。

```sh
curl "https://{Personium_FQDN}/usercell/__/profile.json" \
-X ACL -i -k \
-d "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
<D:acl xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"  p:requireSchemaAuthz=\"none\" \
xml:base=\"https://{Personium_FQDN}/usercell/__role/__/\">\
<D:ace><D:principal><D:all></D:all></D:principal><D:grant><D:privilege><D:read/></D:privilege></D:grant></D:ace></D:acl>" \
-H "Accept:application/json" -H "Authorization: Bearer {Token}"
```

(リクエストボディ部分の展開表示)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns" p:requireSchemaAuthz="none" xml:base="https://{Personium_FQDN}/usercell/__role/__/">
		<D:ace>
			<D:principal>
				<D:all></D:all>
			</D:principal>
			<D:grant>
				<D:privilege>
					<D:read/>
				</D:privilege>
			</D:grant>
		</D:ace>
</D:acl>
```

このAPIはjson形式のレスポンス(ボディ)を返しません。
ステータスが200で返れば成功です。

```
HTTP/1.1 200 OK
```

### <a name="sect5.4">5-4. 一般ユーザー向けの操作画面を設定する</a>
ブラウザでCell URLにアクセスした際、操作画面(Home画面)を表示することが可能です。
オープンソースプロジェクトで公開されているサンプルGUI(Home画面)を設定してみましょう。

操作画面(HomeApp画面)を設定するにはCellのプロパティを更新します。

```sh
curl "https://{Personium_FQDN}/usercell/" \
-X PROPPATCH -i -k \
-d "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
<D:propertyupdate xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"><D:set><D:prop>\
<p:relayhtmlurl>https://demo.personium.io/app-cc-home/__/index.html</p:relayhtmlurl></D:prop></D:set></D:propertyupdate>" \
-H "Accept: application/json" -H "Authorization: Bearer {Token}"
```

(リクエストボディ部分の展開表示)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:propertyupdate xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns">
	<D:set>
		<D:prop>
			<p:relayhtmlurl>https://demo.personium.io/app-cc-home/__/index.html</p:relayhtmlurl>
		</D:prop>
	</D:set>
</D:propertyupdate>
```

成功すると、更新されたプロパティの情報がレスポンスとして返ります。

```xml
<multistatus xmlns="DAV:">
	<response>
		<href>https://{Personium_FQDN}/usercell/</href>
		<propstat>
			<prop>
				<p:relayhtmlurl xmlns:p="urn:x-personium:xmlns" xmlns:D="DAV:">
				https://demo.personium.io/app-cc-home/__/index.html</p:relayhtmlurl>
			</prop>
			<status>HTTP/1.1 200 OK</status>
		</propstat>
	</response>
</multistatus>
```

また、Cell個別で設定する以外に、ユニット全体でデフォルト値を設定することもできます。  
ユニット設定ファイルの以下の値を更新することで可能です。  

```
io.personium.core.cell.relayhtmlurl.default
```

### <a name="sect5.5">5-5. GUIから使ってみる</a>

ここまででCellを払い出す準備ができました。<br>
* 管理者アカウント名 : me
* 管理者アカウントパスワード : password

上記情報を使ってGUIで動作を確認してみましょう。

```
https://{Personium_FQDN}/usercell
```

登録した profile.json の情報がログイン画面に表示され、管理アカウントでのログインが確認出来ます。  
オープンソースプロジェクトで公開されているサンプルGUIを使用せず、独自でインストールしたい方は[こちら](https://github.com/personium/app-cc-home)をご覧ください。

## <a name="sect6">6. 払い出したPDSを削除する</a>
払い出したCellを削除します。

Cell再帰的削除APIを使用して、ここまでチュートリアルで作成したCellを削除します。
このAPIは該当するCellに包含されたデータも含め、すべてを削除します。

```sh
curl "https://{Personium_FQDN}/usercell/" \
-X DELETE -i -k \
-H "X-Personium-Recursive: true" -H "If-Match: *" \
-H "Accept:application/json" -H "Authorization: Bearer {Token}"
```

このAPIはjson形式のレスポンス(ボディ)を返しません。
ステータスが204で返れば成功です。

```
HTTP/1.1 204 No Content
```

## <a name="sect7">7. GUI操作のデモ動画を見てみる</a>
「[5. PDSを利用者に払い出す](#sect5)」や「[6. 払い出したPDSを削除する](#sect6)」と同様の操作を、「Cell Creator Wizard」や「Unit Manager」と呼ばれるツールを用いてGUIで実施することができます。
<br>

Cell Creator Wizardについての詳細は[こちら](https://github.com/personium/app-uc-cell-creator-wizard)をご覧ください。
<br>
<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/M4cYLFYRyEk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>



Unit Managerについての詳細は[こちら](https://github.com/personium/app-uc-unit-manager/blob/master/README_ja.%6D%64)をご覧ください。
<br>
<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/d1_pET0M-YA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

「Unit Manager」使用時に必要となるログイン情報は、「[4. トークンについて](#sec4)」で取得したユニット管理アカウント情報をご使用ください。


## <a name="sect8">8. PDSの払い出しを自動化する</a>
PDSを払い出すための流れを理解していただくため、手動手順を掲載しましたが、
[5.1](#sect5.1)～[5.3](#sect5.3)の一連のAPI操作を自動化するプログラムのサンプルをご紹介します。
詳細は[こちら](https://github.com/personium/org-admin)をご覧ください。
