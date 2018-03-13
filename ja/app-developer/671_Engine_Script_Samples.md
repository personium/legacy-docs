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

bodyとして返す配列要素はinputStreamを取ることができます。

```
function(request) {
  var is = .... (ファイル取得など)
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: [is]
  };
}
```

bodyとして返すオブジェクトはforEachメソッドが実装されていることが要件ですので、以下のようなオブジェクトで返すことも可能です。

```
function(request) {
  var bodyObj = {
     min: 0,
     max: 2000,
     forEach: function(f) {
       var i = min;
       while (i < max) {
          f(i + ",");
          i++;
       }
     }
  };
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: bodyObj
  };
}
```



## リクエストの受取

### リクエストメソッド

request.method　でメソッドが取得できます。

#### GETメソッド以外はエラーとする

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

### リクエストヘッダ

request.headers　でリクエストヘッダが取得できます。

#### 特定リクエストヘッダの値を返す

```
function(request) {
  var headerVal = request.headers['X-Some-Header'];
  if (!headerVal) {
    return {
      status: 400,
      body: ['X-Some-Header required']
    };
  }
  return {
        status: 200,
        body: ["X-Some-Header value = " + headerVal]
  };
}
```

### リクエストボディ

request.input　でリクエストボディにストリームとしてアクセス可能です。

```
    var reqString = request.input.readAll();
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
