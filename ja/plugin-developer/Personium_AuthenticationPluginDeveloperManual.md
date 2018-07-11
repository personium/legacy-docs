# Personium認証Plugin開発ガイド

この文書はPersonium認証Pluginの開発マニュアルです。

## この文書について

Personiumの認証Pluginを開発する上で必要となる情報を記述しています。  
認証Pluginの詳細は[認証Pluginのセットアップ](../server-operator/setup_authentication_plugins.md)をご参照ください。  
このドキュメントでは、認証Pluginの作成手順を説明します。  

## 開発の方法

具体的にはPluginでは以下の3点を定義します。  

1. どのようなアカウントType値に対応すべきなのか
1. どのようなgrant_type値に対応すべきなのか
1. トークンエンドポイントのgrant_type以外の入力パラメタ値をどのように評価して、結果としてどのような主体として認識すべきなのか

即ちPlugin作者は、上記3点の情報を具体的なJavaコードとして実装します。
Personiumでは認証Pluginが上記3の応答として返却した認証済み識別主体情報(AuthenticatedIdentityオブジェクト）を以下の観点でさらに評価して、
トークン発行の可否判断や、発行トークンの内容決定、トークン発行処理を行います。

- getAccountName() で取得できる文字列をName属性にもつAccountが存在するか
- 存在する場合、ヒットしたAccountのtype値に上記1の文字列が含まれているか

## セキュリティ上の配慮

当然のことながら、Plugin作者は上記2の「パラメタ値評価」においては一般的にアクセス主体が適切な認証プロセスを経るように実装を行う必要があります。
例えば、入力値を一切チェックせずに本来保護されるべき特定の主体（ゲスト等でない実在の人物など）
として認識してしまうようなPluginを作成し、これをユニットに配置してしまうことは重大なセキュリティ問題を引き起こします。
従ってPlugin作者はセキュアな実装を行うこと、Plugin利用者（ユニット管理者）はセキュアであると信じられるPluginのみを用いることが必要です。

---

以下、google版の認証Pluginを例に説明します。

## Pluginのクラス構造

作成Pluginの枠線部分が作成の対象です。

認証Pluginのクラス構造図を以下に示します。
![クラス構造図](./images/plugin_02.png "Pluginクラス構造図")

> **注意:**  認証処理の戻り値
> - 認証に成功した場合は、AuthenticatedIdentityが返却されます。
> - 認証に失敗した場合は、PluginExceptionまたはnullが返却されます。

## Pluginの動作

認証Pluginの動作を以下に示します。

![Pluginの動作](./images/plugin_01.png "pluginの動作")

　1. Plugin初期化処理
　    PersoniumCoreApplicationクラスでPluginManagerが呼出され、すべてのPluginを読み込みます。

　2. 認証プロセスの呼び出し
　   TokenEndPointResourceクラスで対象のGrantTypeのPluginを選択します。
　   選択したPluginのauthenticateメソッドを実行します。

> **注意:**
> - PersoniumPluginは、pluginsフォルダに配置するだけで実行可能です。
> - 認証Pluginは、Typeに”auth”とGrantTypeに各プロバイダを指定し、authenticateメソッドを記述することで、対象のpluginが選択されauthenticateメソッドが実行されます。

### 1.Plugin初期化処理
#### <i class="icon-file"></i> [PersoniumCoreApplication.java](https://github.com/personium/personium-core/blob/master/src/main/java/io/personium/core/rs/PersoniumCoreApplication.java)  
pm = new PluginManager();  
PluginManagerクラスを生成します。  

### 2.認証プロセスの呼び出し
#### <i class="icon-file"></i> [TokenEndPointResource.java](https://github.com/personium/personium-core/blob/master/src/main/java/io/personium/core/rs/cell/TokenEndPointResource.java)  
callAuthPlugins()メソッドで認証プロセスを呼び出しています。  

---
## サンプル実装

- [personium-plugin-sample](https://github.com/personium/personium-plugin-sample)

最低限実装すべきメソッドは以下です。
- getType()
  - PluginのTypeを返す。現状は"auth"のみ。
- getGrantType()
  - 対応するgrant_type値を返す。
- getAccountType()
  - 対応するAccountのType値を返す。
- authenticate()
  - 認証処理。

## Pluginの作成手順

[認証Pluginのセットアップ](../server-operator/setup_authentication_plugins.md)をご参照ください。  
