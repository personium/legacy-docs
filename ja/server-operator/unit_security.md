# Unit のセキュリティ（デフォルトからの変更を推奨する設定）

## 概要

Ansible を利用してPersonium ユニットを作成した場合、デフォルトで強い権限を持つユニットマスタートークンが有効になっています。本章ではデフォルトからの変更を推奨する設定についてご説明します。

推奨する設定には以下のようなものがあります。

1. ユニットマスタートークンの無効化
1. ユニット管理アカウントの管理

## ユニットマスタートークンの無効化

ユニットマスタートークンは開発やテストの時に使うことを想定したものであり、特殊なケースを除き多くの場合本番運用ではセキュリティ的観点から無効化すべきものです。
しかし、新規作成されたPersonium にはユニット管理に使用するセルやアカウントが存在しません。そのためAnsible 実行前に任意のユニットマスタートークンを設定し、有効化した状態で構築しています。

### ユニットマスタートークンの無効化手順

ユニットマスタートークンはAP サービスが稼働するサーバで以下の手順を行い無効化することが可能です。

1. '/personium/personium-core/conf/18888/personium-unit-config.properties' の修正

    ```sh
    vi /personium/personium-core/conf/18888/personium-unit-config.properties
    ```

    * io.personium.core.masterToken パラメータをコメントアウトする事でユニットマスタートークンを無効化できます。

    例：

    ```sh
    ...
    ##### Major Settings Items #####
    # Unit Master Token.
    # Blank string should be configured in production use to disable it.
    # io.personium.core.masterToken=                                       <- このパラメータをコメントアウトする
    #
    ...
    ```

1. Tomcat を再起動します

    ```sh
    systemctl restart tomcat
    ```

## ユニット管理アカウントの管理

Ansible でPersonium ユニットを管理するアカウントとしてデフォルトでunitadmin というユニットユーザーを作成しています。unitadmin は全てのセルやボックスといったリソースに対して追加・変更・削除といった操作が可能です。そのため、Ansible で構築した環境では共通的に使用するアカウント名のため、セキュリティレベルは下がってしまいます。
unitadmin アカウントのパスワードを定期的に変更するか、unitadmin と同等の権限を持つ任意のユニットユーザーを作成し、利用することを推奨します。

### ユニットユーザーのパスワード変更

1. 管理者権限としてCellにアクセス可能なユニット管理用のトークン(ユニットユーザトークン)を取得します。
    管理者権限としてのアクセスとは、Cellを作ったり消したりする権限を持つ状態で操作することを指します。
    ユニットユーザトークンは、「4. 本文書で使用する情報を取得する」で取得したユニット管理アカウント情報を用いて取得します。<br>
    OAuth2 Token エンドポイントAPIを使用します。（一旦取得したトークンは、１時間有効です）

    ```sh
    curl "https://{Personium_FQDN}/unitadmin/__token" \
    -X POST -i -k \
    -d "grant_type=password&username={unitadmin_account}&password={unitudmin_password}&p_target=https://{Personium_FQDN}/" \
    -H "Content-Type: application/x-www-form-urlencoded"
    ```

    成功するとAPIからJSON形式でレスポンスが返ります。
    ここで取得した"access_token"の値が、ユニットユーザトークンとなります。

    ```json
    {
	"access_token":"PEFzc........(省略)........W9uPg",
	"refresh_token_expires_in":86400,
	"refresh_token":"RA~tw........(省略)........EeWsQ",
	"token_type":"Bearer",
	"expires_in":3600,
	"p_target":"https://{Personium_FQDN}/"
    }
    ```

1. 取得したトークンを利用してパスワード変更を行います。パスワード変更は[Account更新API](../apiref/current/215_Update_Account.md)のリクエストヘッダーの'X-Personium-Credential' に任意のパスワードを指定することで変更できます。
    この例では "abcd1234" が 変更後のパスワードです。

    >**（注意）**
    >**ユニット管理アカウントは強い権限を持っているため、変更後のパスワードには推測されにくいものを指定してください。**

    ```sh
    curl "https://{Personium_FQDN}/unitadmin/__ctl/Account('{unitadmin_account}')" \
    -X PUT -i -k \
    -d "{\"Name\":\"{unitadmin_account}\"}" \
    -H "X-Personium-Credential:abcd1234" -H "Content-Type: application/json" -H "Authorization:Bearer {Token}"
    ```

    このAPIはjson形式のレスポンス(ボディ)を返しません。
    レスポンスコード204が返れば成功です。

    ```
    HTTP/1.1 204 No Content
    ```

    >**（注意）**
    >**変更した「ユニット管理パスワード」を忘却したときはマスタートークンを用いユニット管理パスワードを変更する必要があります。**　　

### unitadmin と同等の権限を持つアカウントの作成

***～～  準備中  ～～***