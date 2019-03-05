# アプリ開発者向けガイド

Personium に接続するプログラムを開発する方向けのガイドです。

## Personium に接続するプログラムの多様性と自由
Personiumは個人をはじめとするデータ主体を中心としたコンピューティングを推進することを志向したソフトウェアです。そのようなコンピューティングを実現するためには、データストアサーバであるPersoniumだけでなく魅力的なアプリが豊富に存在することが必須条件です。
一つのアプリだけで人間の活動すべてをサポートしてゆくというのは非現実的です。仕事、教育、移動、買い物、食事、ゲーム、医療、etc. 様々な分野に特化したプログラムが、時には机上のＰＣで、時にはスマートフォンで、時には車載の端末で、時にはデータセンタ内の仮想マシンで動作し、そこでユーザのデータは生成されます。

これら多様なプログラムからどんなデータでも受け取れるよう、 Personium はHTTPという汎用的なプロトコルで外部とやり取りを行い、データストアとしても極力色のないAPI構成を採用しています。結果としてPersonium は様々な用途に利用可能なサーバソフトウェアとなっています。Personium はRESTベースでデータを格納管理するAPI群を提供するオープンソースのBaaSソフトウェアととらえることもできます。Personium をどのように使ってどのような価値をつくってゆくかはもちろんこれを使う開発者の自由です。「Personiumを使ったアプリ」はどのような形態を取ることも可能です。

## 他者と共存共栄しエコシステムを構築できるアプリ
一方で、データ主体を中心としたコンピューティングを推進することを考えたとき、多様性や自由は負の側面も持ちえます。例えばいくつかのアプリが認証連携もせず、それぞれパスワード入力を求めてきたらユーザは幸せでしょうか？ 立ち上げるたびにPDSのURLをいちいち聞いてくるアプリがあったときユーザはイライラしないでしょうか？ユーザが様々なアプリを組み合わせてPDSに自身のデータを蓄積し、快適にそれを活用できる世界を実現するためには、アプリは何等かの制約に従った形態をとるべきでしょう。

1. 利用者がアプリを発見する手段が構築可能であること
1. 利用者がアプリ使用を検討するために情報を得る手段が提供可能であること
1. 様々なPersoniumユニット上のCellに対しても動作可能な相互運用性を持つこと
1. 利用者がいちいちCellのURLをいちいち入力しないでよいこと
1. 他のアプリとのシングルサインオンに対応していること

他アプリと共存共栄するエコシステム形成を意識し、これらの条件を満たせるよう一定の流儀で記述されたアプリのことをPersoniumアプリと呼びます。

## 「Personium アプリ」と「Personium を使ったアプリ」

前述の2つの方向性はいわば「他アプリを意識しない独立したモノづくり」と「他アプリを含めたエコシステム全体を考慮したモノづくり」ということで相容れない大きな方向性の違いです。

|用語|意味|
|:--|:--|
|Personium を使ったアプリ|Personium にアクセスを行う任意のアプリプログラム|
|Personium アプリ |上記のうち相互運用性・他アプリとの協調のため一定の流儀を守ったもの|

まとめると上記のようになりますが、どちらの立場をとるのかを明確にして取り組む必要があります。


## Personiumに接続するアプリの開発

「Personium アプリ」を開発するためには、他のアプリとの共存をはじめとする追加配慮が必要であるため、
学習にあたってはまずは非Personiumアプリから始めるのが容易です。

まず一つのCellの中の一つのBoxを使って、そこにデータを書いたり読んだりすることに取り組んでみましょう。

### [OData,WebDAVの体験](https://baas-demo.demo.personium.io/1/index.html)

まずこのデモでODataとWebDAVの概要をつかんでおくと後が楽になります。

### [Box内でODataを使う](./using_odata.md)


## Personiumアプリ開発

* [Personium アプリ開発](./Personium_Apps.md)  
* [クライアント登録&認証](../user_guide/004_Client_auth.md)
* [アプリ認証](./app_authn.md)
* [Personiumにおけるロール](./Roles.md)
* [Homeアプリからの起動](./launch_from_homeapp.md)
* [Personium Engine](./Personium-Engine.md)

## サンプルアプリ

Webブラウザ向けのAjaxアプリとしてのサンプルアプリがいくつか公開されています。

* [app-myboard](https://github.com/personium/app-myboard)
* [app-sample-calorie-smile](https://github.com/personium/app-sample-calorie-smile)

また、Webブラウザ向けのAjaxアプリを作る際の土台となるプロジェクトテンプレートも公開してます。

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



## 関連するリポジトリ

* [app-myboard](https://github.com/personium/app-myboard)
* [app-sample-calorie-smile](https://github.com/personium/app-sample-calorie-smile)
* [personium-client-java](https://github.com/personium/personium-client-java)
* [js-client](https://github.com/personium/js-client)
* [template-app-cell](https://github.com/personium/template-app-cell)
