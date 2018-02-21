# ユニットユーザ
## ユニットユーザとは
セルのCRUD等ユニットレベルのAPIを操作する主体のことをユニットユーザと呼びます。ユニットユーザは、ユニットユーザトークン（Unit User Token (UUT)）またはユニットマスタートークン（Unit Master Token (UMT)）を用いてAPIアクセスを行います。

### ユニットユーザトークン（Unit User Token (UUT)）
UUTはPersoniumをサービスとして提供するときに大きな役割を担いますが、PersoniumはUUTを使わずUMTのみを使って運用することもできます。 
すなわち、サービス・プロバイダが自身の顧客それぞれに異なるUUTを発行し、これを使ってセル CRUD APIアクセスをしてもらうことで以下が実現します。

	・セル作成時、自身が持ち主であるという情報とともにセルが作成される。
	・セル検索時、自身が作成したセル以外は検索されない。
	・セル削除時、自身が作成したセル以外の削除は失敗する。

一方で、一つの個人・組織が自身専用ユニットを持っている場合は、そのユニットに作られるセルはすべて自身の管理となるため、上記のような機能は不要です。  
その場合はUUTのかわりにUMTを用いて運用を行っても問題はない。

ユニットユーザは識別子を持ち、それをユニットユーザ名と呼ぶ。  
ユニットはユニットユーザ名の管理機構を持たず、外部の管理機構の存在を前提とする。

![unituser](./images/unituser.png)

## ユニットレベル制御エンティティ（セル）のオーナー属性

セルにはオーナー（owner）という隠し属性が存在します。  
隠し属性というのはOData形式のAPIから内容を確認することはできないが、すべてのセルに一つ存在する属性である。  
オーナーはセル作成時に設定したら変更は行えない。

## ユニットユーザの種類

### ユニットアドミン（Unit Admin）

ユニット全体に対して操作が可能なユーザ。

### ユニットユーザ（Unit User）

オーナーが一致するセルに対して操作が可能なユーザ。  
セルの検索を実施するとオーナーが一致するセルのみ検索可能。

## ユニットトークンの種類

### ユニットマスタートークン（Unit Master Token (UMT)）

ユニットマスタートークンはユニットに設定したそのままの値がトークンになるというシンプルな使い方で、ユニットに関するあらゆる操作ができるというきわめて強い権限を持ったトークンです。このトークンでアクセスするとUnit Adminとして扱われるため、X-Personium-Unit-Userヘッダに任意の文字列を指定することで、その文字列をユニットユーザ名とするユニットユーザとして動くことも可能です。

このトークンは開発やテストの時に使うことを想定したものであり、特殊なケースを除き多くの場合本番運用ではセキュリティ的観点から無効化すべきものです。

#### 設定の方法

personium-unit-config.propertiesの「io.personium.core.masterToken=」に任意の文字列を設定します。 空文字列を設定することで設定の無効化が可能です。


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

### ユニットユーザトークン（Unit User Token (UUT)）

UUTは以下の情報をつめたSAML Assertionに基づくOAuth2のBearerトークンです。

|要素・属性名|内容|
|:--|:--|
|IssueInstant|認証した時刻|
|issuer|ユニットが認めたURL。<br>personium-unit-config.propertiesの「io.personium.core.unitUser.issuers=」に認める任意のURLを記述|
|Subject\NameID|	ユニットユーザ名。任意の文字列。|
|audience|ユニットルートURL|
|attribute|Unit User Role|


このトークンを発行されたアクセス主体をユニットユーザとよび、このようなSAMLアサーションを発行する認証プロセスをユニットユーザ認証と呼ぶ。

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

UUTは通常、CellのCRUD以外のアクセス権限を持っていない。  
Cellの内容を操作したい場合、後述のユニットユーザロール(CellContentsReader, CellContentsAdmin)を付与する必要がある。

### ユニットユーザロール（Unit User Role）

Personiumのユニットはユニットユーザのロールとして以下を認識します。トークン内でその他のロールが付与されていたとしてもこれを認識はしない。（無視する）

#### UnitAdminロール

{UnitURL}/{Cell}/\_\_role/\_\_/UnitAdmin

UnitAdminロールが付与されている場合、そのユーザはユニットアドミンとなる。  
各種ユニット管理業務は、このロールのトークンを用いてAPI呼び出しを行うべきである。

#### CellContentsReaderロール

{UnitURL}/{Cell}/\_\_role/\_\_/CellContentsReader

CellContentsReaderロールが付与されている場合、そのユーザのユニットユーザトークンはCellの内容のRead権限を持つ。  

#### CellContentsAdminロール

{UnitURL}/{Cell}/\_\_role/\_\_/CellContentsAdmin

CellContentsAdminロールが付与されている場合、そのユーザのユニットユーザトークンはCellの内容のRead権限、及びWrite権限を持つ。  
ユニットユーザに"UnitAdminロール"、及び"CellContentsAdminロール"を付与することで、そのユーザのユニットユーザトークンはユニットマスタートークンと同等になる。
