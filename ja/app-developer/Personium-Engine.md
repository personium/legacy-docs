# Personium Engine
## Overview

Personium Engine は、簡単なサーバサイドロジック（Engine Script）を登録しこれを走行させるための仕組みです。ロジック記述言語としては現在のところJavaScriptのみをサポートしています。EngineへのアクセスはBox内に作成した Engine Service Collection (ESC)を介して行います。

1. ESC内に Engine Script ファイル配置
1. ESCへのPROPPATCHメソッド発行でルーティング設定（どのパスでどのロジックを走行させるかという設定）を実施
1. ESCや親ディレクトリへのACLメソッド発行でexec権限を付与

上記3ステップの準備をすることで、指定パスの呼出でサーバサイドロジックが走行するようになります。

Engine Script はJSGI仕様に従ったJava Scriptの関数として定義します。関数内では一般的なJavaScriptロジック記述に加えて、PersoniumのAPI呼出を行うための関数群であるEngine Library をはじめとするいくつかのグローバルオブジェクトが使用可能です。

ユニットの管理者はEngine Extensionをユニットに設定することでEngine Libraryを拡張することもできます。具体的にはJava言語で特定の方法で書かれたロジックをjarファイルとしてユニットに設定することで、Engine Library内に新たなJavaScriptクラスを定義して使用可能とすることができます。

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

Engine ScriptはESCの中に登録するスクリプトです。現在JavaScriptのみをサポートしています。Engine ScriptはJSGI仕様に従った関数として定義します。関数内では一般的なJavaScriptロジック記述に加えて、PersoniumのAPI呼出を行うための関数群であるPersonium Engine Library をはじめとするいくつかのグローバルオブジェクトが使用可能です。

##### Sample

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```


### 使用可能なグローバルオブジェクト

* JSON
* String

等


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

Engine ExtensionはEngine Libraryを拡張するための機構です。指定の方法で定義されたJavaクラスをユニットに設定することでEngine Libraryの機能不足を補うことができます。Engine Extensionの導入はユニット管理者でないと行うことができません。
