# ユニット管理者向けガイド

構築・設定済のPersoniumユニットに対してユニットユーザトークンを使ってアクセスして、
ユニット管理者の主たる業務、すなわちCellの作成・払出しや、払出したCellの管理等を実施する方のためのドキュメントです。

Personiumユニットを構築する方や、Personiumサーバプログラムをビルド・デプロイ・設定する方は、[サーバソフトウェア運用者向けガイド](../server-operator/README.md)をご覧ください。

## ユニットユーザとユニットレベルAPI

ユニットユーザとはPersoniumユニットで認識されるユニットユーザトークンの発行を受けたユーザで、
セルのCRUD等ユニットレベルのAPIを操作可能な主体となります。

* [ユニットユーザ](./Unit-User.md)

Cellの生成や管理を司るUnitレベルAPIへのアクセスにはユニットユーザトークンが必要です。また
Cellは生成されたときにどのユニットユーザトークンで生成されたかを覚えており、自身を作成した
ユニットユーザに対しては、常にCellレベル・BoxレベルのすべてのAPIに特権アクセスを許可します。


## GUIを利用したユニットの管理

ユニットマネージャGUIを使うことで、ほぼすべてのAPIアクセスをユニットユーザとして実施することができます。

[app-uc-unit-manager](https://github.com/personium/app-uc-unit-manager)

このツールは、複数の起動方法をサポートしており、ユーザCellのHomeアプリから起動したときは、
アクセスすべき対象CellのURLやアクセスのためのトークン情報が起動パラメタとして付加された形で起動します。
その場合このアプリはCellマネージャとして振舞います。一方で、特にそのようなパラメタ指定なく起動したときは、
ユニットマネージャGUIとして起動します。

## Cell払出サンプルクライアント

前述 UnitManager GUIを使えば、手動で様々なAPI操作を試すことができますが、ユニット管理者にとって
Cell発行希望者に対していちいち手動でレコードを追加してゆくのは苦痛かつ非現実的でしょう。

[app-uc-cell-creator](https://github.com/personium/app-uc-cell-creator)

多くの場合上記のようなアプリケーションを作成し管理者が運用したり、利用申し込み画面を作成したり
といったこととなりますが、この際API呼び出し方法等は上記サンプルアプリをご参照ください。


## その他

* [データの管理](./Data_Management.md)


## 関連するリポジトリ
* [app-uc-unit-manager](https://github.com/personium/app-uc-unit-manager)
* [app-uc-cell-creator](https://github.com/personium/app-uc-cell-creator)

