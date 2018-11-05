# 開発用環境の構築手順

## 対象OS
Windows

## 開発に必要なツール一覧

| ツール名 | バージョン | ダウンロードURL |
|:--|:--|:--|
| Eclipse (Pleiades) | 2018-09 Full Edition | http://mergedoc.osdn.jp/ |
| OracleJDK | 1.8系 | Pleiades同梱のものを使用するため個別の導入は行わない |
| Git | 最新 | https://git-scm.com/ |
| Maven | 3系 | https://maven.apache.org/download.cgi |

## 動作確認に必要なツール一覧

| ツール名 | バージョン | ダウンロードURL |
|:--|:--|:--|
| Tomcat | 8.0系 | Pleiades同梱のものを使用するため個別の導入は行わない |
| Elasticsearch | 2.4.1 | https://www.elastic.co/jp/downloads/past-releases/elasticsearch-2-4-1 |
| ActiveMQ | 5.15系 | http://activemq.apache.org/download-archives.html |
| Nginx | 1.14系 | http://nginx.org/download/nginx-1.14.0.zip |


## 各種ツールの初期設定
### OracleJDK
環境変数(JAVA_HOME)を設定します。  

```
変数：JAVA_HOME
値：C:\Program Files\pleiades\java\8
```

システム環境変数Pathに以下を追加します。
```
%JAVA_HOME%\bin
```

### Git
C:¥Users¥[user]¥.gitconfigに、以下の記述を追加します。  
```
[core]
	autocrlf = false
 	ignorecase = false
```

> プロキシ環境下に開発環境を構築する場合、以下も追記します。  
※{}の値はユーザ自身の情報を入力します。

```
[http]
	proxy = {protocol}://{username}:{pass}@{host}:{port}
[https]
	proxy = {protocol}://{username}:{pass}@{host}:{port}
```


### Maven

環境変数(M2_HOME)を設定します。  

```
変数：M2_HOME
値：C:\apache-maven-3.5.4
```

システム環境変数Pathに以下を追加します。
```
%M2_HOME%\bin
```

> プロキシ環境下に開発環境を構築する場合、apache-maven-3.5.4\conf\settings.xmlに以下の記述を追加します。  
※{}の値はユーザ自身の情報を入力します。

```
<proxies>
  <proxy>
      <id>proxy00</id>
      <active>true</active>
      <protocol>http</protocol>
      <username>{username}</username>
      <password>{pass}</password>
      <host>{host}</host>
      <port>{port}</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
  </proxy>
  <proxy>
      <id>proxy01</id>
      <active>true</active>
      <protocol>https</protocol>
      <username>{username}</username>
      <password>{pass}</password>
      <host>{host}</host>
      <port>{port}</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
  </proxy>
</proxies>
```

### Elasticsearch
#### elasticsearch-2.4.1\config\elasticsearch.ymlの修正

elasticsearch.ymlに以下の記述を追加します。

```
cluster.name: 【任意の名前】

index.number_of_shards: 1
index.number_of_replicas: 0
action.auto_create_index: false
index.refresh_interval : -1
http.cors.enabled: true
http.cors.allow-origin: "*"
indices.fielddata.cache.size: 80%（任意）
```

#### Elasticsearch用のPluginの導入
##### delete-by-query Plugin  
セルの再帰削除API時に使用するためのPluginを導入します。  
こちらのPluginは導入必須となります。  

コマンドプロンプト等で以下コマンドを実行します。
```
elasticsearch-2.4.1>bin\plugin install delete-by-query
```

##### elasticsearch-head Plugin  
ElasticSearchに保存されているデータを見やすくするためのPluginを導入します。  
こちらのPluginは導入推奨となります。  

コマンドプロンプト等で以下コマンドを実行します。
```
elasticsearch-2.4.1>bin\plugin install mobz/elasticsearch-head
```

> プロキシ環境下でPluginの導入がうまくできない場合、  
以下に記載した別途DLしてきたPluginをローカルで導入する手順を実施してください。  

1. Plugin導入のコマンドを実行します。  
失敗した場合、以下のメッセージが出力されます。  
    ```
    elasticsearch-2.4.1>bin\plugin install mobz/elasticsearch-head
    -> Installing mobz/elasticsearch-head...
    Trying https://github.com/mobz/elasticsearch-head/archive/master.zip ...
    ERROR: failed to download out of all possible locations..., use --verbose to get detailed information
    ```

1. 「Trying 」から「 ...」までに出力されたURLでPlugin本体をDL可能となります。  
ブラウザなどでDLし、適当な場所に置きます。  
C:\Tools\elasticsearch-2.4.1\tmp\elasticsearch-head-master.zip

1. Plugin installコマンドをURI指定で実行します。
    ```
    elasticsearch-2.4.1>bin\plugin install file:C:\Tools\elasticsearch-2.4.1\tmp\elasticsearch-head-master.zip
    ```

### ActiveMQ
特になし


### Tomcat
特になし


### Nginx
nginxの初期設定のため、nginx-1.14.0\conf配下に存在する以下の4ファイルを修正及び作成します。  

- nginx.conf（修正）
- personium_version.d/__version（作成）
- personium_version.d/personium-latest-version.conf（作成）
- backend.conf（作成）

#### nginx.confの修正
httpの中に以下記述を追加します。
```
    ignore_invalid_headers on;
    proxy_set_header Host $http_host;
    proxy_http_version 1.1;
    large_client_header_buffers 4 55k;

    include backend.conf;

    map $http_upgrade $connection_upgrade {
      default upgrade;
      '' close;
    }
```

http.server.location /を以下記述に変更します。
```
        location / {
            #root   html;
            #index  index.html index.htm;

            if ($request_uri ~ [\x00-\x20\x22\x3c\x3e\x5b-\x5e\x60\x7b-\x7d\x7f]) {
                return 400;
            }

            set $personium_version_port   "";
            include C:/nginx-1.14.0/conf/personium_version.d/personium-*.conf;

            if ($http_x_personium_version = '') {
                set $personium_version_port   $default_port;
            }

            if ($personium_version_port = '') {
                set $personium_version_port   $default_port;
            }

            if ($request_uri ~* ([^?]+)\?(.*)) {
              set $personium_path $1;
              rewrite .* /personium-core$personium_path break;
            }
            if ($is_args = "") {
              rewrite .* /personium-core$request_uri break;
            }

            # more_clear_input_headers 'Transfer-Encoding';
            proxy_pass http://backend_$personium_version_port;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header X-Forwarded-Proto http;
            proxy_set_header X-Forwarded-Path $request_uri;
            proxy_set_header Host $http_host;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_hide_header X-Powered-By;
            proxy_hide_header X-Rack-Cache;
            proxy_hide_header X-Content-Digest;
            proxy_hide_header X-Runtime;
            # include       host-acl.conf;
        }
```

#### personium_version.d/__versionの作成

ファイルを作成し、以下記述を追加します。
```
[""]
```

#### personium_version.d/personium-latest-version.confの作成

ファイルを作成し、以下記述を追加します。
```
set $default_port 8080;
```

#### backend.confの作成

ファイルを作成し、以下記述を追加します。
```
upstream backend_8080 {
  server localhost:8080 fail_timeout=1800s;
}
```


## Eclipseへのプロジェクト登録
personium-coreとpersonium-engineをプロジェクトとして登録します。  
1. GitHubのリポジトリからcloneします。  
https://github.com/personium/personium-core.git  
https://github.com/personium/personium-engine.git

1. Eclipseのmavenプロジェクトとしてそれぞれを登録します。  

1. それぞれの/src/main/resourcesにpersonium-unit-config.propertiesを作成します。
> io.personium.core.es.cluster.nameの値はElasticsearchのconfigファイル（elasticsearch.yml）  
のcluster.nameで設定した値を指定します。

**/personium_core/src/main/resources/personium-unit-config.properties**
```
#################################################
# personium-core configurations
#################################################
# general configurations
io.personium.core.masterToken=personiumio
io.personium.core.unitScheme=http
#io.personium.core.unitPort=9998
io.personium.core.unitPort=8080
#io.personium.core.unitPath=
io.personium.core.unitPath=/personium-core

io.personium.core.unitUser.issuers=personium-localunit:/unitadmin/ personium-localunit:/unitadmincell/ personium-localunit:/unitusercell/

# cell configurations
io.personium.core.cell.relayhtmlurl.default=https://demo.personium.io/app-cc-home/__/index.html

io.personium.core.es.cluster.name=【elasticsearch.ymlで設定した値】
io.personium.core.es.retryTimes=10

io.personium.core.plugin.path=/personium/plugins
io.personium.core.blobStore.root=/personium_nfs/personium-core/dav
io.personium.core.bar.tmp.dir=/personium_nfs/personium-core/bar
io.personium.core.event.log.current.dir=/personium_nfs/personium-core/eventlog
io.personium.core.cellSnapshot.root=/personium_nfs/personium-core/snapshot

# lock type configurations
io.personium.core.lock.type=inProcess

# cache configurations (memcached protocol)
io.personium.core.cache.type=inProcess
io.personium.core.cache.cell.enabled=false
io.personium.core.cache.box.enabled=false
io.personium.core.cache.schema.enabled=false

# security configurations
io.personium.core.security.secret16=gv7hpmmf5siwj5by
io.personium.core.security.auth.password.salt=voAbizvF
io.personium.core.security.dav.encrypt.enabled=false

# Davlimit configurations
io.personium.core.dav.childresource.maxnum=30
io.personium.core.dav.depth.maxnum=5

# OData $links configurations
io.personium.core.odata.links.NtoN.maxnum=40
```

**/personium_engine/src/main/resources/personium-unit-config.properties**
```
#################################################
# personium-engine configurations
#################################################
# general configurations
io.personium.core.masterToken=personiumio

io.personium.core.es.cluster.name=【elasticsearch.ymlで設定した値】

io.personium.core.blobStore.root=/personium/personium_nfs/personium-core/dav

# security configurations
io.personium.core.security.secret16=secret167pm5m4y6

```

> ※Eclipse上でmavenやpom.xml関連のビルドエラーが出ている場合、  
以下に記載した手順を実施してください。

コマンドプロンプト等でpom.xmlが存在するディレクトリに移動します。  
以下のコマンドを実行します。
```
mvn clean package -DskipTests
```
コマンドがSUCCESSで終了しなかった場合は原因を取り除いて再度実施します。  
Eclipse上で対象プロジェクトを右クリック→[Maven]→[プロジェクトの更新]→[OK]を選択します。


## 起動確認方法
### Elasticsearch起動確認

コマンドプロンプト等でserviceファイルが存在するディレクトリに移動します。  
以下コマンドを実行します。
```
elasticsearch-2.4.1\bin>service install
elasticsearch-2.4.1\bin>service start

```

ブラウザでhttp://localhost:9200にアクセスします。  

以下のように出力されると起動成功となります。
```
{
  "name" : "MODAM",
  "cluster_name" : "【elasticsearch.ymlで設定した値】",
  "cluster_uuid" : "VM2fJ2hXQRSI4PsYhJBtLA",
  "version" : {
    "number" : "2.4.1",
    "build_hash" : "c67dc32e24162035d18d6fe1e952c4cbcbe79d16",
    "build_timestamp" : "2016-09-27T18:57:55Z",
    "build_snapshot" : false,
    "lucene_version" : "5.5.2"
  },
  "tagline" : "You Know, for Search"
}
```

### ActiveMQ起動確認

コマンドプロンプト等でactivemqファイルが存在するディレクトリに移動します。  
以下コマンドを実行します。
```
apache-activemq-5.15.2\bin>activemq start

```

ブラウザでhttp://localhost:8161にアクセスします。  
管理画面が表示されると起動成功となります。  


### nginx起動確認

コマンドプロンプト等でactivemqファイルが存在するディレクトリに移動します。  
以下のコマンドを実行します。  
```
nginx-1.14.0>start nginx

```

ブラウザでhttp://localhostにアクセスします。  
時間経過でタイムアウトとなり、nginxのエラー画面が表示されると起動成功となります。


### 開発用サーバ起動確認
Eclipse上で[personium-core]プロジェクトを右クリック→[実行]→[サーバで実行]を選択します。  

初回は新規サーバの定義でTomcat8のサーバを追加して実行します。  

> ※Tomcat8の起動でタイムアウト時間を超えて起動エラーになることがあります。  
EclipseでTomcat起動時のタイムアウト時間を変更してください。


ブラウザでhttp://localhost/にアクセスします。  
以下のように出力されると起動成功となります。
```
{"unit":{"path_based_cellurl_enabled":true,"url":"http:\/\/localhost:8080\/personium-core\/"}}
```

