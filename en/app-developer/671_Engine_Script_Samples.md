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

Requests are given as function arguments. In the following, when the function argument is described as request,
I will explain how to obtain various information on request while presenting sample.

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

If the request body is binary, it is a good idea to process the stream as it is.

```
    var stream = request.input;
```

It is possible to write the acquired stream to a file or use it in response.


## Returning Response

### Response variations


#### Response in HTML

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

#### Changing the status code

403 Forbidden Error response

```
function(request) {
  return {
        status: 403,
        body: []
  };
}
```

### Variation of body


If you return an array of strings as body, it will be a response connecting them.

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello", "World"]
  };
}
```

The array element returned as body can take an inputStream.

```
function(request) {
  var is = .... (File acquisition etc)

  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: [is]
  };
}
```

In the following example, the input request body is returned as it is as a response body.

```
function(request) {
    var stream = request.input;
    return {
        status: 200,
        body: [stream]
    };    
}
```

The object to be returned as body must implement the forEach method, therefore, it is possible to return it with the following object.

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

In the following example, the access token received from the client is accessed as it is, and a file called conf.json in the root of the Box where this script runs is acquired as a character string.
I parse the file contents and return the value of the mode key.


```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
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

I access the file /img/picture.jpg in the Box where this script runs using the access token received from the client as it is.
I got the contents that I got there so that it is returned as a response body.

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  var pictureStream = thisBox.col('img').getStream('picture.jpg');
  return {
        status: 200,
        headers: {"Content-Type":"image/jpeg"},
        body: [pictureStream]
  };
}
```

#### File creation / overwrite update

```
function(request) {
  var content = request.input.readAll();
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  var pictureStream = thisBox.put('conf.json', 'application/json', content);
  return {
        status: 201,
        body: [content]
  };
}
```

#### Delete file

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  var pictureStream = thisBox.col('img').del('picture.jpg');
  return {
        status: 204,
        body: []
  };
}
```


#### File update with collision detection

File update only when the etag information sent by the If-Match header matches

```
function(request) {
  var etag = request.headers['If-Match'];
  var content = request.input.readAll();
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
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


### Operation of Collections

#### Create WebDAV collection

A collection is a term equivalent to a directory in WebDAV.

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  thisBox.mkCol('folder1');
  return {
        status: 201,
        body: []
  };
}
```

#### Create OData Service Collection

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  thisBox.mkOData('odata');
  return {
        status: 201,
        body: []
  };
}
```


#### Create Engine Service Collection

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  thisBox.mkService('svc');
  return {
        status: 201,
        body: []
  };
}
```


### Operation of OData Service Collection

#### Create Entity

Add 1 data to the table.

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  var entitySet = thisBox.odata('odata').entitySet('items')
  var item = entitySet.create({Name: 'Chocolate', Price: 2.7});
  return {
        status: 200,
        body: [JSON.stringify(item)]
  };
}
```

#### Acquisition of Entity

Acquire 1 table of data

```
function(request) {
  var thisBox = _p.localbox();
// Please use the following format to get local Box for Ver. before 1.6.5
// var thisBox = _p.as('client').cell().box();
  var item = thisBox.odata('odata').entitySet('items').retrieve('key1');
  return {
        status: 200,
        body: [JSON.stringify(item)]
  };
}
```
