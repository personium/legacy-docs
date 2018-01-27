# アプリ開発者向けガイド

PersoniumのAPIを使用して、PDSアプリを開発したい人向けのドキュメントです

## 概要

## 技術情報

* [アプリ開発ガイド](./Personium_Apps.md)  
* [クライアント登録&認証](../user_guide/004_Client_auth.md)
* [アプリ認証](./app_authn.md)
* [Homeアプリからの起動](./launch_from_homeapp.md)
* [Box内でODataを使う](./using_odata.md)
* [Personium Engine](./Personium-Engine.md)

## サンプルアプリ

Webブラウザ向けのAjaxアプリとしてのサンプルアプリがいくつか公開されています。

* [app-myboard](https://github.com/personium/app-myboard)
* [app-sample-calorie-smile](https://github.com/personium/app-sample-calorie-smile)

また、Webブラウザ向けのAjaxアプリを作る際の土台となるプロジェクトテンプレートもも公開してます。

* [template-app-cell](https://github.com/personium/template-app-cell)



## 開発者用ツール

#### [Cell Manager](https://github.com/personium/app-uc-unit-manager)
Cell ManagerはCellの管理者としてPersonium CellのほぼすべてのAPI呼び出しを行うことができるGUIツールです。
[![Cell Manager Intro](https://img.youtube.com/vi/d1_pET0M-YA/3.jpg)](https://www.youtube.com/embed/d1_pET0M-YA)

アプリ開発で正しくデータが入ったかどうか確認を行ったり、テストデータを入力・削除等行ったりするのに便利です。

詳しくは[Cell Managerのリポジトリ](https://github.com/personium/app-uc-unit-manager)のREADMEファイルをご覧ください。


#### [PCUI](https://github.com/personium/pcui)

PCUIは、Personium REST API を curlではなく、スクリプト言語から呼び出す際のサンプルプログラムです。主に参照系のAPIのサンプルを実装しています。

PCUIを試すには、以下の環境が必要です。
* Ruby 2.0以上
    * お使いのRubyパッケージによっては、以下のようなライブラリを追加でインストールすることが必要となります。require でロードエラーが発生した場合は、お使いの環境のパッケージングシステムで必要なライブラリをインストールしてください。
        * readline
        * rest-client
        * io/console


## APIリファレンス<br>
* [1.5.8 -](../apiref/1.5.8/000_Rest_API_Reference.html)
* [1.5.7](../apiref/1.5.7/000_Rest_API_Reference.html)
* [1.5.6](../apiref/1.5.6/000_Rest_API_Reference.html)
* [1.5.5](../apiref/1.5.5/000_Rest_API_Reference.html)
* [1.5.2 - 1.5.4](../apiref/1.5.2/000_Rest_API_Reference.html)
* [1.5.1](../apiref/1.5.1/000_Rest_API_Reference.html)
* [1.5.0](../apiref/1.5.0/000_Rest_API_Reference.html)
* [1.4.2 - 1.4.6](../apiref/1.4.6/000_Rest_API_Reference.html)
* [1.4.1以前](http://personium.io/docs/api/1.3.25/Japanese/Japanese.htm#docs/ja/HomePage.htm)

## 関連するリポジトリ<br>
* [app-myboard](https://github.com/personium/app-myboard)
* [app-sample-calorie-smile](https://github.com/personium/app-sample-calorie-smile)
* [personium-client-java](https://github.com/personium/personium-client-java)
* [js-client](https://github.com/personium/js-client)
* [template-app-cell](https://github.com/personium/template-app-cell)
