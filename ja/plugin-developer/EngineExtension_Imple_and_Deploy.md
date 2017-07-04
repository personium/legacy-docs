# Engine Extensionの実装及び配備仕様
## JavaScript内から、Extension経由で利用可能なクラスの仕様

### 注意事項
* #### Extensionクラスの実装に際しては以下の点に留意すること。
	* Extensionクラスが動作するのは、personium-engine環境内である。
	* このため Extensionクラス内から標準出力、ファイル出力、ログ出力等を行った場合、personium-engine環境に副作用を及ぼすこととなる。
	* 以上の理由から、基本的には Extensionクラス内での上記操作は禁止する。
	* 開発・監視向けの最小限のログは許容されるべきと考えているが、それ以外の標準入出力、ファイル入出力等は原則行ってはならない。

### クラス設計・実装仕様
* #### クラス宣言
	* パッケージ名：任意、ただしログ出力との関係を考慮することを推奨する。
	* class名: Ext_{xxxxx}

	* ##### 以下のいずれか１つの継承関係を満たすこと。
		* ・`org.mozilla.javascript.ScriptableObject` を継承する
		* ・`org.mozilla.javascript.Scriptable` インタフェースを実装する
		* ・`io.personium.engine.extension.support.AbstractExtensionScriptableObject` を継承する

* #### コンストラクタ
	* ##### デフォルトコンストラクタ
		* Javaのデフォルトコンストラクタの定義が必要 (public)

	* ##### jsConstructor({引数}...)
		* JavaScript内で newされた場合に呼ばれるメソッド. 可視性は publicであること。

### メソッド
* ※ JavaScript内から呼び出されるメソッドは、public可視性を持つ必要がある。

* #### getClassName()
	* JavaScript内から見えるクラス名を返すように実装する。Javascript内では `_p.extension` スコープ内のクラスとして参照される。

* #### jsFunction_{メソッド名}
	* JavaScript内から呼び出されるメソッド の実装
	* __※ 同一メソッド名によるオーバーロードは行えない。コンパイルは可能だが、Rhinoによる javascript呼び出しでエラーとなる。__

* #### jsGet_{プロパティ名}
	* JavaScript内からのプロパティ値取得用のメソッド実装

* #### jsSet_{プロパティ名}
	* JavaScript内からのプロパティ値設定用のメソッド実装

* ※ Javascriptオブジェクトのプロパティアクセスを行う場合、jsGet_{プロパティ名}, jsSet_{プロパティ名} は必ずペアで定義すること。

* コンストラクタ、jsFunction, jsGet, jsSet等は、@JSConsturcutor, @JSFunction, @JSGetter, @JsSetter 等のアノテーション修飾を利用することが可能。

* #### 基底抽象クラス AbstractExtensionScriptableObject
	* Extensionクラスを作成する場合、org.mozilla.javascript.ScriptableObjectを継承、またはorg.mozilla.javascript.Scriptableインタフェースを実装する必要があるが、Personiumとしてio.personium.engine.extension.support.AbstractExtensionScriptableObject を提供している。
	* この抽象クラスを基底クラスとして継承することで、Extension用クラス内部で以下の機能を利用することができる。

	* ##### getLogger()メソッド
		* Personium-engineの環境設定に従い、Extensionクラス内からログを出力させることが可能となる。ログの出力カテゴリは、Extensionクラスのパッケージと同じとなる。
		* このため、personium-engine側の logback設定(現状: io.personium.engineに属するパッケージからのログ、INFOレベル以上のものが出力)を考慮した上で Extension用クラスのパッケージ名を決定することを推奨する。

	* #### getProperties()メソッド
		* Extensionクラスが利用するプロパティファイルを自動読み込みし、その内容を利用することが可能となる。

### 実装サンプル
* #### アノテーションを利用しない場合
* ```
package io.personium.engine.extension.sampleproject;
import io.personium.engine.extension.support.AbstractExtensionScriptableObject;
public class Ext_Sample extends AbstractExtensionScriptableObject {
		private int count;
		public Ext_Sample() {
			count = 0;
		}
		public void jsConstructor() {
			// Propertyファイルの内容取得
			//   読み込むプロパティファイルは、Ext_{javaScriptに公開するクラス名}.properties
			String message = getProperties().get("initialMessage");
			// メッセージのログ出力
			getLogger().info(message);
			count = 0;
		}
		public String getClassName() {
			return "Sample";
		}
		public int jsFunction_add(int delta) {
			count += delta;
			// メッセージのログ出力
			getLogger().debug(String.format("Value %d is added.", delta));
			return count;
		}
		public int jsGet_count() {
			return count;
		}
		public void jsSet_count(int val) {
			count = val;
		}
}
```

* #### アノテーションを利用する場合
* ```
package io.personium.engine.extension.sampleproject;
import io.personium.engine.extension.support.AbstractExtensionScriptableObject;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGet;
import org.mozilla.javascript.annotations.JSSet;
public class Ext_Sample extends AbstractExtensionScriptableObject {
		private int count;
		@JSConstructor
		public Ext_Sample() {
			// Propertyファイルの内容取得
			//   読み込むプロパティファイルは、Ext_{javaScriptに公開するクラス名}.properties
			String message = getProperties().get("initialMessage");
			// メッセージのログ出力
			getLogger().info(message);
			count = 0;
		}
		public String getClassName() {
			return "Sample";
		}
		@JSFunction
		public int add(int delta) {
			count += delta;
			// メッセージのログ出力
			getLogger().debug(String.format("Value %d is added.", delta));
			return count;
		}
		@JSGetter
		public int count() {
			return count;
		}
		@JSSetter
		public void count(int val) {
			count = val;
		}
}
```

* #### クラスの入出力(関数引数、復帰値、例外)の制約
	* ##### 関数引数
		* JavaScriptから渡されるプリミティブ、オブジェクトは、Javaの Auto-Boxing機能により
対応可能なJava型を持つ引数に受けることができる。<br/>
		* ※ 実際にはJavaScript内のプリミティブ、オブジェクトは以下の型で、Javaクラスに渡される。
Javaの Auto-Boxing機能により、int/double/java.lang.String等の適切な型に変換されて引数に渡される。

|                       |JavaScript層での型|              |Java層での型|
|:----|:---|:---|:---|
|                          |typoeof     |instanceof          |java|
|JavaでLongオブジェクト    |number      |×                  |java.lang.Long|
|Javaでlongプリミティブ    |number      |×                  |java.lang.Long|
|JavaでString              |string      |×                  |java.lang.String|
|JSでNumberプリミティブ    |number      |×                  |java.lang.Double|
|JSでNumberオブジェクト    |object      |Number              |org.mozilla.javascript.NativeNumber|
|JSでStringプリミティブ    |string      |×                  |java.lang.String|
|JSでStringオブジェクト    |object      |String              |org.mozilla.javascript.NativeString|

* #### 復帰値
	* Javaから以下の復帰値を返すと、JavaScript内の対応オブジェクトに自動変換されて返る。

		* Booleanオブジェクト → Boolean
		* java.lang.Numberオブジェクト → Number
		* Characterオブジェクト、Stringオブジェクト → String
		* null → null

	* ##### その他返却可能なクラスオブジェクト
		* InputStream → PersoniumInputStream に変換されて返却
		* NativeObject → PersoniumJSONObject に変換されて返却
		* ArrayList<?>  → NativeArrayに変換されて返却

	* ※ 上記以外は、ClassShutterが返却拒否を行うため返却できない仕様としている。

	* ##### 例外
		* Javaクラスから例外をスローさせる場合には、ExtensionErrorConstructorクラスのconstructメソッドを使用して例外オブジェクトを作成し、スローすること。

		* ```
throw ExtensionErrorConstructor.construct(message);
```

		* __Extensionの Javaクラスから発せられた例外は、JavaScriptに対し以下の型に変換されて返される。__

			* ##### JavaScriptの Errorオブジェクト
				* プロパティ: name, message


## パッケージング、配備方法
### パッケージング

* #### Extension機能は以下の Artifactから構成される。

	* ##### jarファイル
		* Extension用 Javaクラスおよび依存クラスファイルを含む jarファイル
		* 1つの jarファイルに複数の Extension用クラスが含まれる場合もある。

	* ##### (optional) Extensionクラス用プロパティファイル
		* io.personium.engine.extension.support.AbstractExtensionScriptableObjectを継承した Extension用 Javaクラスが利用するプロパティファイル。利用しない場合は作成する必要はない。
		* jarファイルの場合と異なり、プロパティファイルは Extension用 Javaクラス毎に作成する。

### jarファイル

* #### Extension用の Javaクラス及び関連クラスは、jarファイルにパッケージングする。<br>一つの jarファイルに複数の Extension用クラスをパッケージングしても構わない。

	* ##### 以下に留意すること
		* Extensionは personium-engineアプリケーション上で動作するため、personium-engineのクラスローダがロード可能なクラスはパッケージングする必要はない。

		* > V1.3.20時点では親クラスローダ(personium-engine)側でロードされたクラスが優先されるため、特に問題は発生しない。<br>しかし将来的な計画として Extensionの jar側に任意バージョンのライブラリを同梱することでそちらを優先使用するクラスローダに変更する可能性がある。<br>このため本留意事項については「personium-engineのクラスローダがロード可能なクラスはパッケージングしてはならない。」と解釈しておくことを推奨する。

		* 上記のためには、pom.xml の dependencyモジュールの scopeタグ内の記述を "provided" とすることで、Mavenビルドは可能だが jarには含まない設定とすることができる。
		* personium-engineのクラスローダが Extension用のクラスローダの親となる。<br>このため personium-engine側のクラスローダと Extension用の jarの両方に同じクラスが存在する場合、personium-engine側のクラスが利用される。
		* 当然のことだが personium-engine と Extension用のjarのどちらにも存在しないクラスを参照した場合、ClassNotFoundException または NoClassDefFoundErrorが発生する。

### プロパティファイル

* プロパティファイル名は次の命名規約に従って作成する: Ext_{javaScriptに公開するクラス名}.properties
* プロパティファイルの内容・書式は任意。日本語等マルチバイト文字を含む場合、ISO 8859_1 でエンコーディングする必要がある。
* このプロパティファイルが存在する場合、io.personium.engine.extension.support.AbstractExtensionScriptableObjectを継承した Extension用 Javaクラスは自動的にプロパティファイルの読み込みを行う。

### 配備

* Extension用の jarファイルは Engineが動作している Webコンテナのシステムプロパティ"io.personium.environment" で設定されているディレクトリ配下の personium-engine/extensionsに配備する。
* 上記システムプロパティの指定がない場合、次のディレクトリに配備された jarファイルを読み込む。: /personium/personium-engine/extensions

* ##### プロパティファイル
	* Extension用クラスで利用する各種の設定はプロパティファイルに記述することができる。(注)
	* 上記 jarと同じディレクトリに、次の命名規約でプロパティファイルを作成・配備する。
	* Ext_{javaScriptに公開するクラス名}.properties

	* (注) io.personium.engine.extension.support.AbstractExtensionScriptableObject を継承した場合

## UserScript内での呼び出し方法

* Extension用クラスは、\_p.extensionスコープ内のオブジェクトとして参照可能
* 上記で定義されたメソッド、プロパティにアクセスすることができる。

### JavaScript内での Extension利用例

```
/**
	Extensionの Sampleクラス(Java実装は Ext_Sampleクラス)メソッド呼び出し
*/
function (request) {
	var extension = new _p.extension.Sample();
	try {
		extension.count = 100;
		extension.add(100);
		var sum = extension.count;
		return {
			status: 200,
			headers: {"Content-Type":"text/plain"},
			body: ["Sum is " + sum]
		};
	} catch (e) {
		return {
			status: 500,
			headers: {"Content-Type":"text/plain"},
			body: [e.message]
		};
	}
}

```
