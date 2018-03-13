# Personium Engine
## 概要

Personium Engine は、簡単なサーバサイドロジック（Engine Script）を登録しこれを走行させるための仕組みです。
EngineへのアクセスはBox内に作成した Engine Service Collection (ESC)を介して行います。

1. ESC内に Engine Script ファイル配置
1. ESCへのPROPPATCHメソッド発行でルーティング設定（どのパスでどのロジックを走行させるかという設定）を実施
1. ESCや親ディレクトリへのACLメソッド発行でexec権限を付与

上記3ステップの準備をすることで、指定パスの呼出でサーバサイドロジックが走行するようになります。

多くの場合 Engine Script はアプリ開発者がbarファイルの中に含めて配布を行い、セルのオーナが box インストールを行うことで実行可能となります。またセルのオーナはアプリを操作する中でそれがどれだけUnitに負荷をかけるのかをイメージすることなくアプリを操作しますし、そういった操作を契機にEngine Scriptは実行されることとなります。

そのため EngineはUnit に過度な負荷をかけたり、Unit を内部から攻撃するようなコードが記述できないようなサンドボックス環境として設計されています。

一方で、その制約がきつすぎる場合には行えることが限定的になりすぎることもあるため、
ユニットの管理者が設定をすれば機能拡張を行えるような枠組みとして Engine Extension を用意しています。


## Engine Service Collection (ESC)

ESC (Engine Service Collection) はBox内WebDAV空間の任意の場所に作成できる特殊Collectionで以下二つの役割を持っています。

* Engine Scriptの格納・管理
* 実行のためのエンドポイント提供

Engine Scriptの格納・管理は、ESC内に自動で作られるScript Source Collectionが担います。
またESCへのWebDAV PROPPATCH操作で p:service という要素を設定することで、配下のどのようなパスに対するリクエストに対してどの Engine Scriptが処理を受け持つべきかといったいわゆる処理の routing 設定を行うことができます。これによりESC配下の任意のパスに処理実行のためのエンドポイントを作成することができます。


### ESCの作成・設定・削除

ESCの作成はMKCOLメソッドを使って行います。作成したESCパスへのDELETEメソッド発行でESCの削除が可能です。

* [ESCの作成](../apiref/current/381_Create_Service_Collection_Source.html)
* [ESCの削除](../apiref/current/383_Delete_Service_Collection_Source.html)

また、ESCはMOVEメソッドでのリネームや移動が可能です。ACLメソッドを使ってのアクセス権設定においては、exec権限の付与が重要となります。


### Engine Scriptの格納・管理

ESCを作成すると内部に自動的に__src/ というソース格納用のCollectionディレクトリが作成されます。これをScript Source Collectionと呼んでいます。ここにJavaScriptで記述したEngine Scriptを格納します。このディレクトリには子ディレクトリを作成することはできずMOVEやDELETEができませんが、それらの点をのぞき通常のWebDAV Collectionと同じであり、WebDAV操作によってEngine Scriptの登録・削除・更新を行います。

### 実行エンドポイントの設定

ESCにPROPPATCHメソッドを発行しプロパティを設定することによりロジック実行エンドポイントを設定できます。

* [ESCの実行設定](../apiref/current/380_Configure_Service_Collection.html)


## Engine Script

Engine ScriptはESCの中に登録する以下のようなスクリプトです。現在JavaScriptのみをサポートしています。

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```

Engine ScriptはJSGI仕様に従った関数として定義します。

* [Engine Scriptのサンプル](./671_Engine_Script_Samples.md)



関数内では一般的なJavaScriptロジック記述に加えて、PersoniumのAPI呼出を行うための関数群であるPersonium Engine Library をはじめとするいくつかのグローバルオブジェクトが使用可能です。



### 使用可能なグローバルオブジェクト

* JSON
* String



## Engine Library

Engine LibrayはEngine Scriptの中で使うことのできるライブラリで_pというグローバルオブジェクトからアクセスします。自Cellの自Boxはもちろん、他Cellや他Boxへのアクセスもアクセスが許されていれば可能です。


```
function(request) {
  var thisBox = _p.as('client').cell().box();
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```



## Engine Extension

Engine ExtensionはEngine Libraryの機能を拡張するための機構です。具体的にはJava言語で特定の方法で書かれたクラスを含んだjarファイルを
ユニットに設定することにより、 Engine Script内で _p.extension. パッケージ以下に新たな機能を提供するオブジェクトが現れ、利用可能となります。

Engine Extension は、概要で記載のとおりサンドボックス環境として設計されているengineの制約を緩和するための機構です。
そのため Engine Extensionの導入はユニット管理者でないと行うことができません。

### 様々な Engine Extension

* [メール送信](../plugin-developer/Extension_Send_Mail.md)
* [HTTPクライアント](https://github.com/personium/personium-ex-httpclient)

### Engine Extension の開発

Engine Extensionを開発したい方は、[プラグイン開発者向けガイド](../plugin-developer/)をご覧ください。
