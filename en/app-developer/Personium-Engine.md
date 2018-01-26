# Personium Engine
## Overview

Personium Engine is a mechanism for registering simple server side logic and running it. Currently only JavaScript is supported as a logic description language. Access to the Engine is done via the Engine Service Collection (ESC) created in Box.

1. Place JavaScript file in ESC
1. Routing setting (setting which logic to run in which pass) by issuing PROPPATCH method to ESC
1. Grant exec privilege by issuing ACL method to ESC or parent directory

By preparing for the above three steps, SERSAI logic will run on the specified path.

We define server side logic as a function according to JSGI specification. Within the function, in addition to general JavaScript logic description, it is possible to use several global objects including Engine Library which is a group of functions for calling Personium 's API.

Unit administrators can also extend Engine Library by setting Engine Extension as a unit. Specifically, by setting logic written in a specific way in the Java language as a jar file in the unit, you can define a new JavaScript class in the Engine Library and make it available.

## Engine Service Collection
Engine Service Collection is a special collection that can be created anywhere in Box's WebDAV space. ESC has two roles of storing and managing Engine Script and providing an end point for execution.

### Create / delete ESC
To create an ESC, use the MKCOL method as follows. Deletion is still possible by issuing the DELETE method. You can rename and move with the MOVE method. Granting exec privilege is important in setting access rights using ACL method.

### Script Source Collection
When creating an ESC, the collection directory for __src / is automatically created internally automatically. This is the Script Source Collection. It stores Engine Script written in JavaScript here. It is the same as ordinary WebDAV Collection, except that child directory can not be created in this directory and MOVE and DELETE can not be done, and it registers, deletes and updates Engine Script by WebDAV operation.

### Logic execution endpoint setting
You can set the logic execution endpoint by issuing the PROPPATCH method to ESC and setting its properties.

## Engine Script
Engine Script is a script to register in ESC. Currently only JavaScript is supported. Engine Script is defined as a function conforming to the JSGI specification. Within the function, in addition to general JavaScript logic description, several global objects such as Personium Engine Library, which is a group of functions for calling Personium 's API, can be used.

## Engine Library
Engine Libray is a library that you can use in Engine Script to access from the global variable _p. Access to other Cell and other Box as well as own Box of its own cell is possible as long as access is permitted.

### Sample

### API Reference
For details of Engine Libray, please also refer to the API reference below.

## Engine Extension
Engine Extension is a mechanism for extending Engine Library. By setting the Java class defined by the specified method to the unit, it is possible to compensate for lack of function of Engine Library. Installation of Engine Extension can not be done unless it is a unit administrator.
