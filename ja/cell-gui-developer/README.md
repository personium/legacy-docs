# Cell GUI開発者向けガイド

CellのGUIを開発したい人向けのドキュメントです

## CellのGUI
Personium は原則全機能をAPIで提供するPDSですが、例外的にGUIを使えるような設定ができる部分が３点あります。

1. Cell URLへのGET （Content-Typeとしてapplication/jsonが設定のないとき）
1. OAuth2.0認可エンドポイント
1. 認可エンドポイントでのパスワード強制変更画面

これらGUIはユニット運用者のブランディングでカスタマイズすべき部分として、後述方法で任意のHTMLを設定可能です。

## 設定の方法

ユニットレベルでの一律の設定と、Cell単位での個別設定が可能です。
Cell単位の設定が優先され、Cell単位設定がない場合ユニットレベルの設定が使われます。

||Unit 設定|Cell設定|備考|
|:--|:--|:--|:--|
|[Cell URLへのGET](https://personium.io/docs/ja/apiref/current/200_Cell_Root.html)|cell.relayhtmlurl.default|p:relayhtmlurl||
|[認可エンドポイント](https://personium.io/docs/ja/apiref/current/292_OAuth2_Authorization_Endpoint.html)|cell.authorizationhtmlurl.default|p:authorizationhtmlurl||
|[パスワード変更](https://personium.io/docs/ja/apiref/current/292_OAuth2_Authorization_Endpoint.html)|cell.authorizationpasswordchangehtmlurl.default|p:authorizationpasswordchangehtmlurl||


## サンプルGUI

GUIのサンプルはプロジェクトで配布しています。
配布しているものをほぼそのまま使いつつ、見た目（ブランディング）のみを変更することも可能です

[ホームアプリ](https://github.com/personium/app-cc-home)


