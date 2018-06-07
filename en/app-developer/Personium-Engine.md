# Personium Engine
## Overview

Personium Engine is a mechanism for registering simple server side logic(Engine Script) and running it. Access to the Engine is done via the Engine Service Collection (ESC) created in Box.  

1. Place JavaScript file in ESC
1. Routing setting (setting which logic to run in which pass) by issuing PROPPATCH method to ESC
1. Grant exec privilege by issuing ACL method to ESC or parent directory

By preparing for the above three steps, server side logic will run with the call of the designated pass.  

In many cases, Engine Script is distributed by the application developer in the bar file, and can be executed by cell owner installing the box.Also, the owner of the cell manipulates the application without imagining how much it will load the Unit while operating the application, and Engine Script will be executed when such operation is triggered.  

As a result, the Engine is designed as a sandbox environment that can not write code that overloads Unit or attack Units from inside.  

On the other hand, if the constraint is too tight, it is limited that it can be performed, so the Engine Extension is prepared as a framework by which the unit administrator can extend the function.  

## Engine Service Collection(ESC)
ESC (Engine Service Collection) is a special collection that can be created anywhere in the WebDAV space within Box and has the following two roles.  

* Storage and management of Engine Script
* Provide endpoint for execution

The storage and management of Engine Script is handled by Script Source Collection which is automatically created in ESC. By setting the element called p: service by the WebDAV PROPPATCH operation to ESC, routing setting of so-called processing such as which Engine Script should be responsible for the request for any path under the control can be performed. By doing this, you can create an endpoint for processing execution on any path under ESC.

### Create / set / delete ESC
ESC creation is done using the MKCOL method. ESC can be deleted by issuing the DELETE method to the created ESC path.

* [Create ESC](../apiref/current/381_Create_Service_Collection_Source.html)
* [Delete ESC](../apiref/current/383_Delete_Service_Collection_Source.html)

In addition, ESC can rename and move with the MOVE method. Granting exec privilege is important in setting access rights using ACL method.

### Storage and management of Engine Script
When creating an ESC, a collection directory for __src / source storage is automatically created internally. This is called the Script Source Collection. It stores Engine Script written in JavaScript here. You can not create child directories in this directory and you can not MOVE or DELETE, but except for those points, it is the same as ordinary WebDAV Collection, registering, deleting and updating Engine Script by WebDAV operation.

### Logic execution endpoint setting
You can set the logic execution endpoint by issuing the PROPPATCH method to ESC and setting its properties.

* [Execution setting of ESC](../apiref/current/380_Configure_Service_Collection.html)

## Engine Script
Engine Script is a script to register in ESC. Currently only JavaScript is supported.

```
function(request) {
  return {
        status: 200,
        headers: {"Content-Type":"text/plain"},
        body: ["Hello World !!"]
  };
}
```

Engine Script is defined as a function conforming to the JSGI specification. The request information is passed as an argument of the function to be defined. A response is also generated based on the object defined as the return value of the function.

### Request

When there is access to the endpoint, the function is executed in the form that the object containing the request information is passed as an argument in the specification below.


|Key |Type|Value|
|:--|:--|:--|
|method|String|HTTP request method|
|headers|Object|HTTP request header|
|input|Object|HTTP request body|
|queryString|String|QueryString part of HTTP request URL|
|pathInfo|String|The pathInfo part of the HTTP request URL|
|scheme|String|The scheme part of the HTTP request URL|
|host|String|Host part of HTTP request URL|
|port|String|Port part of HTTP request URL|
|scriptName|String|Script name|


### Response

Please return the object of the specification as return value of function below. It makes an appropriate HTTP response.

|Key|Type|Value|
|:--|:--|:--|
|status|Number|HTTP status code|
|headers|Object|HTTP response header|
|body|Object for which the forEach function is defined|HTTP response body|


* [Sample Engine Script](./671_Engine_Script_Samples.md)


### Available global objects


Within the function, in addition to general JavaScript logic description, several global objects such as Personium Engine Library, which is a group of functions for calling Personium 's API, can be used.  

* JSON
* String
* RegExp
* Object
* Array
* Math
* etc


## Engine Library
Engine Libray is a library that you can use in Engine Script to access from the global variable _p. Access to other Cell and other Box as well as own Box of its own cell is possible as long as access is permitted.


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
Engine Extension is a mechanism for extending the function of Engine Library. Specifically, by setting a jar file containing classes written in a specific way in the Java language to the unit, an object providing a new function appears in the Engine Script under _p.extension. Package, and use It will be possible.  

The Engine Extension is a mechanism for relaxing the constraint of the engine designed as a sandbox environment as described in the overview. Therefore, you can not do the installation of Engine Extension unless you are a unit administrator.  


### Setup Engine Extensions

If you would like to use Engine Extension please see [Setup Engine Extensions](../server-operator/setup_engine_extensions.md).

### Engine Extension development

If you would like to develop Engine Extension please see [the guide for plugin developer](../plugin-developer/).
