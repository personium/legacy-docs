# Homeアプリからのアプリ起動

Personiumアプリには様々な形態がありますが、ここでは最も標準的なHomeアプリから起動されるアプリについて以下を説明します。

+ アプリ起動時に渡されるパラメタ
+ アプリ起動後に行うべき処理

注）Personium coreのバージョン1.6.9以降のみが対応しています。

## アプリ起動時に渡されるパラメタ

ホームアプリのアプリランチャは以下のURLを呼び出すことでアプリ起動を行います。

    {AppUrl}#cell={cellUrl}

例

    myapp-custom-scheme://#cell=https://demo.personium.io/john.doe/
    https://some.svr.example/my-app/index.html#cell=https://pds.personium.example/john.doe/

## アプリ起動後に行うべき処理

アプリケーション開発の実際のプロセスはアプリケーションの実装手段(Androidアプリ、HTML5アプリ、iOSアプリ, etc.)や実装言語によって異なりますが、
アプリ起動後に行うべき流れは共通です。

1. 起動URLからCellのURLを受け取る
1. OAuth2のcodeフローに準じた手順でアプリ認証を行う
1. アクセストークンを受け取る
1. BoxのURLを取得する
1. Box配下の各種リソースにアクセスする

### 起動URLからCellのURLを受け取る

Home Appのランチャから起動されるPersnium Appは、何らかの起動URLにより起動します。
起動URLはhttpsから始まるものかもしれませんし、何等かのカスタムスキームから始まるものかもしれません。
一般的にカスタムスキームURLで起動されたアプリは自分がどのようなURLで起動されたかを取得可能です。
またhttpsから始まるURLであればブラウザが起動するでしょうが、ブラウザアプリであっても自身がどのようなURLで起動されたかを取得可能です。
まず、それぞれの実装において起動URLを取得してください。

次に取得できた起動URLから#以下をパースして、cellパラメタを取得してください。

|項目|概要|
|:--|:--|
|cell|ターゲットとすべきユーザのCell URL|

このパラメタはこの先のプロセスで必要になります。

### OAuth2のcodeフローに準じた手順でアプリ認証を行う

` こちらの章は記載の途中です。もう少々お待ちください。 `

あなたのアプリの正当性をユーザCellに対して証明するために、アプリ認証トークンを取得します。これはフィッシングアプリなど、
悪意のあるアプリケーションからの攻撃からあなたのアプリや、ユーザCellを守るためのセキュリティです。

アプリ認証トークンは、アプリCellのTokenエンドポイントに対してアプリのID/パスワードを送ることで取得できます。具体的には以下のような情報をPOSTします。

    grant_type=password&p_target={ユーザCell URL}&username={アプリID}&password={アプリパスワード}

アプリID, アプリパスワードはあなたのアプリしか知らないものです。これをあなたのアプリからアプリCellのエンドポイントに投げるためには、
コード中に難読化して埋め込んでもよいですし、どこかのサーバにおいて、サーバから上記リクエストを出してもらってもよいでしょう。
アプリCell上にEngineスクリプトを置いて、これを実現するのもよいアイディアです。難読化して埋め込みを行った場合は、
攻撃者のリバースエンジニアリングによってアプリID, アプリパスワードが漏洩することは難読化による一定の抑止力はあるものの、完全には防ぐことができません。

いずれにせよ、このリクエストに対する認証成功応答JSONの"access_token"項目が「アプリ認証トークン」となります。JSONをパースして取得してください。

参考： http://personium.io/docs/ja/apiref/current/293_OAuth2_Token_Endpoint.html


### アクセストークンを受け取る

ユーザCellに対するあなたのAppとしてのアクセストークンを受け取ります。

1. アプリ認証トークン

今度はユーザCellのTokenエンドポイントに対して、以下の情報をPOSTします。

    grant_type=authorization_code&code={grantCode}&client_id={アプリCellURL}&client_secret={アプリ認証トークン}

ここで返ってくるレスポンスJSONの中の"access_token"項目が、対象ユーザCellに対するあなたのアプリのためのアクセストークンです。
この処理はアプリセル上のengineスクリプトで実装することをお勧めします。

参考： http://personium.io/docs/ja/apiref/current/293_OAuth2_Token_Endpoint.html


### BoxのURLを取得する

以下のAPIを使って、対象ユーザCell上のあなたのアプリのための領域であるBoxのURLを取得します。

参考: http://personium.io/docs/ja/apiref/current/304_Get_Box_URL.html

この際、Authorizationヘッダで取得したアクセストークンを指定するようにしてください。

    Authorization: Bearer {access_token}

これにより、どこのURLをルートとしてデータアクセスすればよいかがわかります。

### Box配下の各種リソースにアクセスする

アプリ開発者である貴方は、対象ユーザCell上のあなたのアプリのためのBox配下の構造については知っているはずです。
データアクセスのためのBoxレベルAPI (WebDAV, OData)を用いて、Box配下の各種リソースにアクセスしてください。
