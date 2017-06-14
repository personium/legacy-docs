Personiumを使用する前に、以下の情報をお読みください。

## HTTPSは必須です
HTTPSで使用しなければなりません。 PersoniumユニットAPIのほとんどはHTTPSのアクセス制御メカニズムによって保護されており、OAuth 2.0ベアラトークンを使用してアクセスする必要があります。

HTTPを使用すると、偽装のためにそれを盗み出して使用しようとする攻撃者にトークンが公開されてしまいます。

https://tools.ietf.org/html/rfc6750 をご覧ください。


##ユニットマスタトークン/ユニットユーザトークン
ユニットマスタトークンとユニットユーザトークンは特権を持つトークンです。
すべてのAPI操作を実行することができます。 （ACL設定は無視されます）
したがって、これらのトークンの使用には特別な注意が必要です。

特に、ユニットマスタートークンの使用には注意が必要です。評価、開発またはテストフェーズでの利用のみを想定しているため、運用時には無効にすることを忘れないでください。

##ステータスAPI

このエンドポイントは、内部ネットワークからの管理アクセス用に設計されています。
（認証/アクセス制御なし）このため、リバースプロキシで隠ぺいする必要があります。

以下は、nginxの設定例です。

```
location ~ ^/__status/?$ {
    deny all;
}
```

##ドメインとURL

### Transefer元のリクエストURLとURIスキーム
Reverseプロキシを使用する場合は、Personiumの元のホストヘッダーとURLスキームを通過することを確認してください。

以下は、nginxの設定例です。

```
proxy_set_header Host $http_host;
proxy_set_header X-Forwarded-Proto http;
```
###ドメイン名を保持する
Personiumは分散アーキテクチャのため、ドメイン名を含むURL情報を格納します。
Personiumの使用を開始した後、ドメイン名を保存してください。

ユニットの今後のFQDN変更には、unitlocal：schemeを使用することをお勧めします。

### Personium Unit URL

PersoniumのURLが「https&#58;//{domainname}/」であることを確認してください。
（「https&#58;/{domainname}/{subdir}/」ではない）


アプリケーションサーバーのPersonium-Coreからサブディレクトリに展開する必要がある場合は、
リバースプロキシを使用してURLを書き換える必要があります。


##エンジンの展開

Personium-Engineを別のサーバにインストールすることもできます。
いずれの場合も、以下の項目が可能です。

  - personium-coreがpersonium-engineサーバーにhttpリクエストを送ることができます
  - personium-engineはdomainnameを解決し、http要求をドメイン名でPersoniumのエンドポイントに送信できます。
