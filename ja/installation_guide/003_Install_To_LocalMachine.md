
###概要

この手順では、Vagrant + Ansibleを使用して1VM上にPersoniumユニットを設定できます。
あなたのマシンに簡単にセットアップして、Personium APIを探索することができます。

\* この手順は、VirtualBox 4.3.20およびVagrant 1.7.2でテストされています。

\* [申し訳ありません、この文書は古くなっています。 アップデートを準備中です。]

###セットアップ

では、Personiumをセットアップしましょう！

1. VirtualBoxをダウンロードしてインストールします。 [(ダウンロードページ)](https://www.virtualbox.org/wiki/Downloads)

2. Vagrantをダウンロードしてインストールします。 [(ダウンロードページ)](https://www.vagrantup.com/downloads)

3. このリポジトリをクローンします。 (https://github.com/personium/io-vagrant-ansible.git)

     \* Windowsマシンの場合、gitクライアントの設定でcore.autocrlfがfalseに設定されているので、シェルスクリプトが存在するようにしてください。

	``` bash
	$ git clone https://github.com/personium/io-vagrant-ansible.git
	```

4. クローンを作成したローカルリポジトリ配下のio-vagrant-capableディレクトリに移動し、vagrantを実行します。 \*このプロセスには約30分かかります。

    \*ネットワークがプロキシの下にある場合は、下記の「プロキシ環境」をお読みください。

    \* Tomcatが時折起動に失敗するようです。 60秒以上かかると起こります。 tomcatが起動していることを確認して次のステップに進んでください。

	``` bash
	$ cd ./io-vagrant-ansible
	$ vagrant up
	```
5. Personiumユニットが起動して動作していることを確認します。

	```bash
	$ curl -X POST "http://localhost:1210/__ctl/Cell" -d "{\"Name\":\"sample\"}" -H "Authorization:Bearer personiumio" -H "Accept:application/json" -i -s
	```

	Personiumユニットが正常にセットアップされた場合、以下のように201レスポンスが返され、Cellが作成されます！

	```bash
	HTTP/1.1 201 Created
	Date: Mon, 26 Jan 2015 12:32:13 GMT
	Content-Type: application/json
	Transfer-Encoding: chunked
	Connection: keep-alive
	Access-Control-Allow-Origin: *
	DataServiceVersion: 2.0
	ETag: W/"1-1422275532964"
	Location: http://localhost:1210/__ctl/Cell('sample')
	X-Personium-Version: 1.4.2
	Server: Personium

	{"d":{"results":{"__metadata":{"uri":"http:\/\/localhost:1210\/__ctl\/Cell('sample')","etag":"W\/\"1-1422275532964\"","type":"UnitCtl.Cell"},"Name":"sample","__published":"\/Date(1422275532964)\/","__updated":"\/Date(1422275532964)\/"}}}
	```

####プロキシ環境

```vagrant up```を実行する前に、

1. vagrant-proxyconfプラグインをインストールします。 (http://weblabo.oscasierra.net/vagrant-proxyconf/)

	``` bash
	$ vagrant plugin install vagrant-proxyconf
	```

2. Vagrantfileでプロキシ設定を有効にします。 以下は、プロキシを設定する方法の例です。

	``` bash:Vagrantfile
	if Vagrant.has_plugin?("vagrant-proxyconf")
	　config.proxy.http = "http://username:password@host:port/"
	　config.proxy.https = "http://username:password@host:port/"
	　config.proxy.no_proxy = "localhost,127.0.0.1"
	end
	```

3. プロキシ設定が完了したら、```vargrant up```を実行します。

####管理

手動でプロセスを開始するには、次のコマンドを使用します。

        sudo service elasticsearch start
        sudo service logback start
        sudo service memcached_lock start
        sudo service memcached_cache start
        sudo service nginx start
        sudo service tomcat start

####設定したPersoniumの情報

上記の手順でPersoniumを設定すると、以下のようにPersoniumが構築されます。

#####ローカルPersoniumについて

* parameters

	|parameter    |           |
	|:------------|-----------|
	|FQDN         |localhost  |
	|PORT         |1210       |
	|UnitUserToken|personiumio|

* Personium modules

	|module     |
	|:----------|
	|personium-core   |
	|personium-engine |


##### OSとVM上のミドルウェアについて

* OS

	CentOS 6.5 x86_64

* ミドルウェア

    |Category       | Name           |Version       |                   |
    |:--------------|:---------------|-------------:|:------------------|
    | java          | JDK            |         8u25 | --                |
    | tomcat        | tomcat         |       8.0.14 | web               |
    |               | commons-daemon |       1.0.15 | --                |
    | nginx         | nginx          |        1.7.6 | proxy             |
    |               | Headers More   |         0.25 | --                |
    | logback       | logback        |        1.0.3 | --                |
    |               | slf4j          |        1.6.4 | --                |
    | memcached     | memcached      |       1.4.21 | cache             |
    | elasticsearch | elasticsearch  |        1.3.4 | db&sarch engine   |


#### 必要なホストマシンのRAM

Personiumを実行するには、1GBのホストマシンのRAMが必要です。
