# ユニットユーザ
## ユニットユーザとは

セルのCRUD等ユニットレベルのAPIを操作する主体のことをユニットユーザと呼びます

Personiumユニットは外部のユニットユーザ管理機構の存在を前提としており、
特段ユニットユーザの管理機構を持っていません。一方で、一つまたは複数のセルを特別なユニット管理セルとして使ってユニットユーザの管理機構に充てることも可能となっています。

## ユニットレベルのアクセス制御モデル

セルの生成・削除にかかわるユニットレベルのAPIもアクセス主体を識別するためにOAuth 2.0のBearerトークン送信を使って保護されたAPIにアクセスするという点は全く同じです。つまりアクセス主体は取得したトークンを以下のようにHTTPのAuthorizationヘッダで送信することで、自身を証明し識別させます。

```
Authorization: Bearer unitLevelAccessToken
```

一方でユニットレベルのAPIとそれを操作するユニットユーザのアクセス制御のモデルは、一般のセルで認証されたユーザの自セルや他セルへのアクセス制御のモデルとは全く異なります。

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

* io.personium.core.unitUser.issuers は複数URL設定可能です。
* UUTは通常、CellのCRUD以外のアクセス権限を持っていません。 
* Cellの内容を操作したい場合、後述のユニットユーザロール(CellContentsReader, CellContentsAdmin)を付与する必要があります。
    * 注意）[v1.6.3以前は仕様が異なります](#ref163)



## ユニットユーザの種類

### ユニットアドミン（Unit Admin）

ユニット全体に対して操作が可能なユニットユーザを特にユニットアドミンと呼びます。ユニットマスタートークンでのアクセスや、後述するUnitAdminロールのついたUUTでのアクセスはユニットアドミンとなります。

* セル検索時、そのユニット上のすべてのセルが対象になる
* そのユニット上のすべてのセルに対して削除が可能。
* X-Personium-Unit-Userヘッダに任意の文字列を指定することで、その文字列をユニットユーザ名とするユニットユーザとして動くことも可能です。  
    * 注意）[v1.6.3以前は仕様が異なります](#ref163)

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

Personiumのユニットはユニットユーザトークン内のattribute要素の値として特定の文字列が設定されていたとき、これをユニットユーザのロールとして認識します。これをユニットユーザロールと呼びます。（その他の文字列が設定されていたとしてもこれを認識はせず無視します。）

なお、ユニット管理用のセルを作成してこれをユニットユーザトークン発行元として登録して用いたときは、Boxに紐づけないロールとしてこれらロールを作成してアカウントと紐づけることで、ユニットユーザロールのついたユニットユーザトークンを発行可能です。

ユニットユーザロールには以下のものがあります。

### UnitAdminロール

    {UnitUserName}/__role/__/UnitAdmin

UnitAdminロールが付与されている場合、そのユーザはユニットアドミンとなります。  
各種ユニット管理業務は、このロールのトークンを用いてAPI呼び出しを行うべきです。

* 注意）[v1.6.3以前は仕様が異なります](#ref163)

### CellContentsReaderロール

    {UnitUserName}/__role/__/CellContentsReader

CellContentsReaderロールが付与されている場合、そのユーザのユニットユーザトークンはCellの内容のRead権限を持ちます。内容参照しか行わずデータの登録や書き換えにつながる処理を実行することはできません。

* 注意）[v1.6.3以前は仕様が異なります](#ref163)

### CellContentsAdminロール

    {UnitUserName}/__role/__/CellContentsAdmin

CellContentsAdminロールが付与されている場合、そのユーザのユニットユーザトークンはCellの内容の全権限を持ちます。  ユニットユーザに"UnitAdminロール"、及び"CellContentsAdminロール"を付与することで、そのユーザのユニットユーザトークンはユニットマスタートークンと同等の権限を持つこととなります。

* 注意）[v1.6.3以前は仕様が異なります](#ref163)

<a name="ref163"></a>

## Version 1.6.3 以前の仕様

### ユニットユーザロールについて

* Version 1.6.3 以前で唯一存在したunitAdminロールの先頭文字は小文字です。以下文字列が有効となります。

    {UnitUserName}/\_\_role/\_\_/unitAdmin

* CellContentsReaderロール、CellContentsAdminロールは存在しません。
* ユニットユーザは特に何もユニットユーザロールがなくても自身の作成したセルに対してはすべての権限を持ちます。（CellContentsAdminロール相当）
* ユニットアドミンはユニット上のすべてのセルに対してすべての権限を持ちます。

### X-Personium-Unit-Userヘッダの制限

* ユニットマスタートークン使用時以外はX-Personium-Unit-Userヘッダは有効ではありません。
* unitAdminロールが付与されたトークンでのアクセス時もX-Personium-Unit-Userヘッダは有効ではありません。
