# Engine Script のサンプル

## 基本形

Engine Script は一つのJavaScript関数として記述します。この関数はリクエストを引数として受け取り、戻り値として返すオブジェクトがレスポンスに使われます。

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```

## リクエストの受取

リクエストは関数の引数で与えられます。以下では関数の引数を request と記述したときに、リクエストに関する各種情報をどのように取得するかサンプル提示しながら説明します。

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

#### リクエストボディのパース

リクエストボディが文字列であり、サイズが比較的小さいときは以下のようにすべて文字列として読み取ってしまうのが便利です。

```
    var reqString = request.input.readAll();
```

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

#### リクエストボディがバイナリである場合

リクエストボディがバイナリである場合はストリームのまま処理するのがよいでしょう。

```
    var stream = request.input;
```

取得したストリームをファイルに書き出したり、応答で使ったりといったことが可能です。


## レスポンスの返却

### レスポンスのバリエーション

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

以下の例では入力されたリクエストボディをそのままレスポンスボディとして返します。

```
function(request) {
    var stream = request.input;
    return {
        status: 200,
        body: [stream]
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

## Personium のAPI呼出処理

Engine Script 内では _pというグローバルオブジェクトを介してPersoniumの様々なAPIを呼び出し可能です。

### ファイルの操作

#### 取得

以下の例ではクライアントから受け取ったアクセストークンをそのまま使ってアクセスし、
このScriptが走行するBoxの ルートにあるconf.jsonというファイルを文字列として取得。
ファイル内容をパースして、modeというキーの値を返しています。

```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  var jsonStr = thisBox.getString('conf.json');

  var conf = JSON.parse(jsonStr);
  return {
        status: 204,
        headers: { 'Content-Type' : 'text/plain'},
        body: [conf.mode]
  };
}
```

このScriptが走行するBox内の /img/picture.jpgというファイルに対して クライアントから受け取ったアクセストークンをそのまま使ってアクセスし、取得できた内容をレスポンスボディとして返しています。

```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  var pictureStream = thisBox.col('img').getStream('picture.jpg');
  return {
        status: 200,
        headers: {"Content-Type":"image/jpeg"},
        body: [pictureStream]
  };
}
```

#### ファイル作成・上書き更新

```
function(request) {
  var content = request.input.readAll();
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  var pictureStream = thisBox.put('conf.json', 'application/json', content);
  return {
        status: 201,
        body: [content]
  };
}
```

#### ファイル削除

```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  var pictureStream = thisBox.col('img').del('picture.jpg');
  return {
        status: 204,
        body: []
  };
}
```


#### 衝突検知でファイル更新

If-Matchヘッダで送信されたetag情報が合致するときのみファイル更新

```
function(request) {
  var etag = request.headers['If-Match'];
  var content = request.input.readAll();
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  try {
    var pictureStream = thisBox.put('conf.json', 'application/json', content, etag);
  } catch (e) {
    return {
        status: 409,
        body: ["conflict"]
    };  
  }
  return {
        status: 204,
        body: []
  };
}
```


### コレクションの操作

#### WebDAVコレクション作成

コレクションはWebDAVにおいてディレクトリに相当する用語です。

```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  thisBox.mkCol('folder1');
  return {
        status: 201,
        body: []
  };
}
```

#### OData Service Collection 作成

```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  thisBox.mkOData('odata');
  return {
        status: 201,
        body: []
  };
}
```


#### Engine Service Collection 作成

```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  thisBox.mkService('svc');
  return {
        status: 201,
        body: []
  };
}
```


### OData Service Collectionの操作

#### Entityの作成

テーブルにデータを１件追加します
```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  var entitySet = thisBox.odata('odata').entitySet('items')
  var item = entitySet.create({Name: 'Chocolate', Price: 2.7});
  return {
        status: 200,
        body: [JSON.stringify(item)]
  };
}
```

#### Entityの取得

テーブルのデータを１件取得します
```
function(request) {
  var thisBox = _p.localbox();
// Ver. 1.6.5 以下のユーザは上記のかわりに以下のように書いてください。
// var thisBox = _p.as('client').cell().box();
  var item = thisBox.odata('odata').entitySet('items').retrieve('key1');
  return {
        status: 200,
        body: [JSON.stringify(item)]
  };
}
```

