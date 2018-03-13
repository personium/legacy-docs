# Engine Script のサンプル

## 基本形

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```

## レスポンスのバリエーション

#### HTMLでのレスポンス

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/html"},
        body: ["<html><body><h2>Hello World !!</h2></body></html>"]
  };
}
```

#### JSONでのレスポンス

```
function(request) {
  var res = { 
    key: "helloWorld",
    message: "Hello World !!"
  }; 
  return {
        status: 200,
        headers: {"Content-Type":"application/json"},
        body: [JSON.stringify(res)]
  };
}
```

#### ステータスコードを変えてみる

403 Forbidden エラー応答

```
function(request) {
  return {
        status: 403,
        body: []
  };
}
```

### bodyのバリエーション

bodyとして文字列の配列を返すと、それらをつなげた応答となります。

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello", "World"]
  };
}
```


## リクエストの受取

#### メソッドに応じて処理を振り分ける

GETメソッド以外はエラーとする

```
function(request) {
  if (request.method !== 'GET') {
    return {
      status: 405,
      body: ['Method Not Allowed']
    };
  }
  return {
        status: 200,
        body: ["GET method is fine"]
  };
}
```

#### リクエストボディのパース

##### x-www-formurlencodedの場合

Personium Engineが提供しているユーティリティ関数を用いてパース可能です。

```
    var params = _p.util.queryParse(reqString);
```

##### JSONの場合

標準のJSONオブジェクトを使ってパースが可能です。

```
    var req = JSON.parse(reqString);
```
