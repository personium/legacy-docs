# ユニット管理者向けガイド

構築・設定済のPersoniumユニットに対してユニットユーザトークンを使ってアクセスして、
ユニット管理者の主たる業務、すなわちCellの作成・払出しや、払出したCellの管理等を実施する方のためのドキュメントです。

Personiumユニットを構築したい方や、Personiuサーバプログラムをビルド・デプロイし設定をする方は[サーバソフトウェア運用者向けガイド](../server-operator/README.md)をご覧ください。

## ユニットユーザとユニットレベルAPI

Personiumユニットで認識されるユニットユーザトークンの発行を受けられるユーザをユニットユーザと呼んでいます。

* [ユニットユーザ](./Unit-User.md)

Cellの生成や管理を司るUnitレベルAPIへのアクセスにはユニットユーザトークンが必要です。また
Cellは生成されたときにどのユニットユーザトークンで生成されたかを覚えています。
ユニットユーザはユニットユーザトークンを使ったAPIアクセスで、自身が作ったCellに対しては、
Cellレベル・BoxレベルのすべてのAPIに特権アクセス可能です。


## GUIを利用したユニットの管理

ユニットマネージャGUIを使うことで、ほぼすべてのAPIアクセスをユニットユーザとして実施することができます。

[app-uc-unit-manager](https://github.com/personium/app-uc-unit-manager)

このツールは、複数の起動方法をサポートしており、ユーザCellのHomeアプリから起動したときは、
アクセスすべき対象CellのURLやアクセスのためのトークン情報が起動パラメタとして付加された形で起動します。

特にそのようなパラメタ指定なく起動したときは、ユニットマネージャGUIとして起動します。

## Cell払出サンプルクライアント

[app-uc-cell-creator](https://github.com/personium/app-uc-cell-creator)

## その他

* [データの管理](./Data_Management.md)


## 関連するリポジトリ
* [app-uc-unit-manager](https://github.com/personium/app-uc-unit-manager)
* [app-uc-cell-creator](https://github.com/personium/app-uc-cell-creator)

