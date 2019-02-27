Personium Unitの percell 環境時の設定
------------------------------------

PersoniumではセルにアクセスするURL形式として以下の２つの形式をサポートしています。  

||アクセス形式|備考|
|:--|:--|:--|
|path based|https&#58;//fqdn/cellname|1.7.4以前のデフォルト<br>|
|percell fqdn|https&#58;//cellname.fqdn|1.7.5以降のデフォルト<br>|

このアクセス形式はPersoniumユニット起動時のオプション（pathBasedCellUrl.enabled）の値で切り換えることが可能です。  
personium-core1.7.5リリースからデフォルトになったpercell形式でのアクセスには、幾つかの必須要件があるので記載します。  

必須要件
----
### cell毎に異るFQDNによるアクセスを一つのPersoniumサーバに向ける

利用者がアクセスするURLに任意のcell名を含んでいるため、cell1.fqdnとcell2.fqdnは別のURLとして扱われます。  
処理をおこなうPersoniumのサーバに全てのcellのURLをアクセスさせるためのDNSサーバへの設定が必要になります。  
*.fqdn へのアクセスをPersoniumサーバにリダイレクトする設定が必要になります。設定方法はDNSサーバによって異りますが  

* CNAMEレコードで https&#58;//*.fqdn ⇒ https&#58;//fqdn にリダイレクトする
* Aレコードでhttps&#58;//*.fqdnのアクセス先にhttps://fqdnと同じIPアドレスを指定する

等があります。  

### WebサーバのSSL証明書を*.fqdnがサポートされているものに変更する

同様に、httpsアクセスをおこなうためのWebサーバのSSL証明書も*.fqdnに対応したものにする必要があります。  
設定方法としては以下のようになります。  

1. PersoniumのWebサーバにteraterm等でログインしrootユーザになる
1. /opt/nginx/conf/nginx.confのSSL設定の内容を確認し、証明書をいれかえる
1. systemctl restart nginx nginxを再起動します。

なお、証明書の種別によって設定方法が異なりますので、入手元に御確認下さい。  

既存環境からの移行時の設定
----
### pathbase環境をpercell環境に変更する
#### Personium Unitの設定ファイルの変更
未稿
#### unitmanager
未稿
#### RT
未稿
