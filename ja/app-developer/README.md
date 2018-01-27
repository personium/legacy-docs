# アプリ開発者向けガイド

PersoniumのAPIを使用して、PDSアプリを開発したい人向けのドキュメントです

## Personium に接続可能なプログラムの多様性

Personium はRESTベースでデータを格納管理するAPI群を提供するオープンソースのサーバソフトウェアです。これをどのように使ってどのような価値をつくてゆくかはもちろんこれを使う開発者の自由です。Personiumを使ったアプリはどのような形態を取ることも可能です。

一方でPersoniumは個人をはじめとするデータ主体を中心としたコンピューティングを推進することを志向したソフトウェアです。そのようなコンピューティングを実現するためには、データストアサーバであるPersoniumだけでなく魅力的なアプリが豊富に存在することが必須条件となるでしょう。

一つのアプリだけで人間の活動すべてをサポートしてゆくというのは非現実的です。仕事、教育、移動、買い物、食事、ゲーム、医療、etc. 様々な分野に特化したプログラムが、時には机上のＰＣで、時にはスマートフォンで、時には車載の端末で、時にはデータセンタ内の仮想マシンで、生成されます。ユーザは様々なアプリを使いながら自身のデータをCellにためてゆくこととなります。この多様性をサポートできるよう、Personiumはデータストアとして極力色のないAPI構成を採用しました。

## Personium アプリ

多様性や自由は負の側面も持ちえます。例えばいくつかのアプリが認証連携もせず、それぞれパスワード入力を求めてきたらユーザは幸せでしょうか？ 立ち上げるたびにPDSのURLをいちいち聞いてくるアプリがあったときユーザはイライラしないでしょうか？ユーザが様々なアプリを快適に組み合わせてPDSに自身のデータを蓄積しそれを活用できる世界を実現するためには、アプリは何等かの制約に従った形態をとるべきでしょう。

1. 利用者がアプリを発見する手段が構築可能であること
1. 利用者がアプリ使用を検討するために情報を得る手段が提供可能であること
1. 誰が運用するPersoniumユニット上のCellに対しても動作可能であること
1. 利用者がいちいちCellのURLをいちいち入力しないでよいこと
1. 他のアプリとのシングルサインオンに対応していること

相互運用性を持ち、他アプリと共存共栄してエコシステムの中で、一定の流儀で記述されたアプリのことをPersoniumアプリと呼びます。

|用語|意味|
|:--|:--|
|Personium を使ったアプリ|Personium にアクセスを行う任意のアプリプログラム|
|Personium アプリ |上記のうち相互運用性・他アプリとの協調のため一定の流儀を守ったもの|

Personium アプリを開発するのはPersonium アプリではない、Personiumを使ったアプリを開発ことに加えていくつかの配慮が必要です。

## 技術情報

* [Personium アプリ開発](./Personium_Apps.md)  
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
