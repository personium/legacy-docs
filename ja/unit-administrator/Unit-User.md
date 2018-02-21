# ユニットユーザ
## ユニットユーザとは

セルのCRUD等ユニットレベルのAPIを操作する主体のことをユニットユーザと呼びます

Personiumユニットは外部のユニットユーザ管理機構の存在を前提としており、
特段ユニットユーザの管理機構を持っていません。一方で、一つまたは複数のセルを特別なユニット管理セルとして使ってユニットユーザの管理機構に充てることも可能となっています。

## ユニットレベルのアクセス制御モデル

Cellの生成・削除にかかわるユニットレベルのAPIとそれを操作するユニットユーザのアクセス制御のモデルは、一般のセルで認証されたユーザの自セルや他セルへのアクセス制御のモデルとは全く異なります。

一方でアクセス主体を識別するためにOAuth 2.0のBearerトークン送信を使って保護されたAPIにアクセスするという点は全く同じです。つまりアクセス主体は取得したトークンを以下のようにHTTPのAuthorizationヘッダで送信することで、自身を証明し識別させます。

    Authorization: Bearer unitLevelAccessToken

ユニットレベルのAPIが認識するトークンは以下の2種類です。

* ユニットユーザトークン（Unit User Token (UUT)）
* ユニットマスタートークン（Unit Master Token (UMT)）

これらトークンでのアクセス時にはセルレベルのACLは全く考慮されません。またセルレベルのAPIアクセスでのトランスセルトークンのように他のユニットにまたがったようなアクセスもできません。


### ユニットマスタートークン（Unit Master Token (UMT)）

ユニットマスタートークンはユニットに設定したそのままの値がトークンになるというシンプルな使い方で設定でき、そのトークンでユニットに関するあらゆる操作ができるというきわめて強い権限を持ったトークンです。

このトークンは開発やテストの時に使うことを想定したものであり、特殊なケースを除き多くの場合本番運用ではセキュリティ的観点から無効化すべきものです。

#### 設定の方法

personium-unit-config.propertiesの「io.personium.core.masterToken=」に任意の文字列を設定することでそれがマスタートークンとして認識されます。デフォルトの設定では無効となっていますが、空文字列を設定することでも設定の無効化となります。


### ユニットユーザトークン（Unit User Token (UUT)）


UUTは以下の情報をつめたSAML Assertionに基づくOAuth2のBearerトークンです。

|要素・属性名|内容|
|:--|:--|
|IssueInstant|認証した時刻|
|issuer|ユニットが認めたURL。<br>personium-unit-config.propertiesの「io.personium.core.unitUser.issuers=」に認める任意のURLを記述|
|Subject\NameID|	ユニットユーザ名。任意の文字列。|
|audience|ユニットルートURL|
|attribute|Unit User Role|


このトークンを発行されたアクセス主体をユニットユーザとよび、このようなSAMLアサーションを発行する認証プロセスをユニットユーザ認証と呼びます。

また、セルでのAccount認証でp_targetにユニットのルートURLを与えることで発行されるトランスセルトークンは、UUTの要件を満たしており、
ユニットの設定に特定のセルのURLを含めることでそのセルはUUT発行者となりうる。

例  
セルでUUTを発行する場合  
personium-unit-config.propertiesの`io.personium.core.unitUser.issuers={UnitURL}/{Cell}/`を設定


```sh
curl "{UnitURL}/{Cell}/__token" -X POST \
-d 'grant_type=password&username=user&password=pass&p_target={UnitURL}/'
```

io.personium.core.unitUser.issuers は複数URL設定可能

UUTは通常、CellのCRUD以外のアクセス権限を持っていません。 
Cellの内容を操作したい場合、後述のユニットユーザロール(CellContentsReader, CellContentsAdmin)を付与する必要があります。(v1.6.4以降）


## ユニットユーザの種類

### ユニットアドミン（Unit Admin）

ユニット全体に対して操作が可能なユニットユーザを特にユニットアドミンと呼びます。ユニットマスタートークンでのアクセスや、後述するUnitAdminロールのついたUUTでのアクセスはユニットアドミンとなります。

* セル検索時、そのユニット上のすべてのセルが対象になる
* そのユニット上のすべてのセルに対して削除が可能。
* X-Personium-Unit-Userヘッダに任意の文字列を指定することで、その文字列をユニットユーザ名とするユニットユーザとして動くことも可能です。

例

{UnitURL}/{UnitUserName} というユニットユーザ名をオーナーとするセル作成


```sh
curl "{UnitURL}/__ctl/Cell" -X POST \
-H "Authorization: Bearer token" \
-H "X-Personium-Unit-User: {UnitURL}/{UnitUserName}" \
-d '{"Name":"cell1"}'
```

{UnitURL}/{UnitUserName} というユニットユーザ名をオーナーとするセル一覧を取得


```sh
curl "{UnitURL}/__ctl/Cell" -X GET \
-H "Authorization: Bearer token" \
-H "X-Personium-Unit-User: {UnitURL}/{UnitUserName}"
```

### ユニットユーザ（Unit User）

オーナーが一致するセルに対して操作が可能なユーザ。 セルの検索を実施するとオーナーが一致するセルのみが検索されます。

	・セル作成時、自身が持ち主であるという情報とともにセルが作成される。
	・セル検索時、自身が作成したセル以外は検索されない。
	・セル削除時、自身が作成したセル以外の削除は失敗する。

![unituser](./images/unituser.png)

### ユニットレベル制御エンティティ（セル）のオーナー属性

セルにはオーナー（owner）という隠し属性が存在します。 オーナーはセル作成時に設定したら変更は行えない。


## ユニットユーザロール（Unit User Role）

Personiumのユニットはユニットユーザのロールとして以下を認識します。トークン内でその他のロールが付与されていたとしてもこれを認識はしない。（無視する）

### UnitAdminロール

{UnitURL}/{Cell}/\_\_role/\_\_/UnitAdmin

UnitAdminロールが付与されている場合、そのユーザはユニットアドミンとなる。  
各種ユニット管理業務は、このロールのトークンを用いてAPI呼び出しを行うべきである。

### CellContentsReaderロール

{UnitURL}/{Cell}/\_\_role/\_\_/CellContentsReader

CellContentsReaderロールが付与されている場合、そのユーザのユニットユーザトークンはCellの内容のRead権限を持つ。  

### CellContentsAdminロール

{UnitURL}/{Cell}/\_\_role/\_\_/CellContentsAdmin

CellContentsAdminロールが付与されている場合、そのユーザのユニットユーザトークンはCellの内容のRead権限、及びWrite権限を持つ。  
ユニットユーザに"UnitAdminロール"、及び"CellContentsAdminロール"を付与することで、そのユーザのユニットユーザトークンはユニットマスタートークンと同等になる。
