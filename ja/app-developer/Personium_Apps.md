> Personiumアプリ規約はあまり明文化されておらず、新たにアプリ開発に取り組むディベロッパーに対する障壁となっているため、まずはこのWikiにおいてドラフトのドラフトとして、体裁等はさておき情報公開のために記述していくこととする。  
## Personiumアプリについて  

Personiumのインターフェースは基本的にREST APIのみでありGUIを持たない実装となっている。  
とはいえ、エンドユーザーが利用するためにGUIは必須であるので、PersoniumプロジェクトではサンプルとなるGUI実装を公開している。  

公開しているサンプルを用いて、アプリディベロッパーによって自由に開発することが可能である。  

ただし、Personiumアプリにおいて注意すべきことは、Openなエコシステムとして多くのプレーヤーにアプリ開発を参入してもらうことを想定し、ある程度の規約が存在することである。（その点についてはWebにおける各種プロトコルや、AndroidなどのMobile OSと同様である）  

![Diagram](https://github.com/personium/Hands-on-Demo/blob/master/doc/app_overview.png)  

### 挙動イメージ  
[YouTube動画](https://www.youtube.com/watch?v=qlq0xM5TGiw&index=3&list=PLZDdjLhDam_SvjUZ5hN7I70KubzMEy3AX)  

### アプリの種類  
Personiumでは、使用するAPIの権限レベルに応じて、大きく以下の3種類のGUIに分類される。APIの分類についての詳細は[ここ](https://personium.github.io/ja/user_guide/001_Personium_Concepts.html)を参照。  

1. [一般アプリ](#1-%E4%B8%80%E8%88%AC%E3%82%A2%E3%83%97%E3%83%AA)  
1. [Cell管理クライアント（Homeアプリ）](#2-cell%E7%AE%A1%E7%90%86%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88home%E3%82%A2%E3%83%97%E3%83%AA)  
1. [Unit管理クライアント](#3-unit%E7%AE%A1%E7%90%86%E3%82%AF%E3%83%A9%E3%82%A4%E3%82%A2%E3%83%B3%E3%83%88)  

以降はこれらのそれぞれについて、定義やデプロイ方法を記載する。  

### 1. 一般アプリ  
一般アプリは、個人の所有するPDS（Cell）内の、アプリ毎の特定領域（Box）に対してのみデータの操作が可能なGUIである。  
対象となるデータは、アプリ提供者が実際に行っている（Webなどの）各サービスに特化したものが想定される。  
通常のアプリディベロッパーは、この一般アプリの枠組みでアプリを開発し、Personium Cell の所有者にインストールしてもらうことで、Personiumプラットフォーム上で自身のサービスを展開できる。  

#### メリット  
Personiumアプリの枠組みを利用してサービスアプリケーションを利用・提供するメリットは以下である。  

* ユーザー：自身のPDS(Personium Cell)内にデータを一元的に保持しつつ、様々なWebサービスを利用することが可能である。サービス提供者に提供するデータ範囲も規定でき、さらにサービサーによる情報漏洩のリスクを軽減できる。  
* サービス提供者：パーソナルデータはユーザー自身のPersonium Cellにあるため、最低限のデータ管理を行う程度で済む（漏洩リスク軽減）。また、ユーザーがPDSに一元管理している、サービスとは本来関係ないデータに対して参照アクセス依頼をかけることができ、ユーザーから承認さえされればデータを閲覧することも可能となる（マーケット調査やアンケート機能の代替）  

##### 実装例  
* [Minimal App](https://github.com/personium/template-app-cell) - PersoniumのHello World アプリ  
* [MｙBoard](https://github.com/fujitsu-pio/myboard-app)（ミニマム実装）  
    * Demo available on YouTube  
        [![MyBoard on YouTube](https://i.ytimg.com/vi/X_djQih94tU/1.jpg)](https://youtu.be/X_djQih94tU)  
* [カロリースマイル連携](https://github.com/fujitsu-pio/calorie-smile-app)  
* [個人データ仲介モデル（わかば市情報バンク）](https://github.com/fujitsu-pio/wakaba-user-app)  
etc  

##### フォルダ構造  
GitHubで公開している各種アプリのフォルダ構成は一定のルールでリソースを格納されており、このリソースをPersoniumのCell（**アプリCell**）にデプロイすることで、ユーザーがBarfileをインストールし、アプリを利用することが可能となる。  
> アプリCellは通常の「人」に対応しない、「アプリ」というオブジェクトに対応する特殊なCellの一つである。  

    │  launch.json
    │  profile.json
    │  relations.json
    │  roles.json
    │  
    ├─bar
    │  └─00_meta
    │          00_manifest.json
    │          90_rootprops.xml
    │          
    ├─doc
    │      
    ├─icon
    │      
    ├─locales
    │  ├─en
    │  │      profile.json
    │  │      
    │  └─ja
    │          profile.json
    │          
    └─src
        └─html
            │  app.html
            │  
            ├─css
            │      common.css
            │      
            ├─Engine
            │      getAppAuthToken.js
            │      
            ├─img
            │      github.png
            │      
            ├─js
            │      app.js
            │      common.js
            │      common_personium.js
            │      
            └─locales
                ├─en
                │      common.json
                │      glossary.json
                │      
                └─ja
                        common.json
                        glossary.json

以下にGitHubで公開しているアプリリソースの構造と、デプロイ方法をまとめる。  

|#|フォルダ、ファイル|用途|
|:--|:-------|:---|
|1|bar     |各ユーザーの[box内にデータ構造を展開するarchiveファイル](https://personium.github.io/ja/user_guide/006_Box_install.html)のソース。.bar形式にZip圧縮してデプロイする（[barファイル詳細](https://github.com/personium/api-references/blob/master/api/ja/301_Bar_File.md)）|
|2|icon    |Homeアプリ内で表示されるicon|
|3|launch.json|アプリの起動URIを記述したドキュメント。<br>URLスキームをカスタムすることにより、ネイティブアプリを起動することが可能となる予定。|
|4||アプリのDefaultファイル|
||profile.json|アプリの概要を記載したドキュメント。<br>インストール画面で表示。|
||relations.json|アプリで定義したRelationの表示名・説明・アイコンを記載したドキュメント。<br>Relationを定義していないの場合、[JSONファイルに空のHash](https://github.com/personium/template-app-cell/blob/master/relations.json)を記載して置いてください。|
||roles.json|アプリで定義したRoleの表示名・説明・アイコンを記載したドキュメント。<br>Roleを定義していないの場合、[JSONファイルに空のHash](https://github.com/personium/template-app-cell/blob/master/roles.json)を記載して置いてください。|
|5||アプリの多言語対応向けファイル|
||locales/en/*.json|英語版のファイル|
| |locales/ja/*.json|日本語版のファイル|
|6|src/android|Androidアプリソース。|
|7|src/html|一般もしくはMobile browser向けアプリソース。直接アクセスする|
|8|src/ios|iOSアプリソース。|

### 2. Cell管理クライアント（Homeアプリ）

Cell管理クライアントは、Cellの所有者であるユーザーがCellの管理権限相当の操作を行うためのGUIのことを指す。
Cellの管理権限相当の操作はCellレベルAPIで
詳細は[ここ](https://personium.github.io/ja/user_guide/001_Personium_Concepts.html)を参照。

#### 機能
 Cell管理クライアントはおおまかに以下の機能を有しています。

1. Cell管理権限（root）によるデータ全体管理
1. AccountやRoleなどのCell制御オブジェクトや、ユーザープロフィールの登録・変更
1. 他Cellとの関係登録、メッセージによる登録依頼 (いわゆる友達登録のようなもの)
1. 関係登録後、アクセス許可された他Cell内データの参照
1. アプリに紐づくBox(データ構造）のインストール
1. アプリの起動（ランチャー）  
1. Boxに紐づかないメッセージの送受信

また以下の機能は計画中です  

1. アプリ利用データ権限管理、BOXアンインストール
1. Cell内データのエクスプローラ
1. ネイティブアプリ実装
1. QRコード、NFC等によるCell URLの入力不要化
1. ユーザー定義Eventの設定、発火ログの閲覧 

#### サンプル実装  
1. [ホームアプリ  
    - [概要](https://github.com/dixonsiu/app-cc-home/blob/master/README_ja.md)  
    - [デモ(チュートリアル有)](https://demo.personium.io/democell/io_personium_demo_HomeApplication/src/login.html?lng=ja)  
    - [デモ](https://demo.personium.io/HomeApplication/__/box-resources/login.html?lng=ja&mode=global)  

### 3. Unit管理クライアント 

Unit管理クライアントはUnitレベルの操作（Cellの新規作成や削除などの管理操作）を実施するためのGUIである。現状以下のものが公開されている。

1. [UnitManager](https://github.com/personium/app-uc-unit-manager/blob/master/README_ja.md)  
[![Unit/Cell Manager YouTube](https://i.ytimg.com/vi/d1_pET0M-YA/1.jpg?time=1514263611186)](https://youtu.be/d1_pET0M-YA)  
1. [Cell作成クライアント](https://github.com/personium/app-uc-cell-creator-wizard)  
[![Cell Creator Wizard YouTube](https://i.ytimg.com/vi/M4cYLFYRyEk/1.jpg)](https://youtu.be/M4cYLFYRyEk)  
1.  (参考)[PCUI](https://github.com/personium/pcui)  

これらはUnit管理権限を持つ特別なToken(Personium Serverで定義されたUnitAdmin Cellで発行可能)を使用するため、ログイン時にはそれらを取得するための情報(以下4つ)を何らかの形でインプットする必要がある。<br>

1. Personium環境のURL
1. UnitAdminCellのセル名（PersoniumのUnitConfigで規定）
1. UnitAdminアカウント
1. UnitAdminのパスワード


#### デプロイ方法
UnitManagerに関しては、Homeアプリと同様に、一般的なWebサーバにデプロイすることで使用可能である。<br>
> [Electron](https://electronjs.org/)フレームワークを用いてネイティブ化することも検討中

## アプリ認証  
Personiumのアプリエコシステムにおいて、PDSに対する不正なアクセスを試みるフィッシングアプリからの防衛を考慮する必要があります。アプリが定義するBoxにはアプリ認証による保護を有効にすべきです。  

アプリ認証とは、リソースにアクセスする主体が、個人のCell認証に加えて、サービサーが管理するアプリCellによって認証する枠組みであり。アクセス制限されたBoxのaccess tokenの取得に関しては[ここ](schema_auth.md)を参照されたい。  

開発作業者が、デバッグ等で一般アプリをHomeアプリから起動しない場合、Box内にアクセスするためにはアプリ認証後トークンを別途取得する必要がある。  
> 補足:  
> 今後、アプリ認証においては、URLハッシュなどを用いて複数Schemaを定義することを可能とする予定である。
