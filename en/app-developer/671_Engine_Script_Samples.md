# Engine Script Samples

## Basic Form

Engine Script is a JavaScript function that receives request as a parameter and returns response.

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```

## Receiving Request

リクエストは関数の引数で与えられます。以下では関数の引数を request と記述したときに、
リクエストに関する各種情報をどのように取得するかサンプル提示しながら説明します。

### Request Method

HTTP Method can be retrieved from "request.method"

#### only accepting GET method

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

### Request Header

request.headers gives request headers

#### returning a specific request header value

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

### Request Body

Request body can be accessed with the following property.

```
  request.input
```


#### Parsing request body

When the request body is a relatively small character sequence, just read all the stream as a string.

```
    var reqString = request.input.readAll();
```

##### x-www-formurlencoded content type

can be parsed using a utility function provided by Personium Engine

```
    var params = _p.util.queryParse(reqString);
```

##### JSON content type

can be parsed using standard JSON object.

```
    var req = JSON.parse(reqString);
```

#### binary body

リクエストボディがバイナリである場合はストリームのまま処理するのがよいでしょう。

```
    var stream = request.input;
```

取得したストリームをファイルに書き出したり、応答で使ったりといったことが可能です。


## Returning Response

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

#### JSON Response 

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

## Calling Personium API

In Engine Scripts, Personium API's can be accessed via a global object named _p.

### File manipulation

#### Retrieval

以下の例ではクライアントから受け取ったアクセストークンをそのまま使ってアクセスし、
このScriptが走行するBoxの ルートにあるconf.jsonというファイルを文字列として取得。
ファイル内容をパースして、modeというキーの値を返しています。

```
function(request) {
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
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
  var thisBox = _p.as('client').cell().box();
  var item = thisBox.odata('odata').entitySet('items').retrieve('key1');
  return {
        status: 200,
        body: [JSON.stringify(item)]
  };
}
```
