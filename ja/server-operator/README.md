# サーバソフトウェア運用者向けガイド

Personiumのサーバソフトウェアを使ってPersoniumユニットを構築する方や、Personiumサーバプログラムをビルド・デプロイ・設定する方、
Personiumを使用したPDSサービス環境を提供・運用したい方向けのドキュメントです。

構築・設定済のPersoniumユニットに対して、Cellの作成・払出しや、払出したCellの管理等を実施する方は、[ユニット管理者向けガイド](../unit-administrator/)をご覧ください。

## Personiumのユニット構成

Personiumのユニットは評価、開発、確認、運用等々の様々な異なる目的に応じて構成することが可能です。Personiumは必要に応じて簡単に、環境を自動構築できるセットアップツールを提供しています。  
Personiumのユニットはセットアップツールを使用せずに構築することも可能ですが、Personiumのユニットを簡単に構築するためにセットアップツールの使用をお勧めいたします。

## Personiumセットアップツール

本セットアップツールはPersoniumをインストールする前に、あなたのサーバー（linuxのサーバーまたはWindowsやMac上の仮想マシン）へのミドルウェアの導入やOSやネットワークの設定を行います。  
セットアップツールにはPersoniumとのユニットの構成に応じて複数の形式がありますので、あなたの目的に応じたセットアップツールをご使用ください。

## Personiumにおける各サーバーの役割

Personiumのユニットは以下の役割を持ったサーバーから構成されます。これらの役割は相互に接続された単独または複数のサーバーに割り当てることが可能です。

| 役割 | 必須 | 詳細 |
| :-- | :-- | :-- |
| Web | 必須 | リバースプロキシーサーバー。インターネットからのアクセスが可能なグローバルなIPアドレスを保有する必要があります。  |
| AP | 必須 | Personiumが動作するアプリケーションサーバーです。  |
| ES | 必須 | ElasticSearchが動作するサーバーです。  |
| MQ | 必須 | ActiveMQが動作するサーバーです。  |
| NFS | 必須 | ネットワークファイルシステム(NFS)が動作するサーバーです。  |
| Bastion | オプション|踏み台サーバ。各サーバへのsshでのアクセスを中継させるためにのサーバです。  |

## ユニット構成設計

Personiumはスケーラブルなアーキテクチャを採用しています。評価用や個人利用であれば1台のマシンにすべてを詰め込んだPersoniumユニットを構築することも可能です。一方で数百人、数千人が使うユニットを構築するには、セキュリティや性能といった非機能が必要となるため、Web層-AP層-DB層といった層構成をとるのが推奨されますので、最低2-3台の構成をとるべきでしょう。さらに数万人～数十万人以上が日々使う大規模なユニット構成するためには各層をスケールアウトさせ、10台-20台といった構成をとることとなります。

まずは、どのような構成のユニットを作るべきかを決め、必要なインフラ設計をしましょう。

## ユニットの構築

ユニット構築には仮想イメージ、Vagrant、Ansibleを利用することができます。またOpen Stack ベースのクラウド環境に構築する場合は Heat Template を使えば、ほぼ自動でユニット構築が可能です。もちろん、これら自動構築ツールを使わないで任意のクラウドや物理/仮想マシンを使ってユニット構築を行うこともできます。しかし、そのための手順等ドキュメントを私たちが準備しメンテナンスする体力がないため、以下Open StackのHeatを使ったサーバインフラ構築手順やAnsibleを使ったユニット自動構築手順を参考に構築を行ってください。

さまざまな環境でユニットが構築できたというお話をコミュニティの#infraチャンネルで聞かせて頂けると嬉しく思います。

|    | サーバ | サーバ構築 | Personiumセットアップ | 導入済拡張エンジン | Personiumバージョン | CellにアクセスするURL形式 | 導入済アプリケーション | デフォルトFQDN |
| :- | :----- | :-------- | :------------------- | :------------- | :------------------ | :------------------ | :------------------ | :------------------ |
| Personiumを使ってみる | Linuxサーバ1台 | 不要 | 不要 | httpclient<br>ew-services<br>mailsender<br>slack | 1.6.15 | path based cell url | unit-manager | personium.example.com |
| | | | | | 1.7系（未定） | path based cell url | unit-manager | personium.example.com |
| | | | | | 1.7系（未定） | per cell fqdn url | なし※1 | personium.example.com |
| 小規模環境 | Linuxサーバ1台 | Vagrant | 不要 | httpclient<br>ew-services<br>mailsender<br>slack | 最新 | path based cell url | unit-manager | personium.example.com |
| | | | | | 最新 | per cell fqdn url | なし※1 | personium.example.com |
| | | ユーザ側でLinuxサーバを準備 | Ansible | なし | 任意<br>デフォルトは最新 | path based cell url<br>per cell fqdn url | なし※1 | なし |
| 中・大規模環境 | Linuxサーバ3台 | HeatTemplate | Ansible | なし | 任意<br>デフォルトは最新 | path based cell url<br>per cell fqdn url | なし※1 | なし |
| | | ユーザ側でLinuxサーバを準備 | 自力 | なし | 任意<br>デフォルトは最新 | path based cell url<br>per cell fqdn url | なし※1 | なし |
※1 unit-managerをインストールしたい場合は、[こちら](https://github.com/personium/app-uc-unit-manager/blob/master/README_ja.%6D%64)の手順をご確認ください。

### Personiumを使ってみる

* 仮想イメージを利用したユニットの自動構築
  
    仮想イメージを利用してユニットを構築するためのガイドを公開しています。  

    * [仮想イメージを利用したユニット構築ガイド](./setup_virtual_image.md)

### 小規模環境(サーバ1台で動作するPersonium環境)を構築する

**もしもあなたが、Personiumにより一層興味を持ち、アプリケーションの開発やテストを実施してみたいと思ったならば、1台のサーバからユニットが構成される、本構成をお勧めします。**

* Vagrant  

    Vagrantを利用してユニットを構築するためのガイドを公開しています。  

    * [Vagrantを利用したユニット構築ガイド](https://github.com/personium/setup-vagrant)  

* Ansible(1-Server)   
   
    Ansible(1-Server)を利用してLinuxサーバ1台構成のユニットを構築するためのガイドを公開しています。

    * [Ansible(1-server)を利用したユニット構築ガイド](https://github.com/personium/ansible/tree/master/1-server_unit)

### 中・大規模環境(サーバ3台で動作するPersonium環境)を構築する

**もしもあなたがPersoniumプロジェクトにご参加いただき、アプリケーションをリリースしようとするならば、3台のサーバからユニットが構成される、本構成をお勧めします。**

* Open Stack Heat

    HeatTemplateを利用して、OpenStackでPersonium 3Serverユニット用のネットワークおよびサーバ構成を自動構築するためのガイドを公開してしています。

    * [Open Stack Heatを利用したサーバインフラの自動構築](https://github.com/personium/openstack-heat)

* Ansible(3-Server)

    Ansible(3-Server)を利用してLinuxサーバ3台構成のユニットを構築するためのガイドを公開しています。

    * [Ansible(3-server)を利用したユニット構築ガイド](https://github.com/personium/ansible/tree/master/3-server_unit "3-server_unit")

### 構築したユニットの環境情報

構築したユニットの主要なミドルウェアの環境情報を確認します。

* [構築したユニットの環境確認](./Confirm_environment_settings.md)

構築完了後、ユニットの管理方法を確認したい場合は[こちら](../unit-administrator/)をご覧ください。

### Pluginの導入

**Ansible(1-Server)**、**Ansible(3-Server)**の手順を利用して環境を構築した場合はこちらも併せてご覧ください。

* [認証Pluginのセットアップ](./setup_authentication_plugins.md)
* [Engine Extensionのセットアップ](./setup_engine_extensions.md)

## ユニットの設定

ユニットの構成ができたら、ユニットを正しく設定する必要があります。
自動構築ユニットには基本的な設定はひととおりされていますが、完全ではありません。以下を参照し適切な設定を行ってください。

* [Unitの運用設計と設定](./unit_operation_design.md)
* [Unitの設定一覧](./unit_config_list.md)
* [Unit間連携の設定方法](./unit_coordination.md)

## ユニットの起動・停止

設定が終わったらユニットの起動です。以下の順序で各サーバの起動を行ってください。

| 起動順序 |              起動方法              |
| :------- | :--------------------------------- |
| 1        | Memcached, ElasticSearch, ActiveMQ |
| 2        | Tomcat                             |
| 3        | Nginx                              |

停止については上記の逆順で実施ください。

## ユニットの運用

* サーバのセキュリティ対応について  
    多くの場合Personiumのユニットには個人のプライバシーに関わる情報が入りますし、そもそもインターネット上にサーバを立てる上でセキュリティ対策は必須です。初期構築されたままでユニットを放置せず、適切にセキュリティパッチを適用してください。

* ユニットのセキュリティ対応について  
    構築した環境は場合によってはセキュリティホールとなりえる情報が設定が含まれています。そのため、デフォルトから変更したほうが良い設定について説明します。
    
    * [デフォルトからの変更を推奨する設定](unit_security.md)

### 関連するリポジトリ

* [ansible](https://github.com/personium/ansible)
* [openstack-heat](https://github.com/personium/openstack-heat)
