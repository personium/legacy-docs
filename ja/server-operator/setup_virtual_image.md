仮想イメージを使ってPersoniumを始めよう。
---------------------------------------

概要
----

本書ではVirtualBoxの仮想イメージを使用してPersoniuｍの環境を構築する方法について説明します。  
また、本書はVirtualBoxバージョン5.2.22以降およびWindows10で動作確認済です。

#### セットアップ手順

1. [VirtualBox](https://www.virtualbox.org/wiki/Downloads)をインストールしてください。  

1. あなたが構築したいPersoniumユニットのバージョンのイメージファイルを
   以下のURLからダウンロードしてください。 

   * 1.6.15  
     https://personium.io/mvnrepo/image/personium-unit-image-1.6.15.ova  

1. 仮想イメージをVirtualBoxにインポートしてください。  

    1. 「ファイル」ー「仮想アプライアンスのインポート」をクリックしてください。

    1. ダウンロードした仮想イメージを選択して、「次へ」ボタンをクリックしてください。  
         **スペックの変更を行いたい場合は各自変更を行ってください。**
        
    1. 「インポート」ボタンをクリックしてください。

1. ローカルマシンのhostsファイルの末尾に以下を追加してください。  

    ```
    127.0.0.1  personium.example.com
    ```

    * プロキシ環境を使用している場合は[プロキシ除外設定の手順](proxy_exclusion_setting.md "")を参照してください。  
    * ネットワークの設定(任意)  
      * デフォルトはVirtualBox専用の仮想ネットワーク(10.0.2.0)になっています。  
      * 仮想ネットワーク経由での利用のみならNAT設定は不要です。

#### Personiumの動作確認

仮想サーバアカウント情報
```
ID  ：root  
PASS：root
```
\* 初回ログイン時に必ず変更してください。

1. Teraterm等のsshクライアントから仮想サーバーにログインしてください。

    1. 以下の情報を入力して「OK」ボタンをクリックしてください。  
    
        ```
        ホスト   ：localhost  
        TCPポート：2221
        ```

    1. ssh確認画面が表示されるため上記アカウント情報に記載されているID/PASSを入力してください。

1. unitadminの情報を確認してください。

   ```console
   # cat /personium/unitadmin_account
   unitadmin_account=unitadmin
   unitudmin_password={password}
   Personium_FQDN=personium.example.com
   ```

1. あなたのPersonium Unit-Managerが正常に動作していることを確認してください。

    1. ブラウザから次のURLにアクセスしてください。  
        https://personium.example.com/app-uc-unit-manager/__/html/login.html  
        * [Unit-Manager](https://github.com/personium/app-uc-unit-manager "")のリンクを参照してください。    

    1. ログインページに以下の情報を入力して「サインイン」ボタンをクリックしてください。
       * Login URL      : https://personium.example.com/unitadmin/  
       * Username       : unitadmin  
       * Password       : {password}  
         **{password}には、上記1.で確認したパスワードを入力してください。**

    1. ログイン成功後、画面左の「Cell List」に以下のCellが存在することを確認してください。
        * app-uc-unit-manager
        * unitadmin

1. Personiumが正常に動作していることを確認してください。  

    1. localhostでcurlコマンドが実行できる環境を準備してください。

    1. Unit User Tokenを取得します。 以下のコマンドを実行してください。

       ```bash
       $ curl "https://personium.example.com/unitadmin/__token" -X POST \
       -d 'grant_type=password&username=unitadmin&password={password} \
       &p_target=https://personium.example.com/' -k  
       ```

    1. Cellを作成します。以下のコマンドを実行してください。

        ```bash
        $ curl -X POST "https://personium.example.com/__ctl/Cell" -d "{\"Name\":\"sample\"}" \
        -H "Authorization:Bearer {Token}" -H "Accept:application/json" -i -sS -k
        ```

    1. Personiumが正常に動作している場合、以下のようなレスポンスが返ります。  

        ```bash
        HTTP/1.1 201
        Date: Mon, 28 Jan 2019 01:03:39 GMT
        Content-Type: application/json
        Content-Length: 245
        Connection: keep-alive
        Location: https://personium.example.com/__ctl/Cell('sample')
        DataServiceVersion: 2.0
        ETag: W/"1-1548637419191"
        X-Personium-Version: 1.6.15
        Server: Personium
        
        {"d":{"results":{"__metadata":{"uri":"https:\/\/personium.example.com\/__ctl\/Cell('sample')",
        "etag":"W\/\"1-1548637419191\"","type":"UnitCtl.Cell"},"Name":"sample",
        "__published":"\/Date  (1548637419191)\/","__updated":"\/Date(1548637419191)\/"}}}
        ```

##### OS and Middleware on VM

* OS  
CentOS 7.2 x86_64

* Middleware  

|Category       | Name           |Version       |                   |
|:--------------|:---------------|-------------:|:------------------|
| java          | AdoptOpenJDK   |        8u192 | --                |
| tomcat        | tomcat         |       9.0.10 | web               |
|               | commons-daemon |        1.1.0 | --                |
| nginx         | nginx          |       1.14.0 | proxy             |
|               | Headers More   |         0.32 | --                |
| logback       | logback        |        1.0.3 | --                |
|               | slf4j          |        1.6.4 | --                |
| memcached     | memcached      |       1.4.21 | cache             |
| elasticsearch | elasticsearch  |        2.4.1 | db & search engine|
