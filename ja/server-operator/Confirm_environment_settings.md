# Ansible で構築したユニットの環境情報

-------------------------------------------------

## はじめに

Ansible で構築した環境の基本設定と留意事項を説明します。
この手順を行うことで、Personium を構成する主要なミドルウェアのインストール先や基本設定を理解することができます。

## Web サービス

* Web サービスが動作するサーバの基本設定を確認します。

### Nginx 環境

* Personium ではWeb を実現するためNginx を使用しています。  
Nginx は以下のようにインストールしています。

| 項目                    | パス                                 |
|-------------------------|-------------------------------------|
| インストールディレクトリ  | /opt/nginx-1.14.0/                  |
| 設定ファイル             | /opt/nginx-1.14.0/conf/             |
| ログ出力先               | /personium/nginx/log/accesslog_443/ |  

### サーバ証明書

* Personium はHTTPS で提供されるサービスです。HTTPS を実現するために使用しているサーバ証明書の設定を確認します。

1. まずNginx で利用しているサーバ証明書のパスを確認します。
    現在仕様しているサーバ証明書のパスを確認するには以下のコマンドを実行し、「ssl_certificate」「ssl_certificate_key」の項目を確認します。

    ```console
    # cat /opt/nginx/conf/nginx.conf
    ```
    構築直後では以下のようになっています。

    ```
    ssl_sertificate         /opt/nginx/conf/server.crt
    ssl_certificate_key     /opt/nginx/conf/server.key
    ```

1. 使用しているサーバ証明書の内容を確認します。
    以下のコマンドを実行し、サーバ証明書のコモンネームを確認します。

    ```console
    # openssl x509 -noout -subject -in /opt/nginx/conf/server.crt
    ```

    [1-server_unit/README](https://github.com/personium/ansible/tree/master/1-server_unit)、または[3-server_unit/README](https://github.com/personium/ansible/tree/master/3-server_unit)に記載されているサーバ証明書の作成例の通り作成した場合、以下のように表示されます。CNがコモンネームを表し、HTTPSプロトコルでアクセスをする際のFQDNと一致している必要があります。

    ```
    subject= /C=XXX/L=Default City/O=Default Company Ltd/CN=personium.example.com
    ```

## AP サービス

AP サービスが動作するサーバの基本設定を確認します。

### Tomcat 環境

* Personium ではAP を実現するためTomcat を使用しています。  
  Tomcat は以下のようにインストールしています。

| 項目                          | パス                                 |
|-------------------------------|-------------------------------------|
| インストールディレクトリ        | /opt/apache-tomcat-9.0.10/          |
| 設定ファイル                   | /opt/apache-tomcat-9.0.10/conf/     |
| ログ出力先                     | /personium/tomcat/logs/             |
| アプリケーション格納ディレクトリ | /opt/apache-tomcat-9.0.10/webapps/  |  

### ユニット証明書

* Personium はアクセストークン検証等の様々な機能でユニット証明書を使用している重要なファイルです。

1. まず、現在使用しているユニット証明書のパスを確認します。ユニット証明書はpersonium-unit-config.properties というファイルで指定されています。

    * 以下のコマンドを実行しファイルを確認します。  

    ```console
    # cat /personium/personium-core/conf/18888/personium-unit-config.properties | grep ^io.personium.core.x509
    ```

    Ansible で自動構築した環境は以下の設定になっています。
    
    ```
    io.personium.core.x509.root=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.crt=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.key=/opt/x509/unit.key
    ```

1. ユニット証明書のコモンネームを確認します。このとき、ユニット証明書のコモンネームが自身のPersonium Unit のFQDNと一致している必要があります。

    * 以下のコマンドを実行することでユニット証明書の情報を確認することができます。

    ```console
    # openssl x509 -noout -subject -in /opt/x509/unit-self-sign.crt
    ```

    * [How to generate Self-signed Unit Certificate](https://github.com/personium/ansible/blob/master/How_to_generate_Self-signed_Unit_Certificate.md) に記載されているユニット証明書の作成例の通り作成した場合、以下のように表示されます。CNがコモンネームを表し、HTTPSアクセスをする際のFQDNと一致している必要があります。

    ```
    subject= /C=XXX/L=Default City/O=Default Company Ltd/CN=personium.example.com
    ```

### Personium 環境

* Personium は以下のようにインストールされています。

| 項目                          | パス                                                                  |
|-------------------------------|-----------------------------------------------------------------------|
| personium-core                | /opt/tomcat/webapps/                                                  |
| personium-engine              | /opt/tomcat/webapps/                                                  |
| personium-core ログ出力先      | /personium/personium-core/log/personium-core.log                      |
| personium-engine ログ出力先    | /personium/personium-engine/log/personium-engine.log                  |
| ユニット設定ファイル            | /personium/personium-core/conf/18888/personium-unit-config.properties |  

* personium-unit-config.properties を変更することで[Unit設定](unit_config_list.md)をデフォルトから変更することができます。  

    Ansible での構築直後は以下のように設定されています。  
    \* {} はAnsible 実行前に変更したhosts で定義した内容が記載されることを表しています。  
    \* {{}} はAnsible 実行時にランダムで決められる文字列が記載されることを表しています。  

    ```
    io.personium.core.masterToken={master_token}
    io.personium.core.unitScheme=https
    io.personium.core.unitUser.issuers=personium-localunit:/UnitUserCell/ personium-localunit:/unitadmin/
    io.personium.core.lock.accountlock.time=1
    io.personium.core.plugin.path=/personium/personium-core/plugins
    io.personium.core.x509.root=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.crt=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.key=/opt/x509/unit.key
    io.personium.core.security.secret16={{token.key}}
    io.personium.core.security.auth.password.salt={{sakt.key}}
    io.personium.core.account.lastauthenticated.enabled=false
    io.personium.core.lock.memcached.host=127.0.0.1
    io.personium.core.lock.memcached.port=11211
    io.personium.core.lock.memcached.opTimeout=12000
    io.personium.core.cache.type=memcached
    io.personium.core.cache.memcached.host=127.0.0.1
    io.personium.core.cache.memcached.port=11212
    io.personium.core.cache.cell.enabled=true
    io.personium.core.cache.box.enabled=true
    io.personium.core.cache.schema.enabled=true
    io.personium.core.cache.memcached.opTimeout=12000
    io.personium.core.cache.memcached.expiresin=86400
    io.personium.core.es.hosts=127.0.0.1:9300
    io.personium.core.es.cluster.name=personium
    io.personium.core.es.ads.type=none
    io.personium.core.engine.enabled=true
    io.personium.core.engine.host=localhost
    io.personium.core.engine.port=18888
    io.personium.core.engine.path=personium-engine
    io.personium.core.binaryData.physical.delete.mode=true
    io.personium.core.binaryData.fsync.enabled=true
    io.personium.core.blobStore.root=/personium_nfs/personium-core/dav
    io.personium.core.event.log.current.dir=/personium_nfs/personium-core/eventlog
    io.personium.core.bar.file.maxSize=100
    io.personium.core.bar.entry.maxSize=10
    io.personium.core.bar.installfile.dir=/personium_nfs/personium-core/barInstall
    io.personium.core.bar.progress.expireInSec=259200
    io.personium.core.defaultBaseUrl=https://personium.example.com
    io.personium.engine.masterToken={master_token}
    io.personium.engine.elasticsearch.hosts=127.0.0.1:9300
    io.personium.engine.elasticsearch.cluster=personium
    io.personium.engine.binaryData.fsync.enabled=true
    io.personium.engine.blobStore.root=/personium_nfs/personium-core/dav
    io.personium.engine.x509.root=/opt/x509/unit-self-sign.crt
    io.personium.engine.x509.key=/opt/x509/unit.key
    io.personium.engine.x509.crt=/opt/x509/unit-self-sign.crt
    io.personium.engine.security.secret16={{token.key}}
    io.personium.core.dav.childresource.maxnum=1000000
    ```

#### ユニットマスタートークンについて

* 「personium-unit-config.properties」の「io.personium.core.masterToken」に記載されている値がユニットマスタートークンです。ユニットマスタートークンの初期設定はAnsible を実行したサーバで以下のコマンドを実行する事でも確認することが可能です。

    ```console
    # echo `grep "master_token" ~/ansible/static_inventory/hosts | sed -e "s/master_token=//" | uniq`
    ```

> ユニットマスタートークンは上記のPersonium 環境に記載している「personium-unit-config.properties」の「io.personium.core.masterToken」を参照することでも確認可能です。

**ユニットマスタートークン無効化の方法については [Unit のセキュリティ（デフォルトから変更したほうが良い設定）](unit_security.md)を参照ください。**

#### Personium ユニット管理アカウント

* Ansible を実行することで自動的にPersonium ユニット管理アカウントが作成されます。この情報はPersonium ユニット管理者がセルの作成等の管理作業を行う際に必要となります。

    ユニット管理アカウントのID/PASSの確認

    * 情報の取得のため、Ansibleを実行したサーバーにログインし、以下コマンドを実行します。

    ```console
    $ sudo su -
    # cat /root/ansible/unitadmin_account  
    unitadmin_account={unitadmin_account}  
    unitudmin_password={unitudmin_password}  
    Personium_FQDN={Personium_FQDN}  
    ```  

    * {Personium_FQDN} PersoniumユニットのFQDN
    * {unitadmin_account} ユニット管理アカウント
    * {unitudmin_password} ユニット管理パスワード

>**（注意）**  
>**ここで取得した情報は初期値であるため、ユーザが変更した場合は各自で管理するようにしてください。**

## DBサービス

* DB サービスが動作するサーバの基本設定を確認します。

### Elasticsearch 環境

* Personium はDB を実現するためElasticsearch を使用しています。  
  Elasticsearch は以下のようにインストールされています。  
  バージョンについては[こちら](https://github.com/personium/ansible#middleware-on-vm)のelasticsearchのバージョンをご確認ください。  

    | 項目                      | パス                                                        |
    |---------------------------|-------------------------------------------------------------|
    | インストールディレクトリ    | /opt/elasticsearch-{ Elasticsearch version }/               |
    | 設定ファイル               | /opt/elasticsearch-{ Elasticsearch version }/config/        |
    | ログ出力先                 | /personium/elasticsearch/log/                               |
    | データ格納ディレクトリ      | /personium/elasticsearch-{ Elasticsearch version }/data/    |  
