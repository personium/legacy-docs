# Unit間連携の設定方法

## 概要

Personiumは別々のサーバインフラに⽴てられたに立てられたユニットが相互に連携しあうことが出来ることを大きな特長としています。
具体的にはユニット間の連携を設定することにより、ユニットをまたいだCell間の連携が可能となります。
そのように設定しないこともできますが、Personiumのこの特長を活かしてアプリやユーザのエコシステムをユニットをまたいで共有するためこの連携設定が推奨されます。

逆に言えば、この設定を行わない限りユニットをまたいだCellの連携はできませんので注意が必要です。

ユニット間の連携の設定は、ユニットに以下の設定をすることにより行います。

1. ユニット秘密鍵
1. ユニット証明書
1. ユニット証明書発行者の証明書

ユニット秘密鍵についてはユニットの運営者が自身で作成し管理するものですが、ユニット証明書を誰に発行してもらうかという点については３つのオプションがあります。

1. オープンソースPersoniumコミュニティに発行してもらう
1. 他のユニット証明書発行者から発行してもらう
1. 自身で自己署名ユニット証明書を作りそれを使う

ユニット証明書は、そのユニットが不正な主体によって運営されていないことを証明するもので、x509のPKIフレームワークによりこれを実現しています。具体的にはユニットを認証する何等かの主体がユニット証明書発行者となります。


## 連携設定の流れ

ユニット証明書発行を受ける手順は、同じくx509のSSL/TLSのサーバ証明書発行を受ける手順と同じです。
具体的には以下の流れでUnit間連携設定を行います。

1. ユニット（サーバ）運営者がopenssl等のツールを使って秘密鍵とCSRを作成
1. ユニット運営者がCSRを証明書発行者に送付し証明書の発行を依頼
1. 証明書発行者が依頼を吟味し問題なければ証明書を発行
1. ユニット運営者が発行された証明書と自身が1で作成した秘密鍵をユニットに設定

2, 3については、誰がユニット証明書発行者となるかでプロセスが変わります。


## 秘密鍵の作成

以下にopensslを使った秘密鍵作成の手順を示します。

```console
    # openssl genrsa -out unit.key 2048 -outform DER
```  
Example:)

```console
    # openssl genrsa -out unit.key 2048 -outform DER
    Generating RSA private key, 2048 bit long modulus
    ............................................................+++
    ...................................................+++
    e is 65537 (0x10001)
    -----------------------------------------------------------------------------------
```

ここで得られたunit.keyが秘密鍵です。
Confirm that the unit.key is created

```console
    # ls -l
```

Example:)

```console
    # ls
    total 4
    -rw-r--r--. 1 root root 1675 Sep  1 20:27 unit.key
```

## CSRの作成

unit.keyを使ってCSRを作成します。以下で得られるunit.csrがCSRです。
CSR作成時に、CN項目にユニットを運用しようとしているFQDNを設定してください。


```console
  # openssl req -new -key unit.key -out unit.csr
    > enter the required information interactively.
      * Common Name value should be the unit domain name (required)
```

Example:)

```console
    # openssl req -new -key unit.key -out unit.csr
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [XX]:
    State or Province Name (full name) []:
    Locality Name (eg, city) [Default City]:
    Organization Name (eg, company) [Default Company Ltd]:
    Organizational Unit Name (eg, section) []:
    Common Name (eg, your name or your server's hostname) []:example.com            <* Enter the unit domain name (required)
    Email Address []:
    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

```



## CSRをもとに証明書の発行を受ける

### Personiumプロジェクトに依頼する場合

Personiumユニットエコシステムへ参加させる場合は、Personiumプロジェクトにユニット証明書の発行を依頼してください。

⇒Slackコミュニティで依頼を出してください。


### 自己発行する場合

他のユニットと連携させない設定をする場合は、自己署名のユニット証明書を設定することによりこれを行うことができます。

https://github.com/personium/ansible/blob/master/3-server_unit/How_to_generate_Self-signed_Unit_Certificate.md


## 秘密鍵と証明書の設定

発行された証明書と自身が1で作成した秘密鍵をサーバに設定します。ユニット設定ファイルの以下項目の設定を行ってください。

|キー名|設定内容|
|:--|:--|
|x509.key|ユニット秘密鍵ファイルのパス|
|x509.crt|ユニット証明書ファイルのパス|
|x509.root|ユニット証明書発行者の証明書ファイルのパス|

x509.rootについては、複数のファイルの指定が可能です。
何も指定しなければPersonium公式CAの証明書は自動的に信頼されます。(キーの定義もしない)
何等かの設定を行えばこの動作は無効化されるので、Personiumプロジェクトのエコシステムに参加
させたくない場合は、何等かの設定を行ってください。

参照：
https://personium.github.io/ja/server-operator/unit_config_list.html

## ユニット証明書発行者となるには

オープンソースPersoniumコミュニティもユニット証明書発行者です。もし私どもの活動にご賛同いただけるのであれば、ぜひ私たちのエコシステムに参加してください。ユニットにオープンソースPersoniumコミュニティ発行のユニット証明書を設定いただくことでエコシステムへの参加が可能です。

一方で、独自のエコシステムを構築したい場合は、だれでもX509の認証局を立ててユニット証明書発行者となって
独自のエコシステムを形成することができます。ユニット証明書発行者となるためには以下２点が必要となります。

1. X509の認証局を立てる
1. エコシステムに参加するユニットに、ユニット証明書発行者の証明書として1で立てたX509認証局の証明書を設定してもらう

この方法についての関心があり具体的な方法を知りたい方、コミュニティにお問い合わせください。
