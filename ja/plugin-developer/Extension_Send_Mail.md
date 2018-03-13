# Extension: メール送信機能
## メール送信機能仕様

Engine Script内から本Extensionの設定パラメタとして設定されたSMTPサーバを経由してメール送信を行うことを可能とする Extension です。
Engine Scriptに対しては、\_p.extensionスコープの MailSenderクラスとして公開されます。

### 送信されるメールの仕様

Extensionのメール送信機能では、以下の内容に従いメールサーバに対しメール送信リクエストを送信します。

|ヘッダ名|内容|要件|
|:---|:---|:---|
|To/Cc/Bcc|宛先のメールアドレス|複数指定が可能<br>表示名を付与可能<br>表示名はBase64エンコードに変換される|
|From|送信元メールアドレス|１件のみの指定が可能<br>表示名を付与可能<br>表示名はBase64エンコードに変換される|
|Return-Path|送信エラー時の通知先|１件のみの指定が可能|
|Content-Type|本文の形式|『Content-Type: text/plain; charset="ISO-2022-JP"』デフォルト|
|Content-Transfer-Encoding|本文のエンコード形式|『Content-Transfer-Encoding: quoted-printable』デフォルト|
|Subject|件名|件名はBase64エンコードに変換される|
|Date|送信日時|送信時に自動で付与される|
|ヘッダ無し|本文|本文を指定する<br>上記 Content-Type, Content-Transfer-Encodingの内容に従い送信される|

### 機能制限

本メール送信機能においては、以下はサポートしていません。

* ファイルの添付
* text/plain以外のメール本文形式

※ 注意事項

* 巨大なメールやメールの多数送信は、しないようにアプリケーション側で考慮すること。

※ その他 RFC5322に準拠しない内容についての動作は保証しません。

### Engine Script内での呼び出し形式

Engine Script内からメール送信機能を利用する場合に指定する JSONの形式は以下の通り

|キー|型|制限|内容|必須/省略可|省略時の既定値|
|:---|:---|:---|:---|:---|:---|
|to|Array|※1|宛先のリスト|省略可能|<br>|
|to.address|String|<br>|宛先のアドレス|必須|<br>|
|to.name|String|<br>|宛先の表示名|省略可能|-|
|cc|Array|※1|cc宛先のリスト|省略可能|-|
|cc.address|String|<br>|cc宛先のアドレス|必須|<br>|
|cc.name|String|<br>|cc宛先の表示名|省略可能|-|
|bcc|Array|※1|bcc宛先のリスト|省略可能|-|
|bcc.address|String|<br>|bcc宛先のアドレス|必須|<br>|
|bcc.name|String|<br>|bcc宛先の表示名|省略可能|-|
|from|Object|<br>|送信元|必須|<br>|
|from.address|String|<br>|送信元のアドレス|必須|<br>|
|from.name|String|<br>|送信元の表示名|省略可能|-|
|reply-to|Array|※2|返信先のリスト|必須|<br>|
|reply-to.address|String|<br>|返信先のアドレス|必須|<br>|
|reply-to.name|String|<br>|返信先の表示名|省略可能|-|
|subject|String|<br>|件名|必須|<br>|
|text|String|<br>|メール本文|必須|<br>|
|charset|String|<br>|メール送信時の本文の文字コード|省略可能|ISO-2022-JP|
|envelope-from|String|<br>|返信アドレス(Return-Pathを明示的に指定する場合に指定)|省略可能|-|
|headers|Map|<br>|任意のオプションヘッダ|省略可能|-|
|headers.{key}|String|<br>|ヘッダのキー|必須|<br>|
|headers.{value}|String|<br>|ヘッダの値|必須|<br>|

※1 to, cc, bcc に指定可能なアドレスは、合計 50件に制限する。かつ最低 1件は指定されなくてはならない。
※2 reply-to に指定可能なアドレスは、最大 50件に制限する。

### リトライ処理

メール送信ができなかった場合、Extension内ではリトライは行わない。


### エラー通知

メール送信時に発生したエラーは、UserScriptに対し JavaScriptの Errorオブジェクトの形で投げられる。

#### 呼び出しサンプル

```
/**
  Mail送信 Extension呼出し例
*/
function (request) {

    var req = {
        "to" : [
            { "address" : "hoge1@example.com", "name" : "田中一郎" },
            { "address" : "hoge2@example.com", "name" : "田中二郎" }
        ],
        "cc" : [
            { "address" : "hoge3@example.com", "name" : "田中三郎" }
        ],
        "bcc" : [
            { "address" : "hoge4@example.com", "name" : "田中四郎" }
        ],
        "from" : { "address" : "hoge5@example.com", "name" : "田中五郎" },
        "reply-to" : [
            { "address" : "hoge6@example.com", "name" : "田中六郎" }
        ],
        "subject" : "タイトル",
        "text" : "メール本文の内容",
        "charset" : "ISO-2022-JP",
        "envelope-from" : "hoge7@example.com",
        "headers" : { "Organization" : "personium" }
    };

    var sender = new _p.extension.MailSender();
    try {
        sender.send( req );
    } catch (e) {
        alert(e.message);
    }
}
```
