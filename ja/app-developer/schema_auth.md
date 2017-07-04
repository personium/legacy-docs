# Schema認証
## Schema認証とは
Personium Boxは、Cellを保有している主体が個人に紐づくデータを利用する何らかのサービスを活用する際、
そのデータを他のサービスが不正にアクセスしたり改変したりできないようにする仕組みを提供することを目的とした実装を含んでいます。

そのため、「あるBoxを操作することのできる権限の持ち主が、同じトークンで他のBoxにアクセスすることを不可能にする」認証の枠組みが提供されており、
Personium ではそれを**Schema認証**と呼びます。（直感的理解のため、アプリ認証と説明することもありますが非公式の用語とします）

Schema認証APIは、OAuth2.0におけるクライアント認証の枠組みの中で規定されたものであるため、
ClientIDとClientSecretをパラメータとして認証時に付加するのみで実施可能です。

```
    A client application consisting of multiple components, each with its

    own client type (e.g. a distributed client with both a confidential

    server-based component and a public browser-based component), MUST

    register each component separately as a different client to ensure

    proper handling by the authorization server.
```

意訳

```
    Clientはユーザーに代わって保護リソースにアクセスするアプリケーションです。
    Client Typesとして、秘密鍵を安全に管理できるconfidential、クライアントサイドで動いて管理できないのはpublic
    ConfidentialならAuthZ Code, PublicなのはImplicit使え
    サーバーサイドとクライアントサイドの両方のComponentから構成されている場合、別々で登録出来る必要があります
```
## Schema認証をするための設定
### 概要
* アプリケーションがBox内のデータにアクセスするためには、通常、まずサービス提供者が管理する中央Cell（アプリCell）にてアプリクライアントとしてのTarget指定で認証を行い、<br>
その後通常のID/PWおよびClientID・ClientSecretの指定によるSchema認証を実施することで、そのBoxのみにアクセスするトークンを発行します。

* または、通常のID/PW認証を実施したときに取得したRefreshTokenを用いて有効期限更新をする際に、<br>上記と同様にClientID・ClientSecret指定によるTransCellトークン発行が可能です。（v1.5.2以降）

### 前提
* Schema認証を実施するには、以下のセルが必須となります。<br>
	* ・{appcell}: アプリセル（スキーマ認証セル）
	* ・{cell}: ユーザーセル

### 認証の流れ
* Personiumではアプリセルのアカウントに特殊ロール（`{issuerUrl} + /__role/__/confidentialClient`）を結びつけることで、<br>スキーマ認証（アプリ認証）を行います。（スキーマ認証レベル `confidential` の場合）
* ユーザーセル認証時の`client_id`と `client_secret` にスキーマ認証情報を入れてユーザ認証を行うことでユーザ認証、スキーマ認証の評価を一緒に行います。

## Schema認証手順
### アプリセルへアプリ認証情報設定

* アプリセルにアカウント作成（通常のアカウント作成）
* アプリセルにロール作成（通常のロール作成）
	* ロールの作成は任意。最上位のスキーマ認証（Confidential Client）を行う場合のみ実施
* アカウントとロールの結びつけ（通常の結びつけ処理）
	* ロールの作成と同じ理由により任意

### ユーザーセルのコレクションにスキーマ認証レベル設定

* ACLを使ってスキーマ認証レベルの設定を行います。

* スキーマ認証設定ACLのサンプル

* ```
<D:acl xmlns:D="DAV:" xml:base="https://demo.personium.io/cell/__role/box/"
xmlns:p="urn:x-personium:xmlns"
p:requireSchemaAuthz="{スキーマ認証レベル}">
    <D:ace>
        <D:principal>
            <D:all/>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
            <D:privilege><D:write/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```


#### スキーマ認証レベルの取りうる値

| レベル値     | 内容                                                       |
|:--|:--|
| none         | スキーマ無しでアクセス可能（デフォルト）                   |
| public       | スキーマがあればアクセス可能                               |
| confidential | スキーマに特殊ロールconfidentialClientがあればアクセス可能 |

### アプリセルでの認証

* アプリからアプリセルに対して認証してデータセル向けトランスセルトークン取得
* ここでは通常のパスワード認証

### ユーザーセルでの認証

* Personiumアプリからユーザーセルに対して通常のパスワード認証をすると同時にアプリセルから受け取ったトランスセルトークンをclient_secret、<br>アプリセルのURLをclient_idに入れて認証します。
* client_secret 内の`issuer`と`client_id`をチェックし、一致していれば発行するアクセストークンにスキーマ情報（URL）を付与します。
* client_secret 内のロール（`AttributeStatement\Attribute\AttributeValue`の値）をチェックし、<br>ロールが特殊な値（`{issuerUrl} + /__role/__/confidentialClient`）であればスキーマ情報の後ろに#c（conficentialであることの印）を付与します。


* ```
curl -X POST '{UnitURL}/{cell}}/__auth' -d \
'grant_type=password&username=user&password=pass&client_id={UnitURL}/{appcell}/&client_secret={アプリセルから受け取ったトランセルトークン}'
```

### ボックス及びコレクションのデータアクセス制御

* ボックス及びコレクションにアクセスする際のアクセストークンのスキーマ認証情報と、<br>ボックスに設定されているスキーマ（アクセス先がコレクションの場合属するボックス）のチェックを行います。

* アクセスするボックス/コレクションのスキーマ認証レベル設定とアクセストークンのスキーマ情報を比較し、<br>レベル設定に合わない場合はアクセスを拒否します。

	* ・none => スキーマ認証チェックを行わない

	* ・public => スキーマ認証チェックを行い、スキーマ認証されていればアクセス可能にする

	* ・confidential => スキーマ認証チェックを行い、特殊ロール（confidentialClient）があればアクセス可能にする

* アクセスするボックスのスキーマ値とアクセストークンのスキーマ値を比較し、値が異なる場合はアクセスを拒否します。
