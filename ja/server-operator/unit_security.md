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

ユニットマスタートークンはAPサーバで以下の手順を行い無効化することが可能です。

1. 'personium-unit-config.properties' の修正

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

本番利用にあたっては、以下施策を組み合わせて実施することが必要です。

1. unitadmin アカウントのパスワードを定期的に変更する
1. unitadmin アカウントをリネームして用いる
1. unitadmin Cellをリネームして用いる
1. 外部にユニットユーザ管理機構を構築して利用する

### ユニットユーザーのパスワード変更

1. 管理者権限としてCellにアクセス可能なユニット管理用のトークン(ユニットユーザトークン)を取得します。
    管理者権限としてのアクセスとは、Cellを作ったり消したりする権限を持つ状態で操作することを指します。
    ユニットユーザトークンは、[Ansible で構築したユニットの環境情報](./Confirm_environment_settings.md)で取得したユニット管理アカウント情報を用いて取得します。<br>
    OAuth2 Token エンドポイントAPIを使用します。（一旦取得したトークンは、１時間有効です）

    ```sh
    curl "https://unitadmin.{Personium_FQDN}/__token" \
    -X POST -i -k \
    -d "grant_type=password&username={unitadmin_account}&password={unitadmin_password}&p_target=https://{Personium_FQDN}/" \
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
    curl "https://unitadmin.{Personium_FQDN}/__ctl/Account('{unitadmin_account}')" \
    -X PUT -i -k \
    -H "X-Personium-Credential:abcd1234" -H "Content-Type: application/json" -H "Authorization:Bearer {Token}" \
    -d "{\"Name\":\"{unitadmin_account}\"}"
    ```

    このAPIはjson形式のレスポンス(ボディ)を返しません。
    レスポンスコード204が返れば成功です。

    ```
    HTTP/1.1 204 No Content
    ```

    >**（注意）**  
    >**変更した「ユニット管理パスワード」を忘却したときはマスタートークンを用いユニット管理パスワードを変更する必要があります。**　　

### unitadmin アカウントをリネームして用いる

デフォルトの設定では強力な権限を持つトークンを取得するためのアカウントが簡単にわかってしまいます。  
unitadmin アカウントをリネームすることで、この状態を解消します。  
この例では "administrator" が 変更後のアカウントです。  

```sh
curl "https://unitadmin.{Personium_FQDN}/__ctl/Account('unitadmin')" \
-X PUT -i -k \
-H "X-Personium-Credential:{unitadmin_password}" -H "Content-Type: application/json" -H "Authorization: Bearer {Token}" \
-d "{\"Name\":\"administrator\"}"
```
>**（注意）**  
>**※実施後、unitadminのトークンで作成済の既存のCellには、マスタートークン以外でのアクセスが出来なくなります。**

### unitadmin Cell のリネーム

デフォルトの設定では強力な権限を持つトークンを取得するためのエンドポイントURLが簡単にわかってしまいます。
unitadmin Cellをリネームすることで、この状態を解消します。
この例では "personium-admin" が 変更後のCell名です。 

```sh
curl "https://{Personium_FQDN}/__ctl/Cell(Name='unitadmin')" \
-X PUT -i -k \
-H "Authorization: Bearer {Token}" -H "Content-Type: application/json" \
-d "{\"Name\":\"personium-admin\"}"
```

unitadmin Cellがユニットユーザトークン発行可能な特別なCellであることは、APサーバ上のunit-config.propertiesファイルにおいて設定されています。
リネームしたCellに引き続き同様の権限を持たせるためには、unit-config.propertiesファイル上での設定を変更する必要もあります。

1. 'personium-unit-config.properties' の修正

    ```sh
    vi /personium/personium-core/conf/18888/personium-unit-config.properties
    ```

    * io.personium.core.unitUser.issuers パラメータを修正する事でリネームしたCellに同様の権限を持たせます。

    例：

    ```sh
    ...
    # 変更前
    io.personium.core.unitUser.issuers=personium-localunit:/unitadmin/
    # 変更後
    io.personium.core.unitUser.issuers=personium-localunit:/personium-admin/
    ...
    ```

1. Tomcat を再起動します

    ```sh
    systemctl restart tomcat
    ```

>**（注意）**  
>**※実施後、unitadminのトークンで作成済の既存のCellには、マスタートークン以外でのアクセスが出来なくなります。**

### 外部ユニットユーザ管理機構を構築して利用

ユニットユーザトークンの要件を満たすトークンを発行する機構を別途用意すれば、unitadmin Cell自体を使う必要はありません。

