# WebDAV Model

### What is WebDAV
* Web Distributed Authoring and Versioning (WebDAV) is an extension to HTTP 1.1 that allows you to edit and manage files on remote Web servers. WebDAV supports the following features:

### Overview
* WebDAV is based on the concept of RFC4918:WebDAV, which allows to create file(s) and collections.  
In Personium, it is possible to create special collections (OData, Service) other than ordinary WebDAV collections, and to control collection access by ACL.

### WebDAV lock
* Exclusive lock is applied to the WebDAV under Box while registering, updating and deleting the file / collection.

* In the above state, other users can acquire, but registration, update, and deletion processing will wait until the lock is released.

* Also, if the lock has not been resolved after a certain period of time, the following response will be returned.

* If the following response is returned, please make a request after a while.

* Error code : 503

* Error message : Too many concurrent requests.

### Enhancing MKCOL
* In the Personium,It supports the creation of special collections such as OData and services in compliance with RFC 5689.

* This allows you to handle various data models besides files.

### Special collection
#### &nbsp;OData Collection
* Personium supports OData collection to handle relational data.

* By creating an OData collection under Box under MKCOL, the path below that collection is OData space.  
Relational data can be stored by setting appropriate schema etc in that space.

* For details, see the OData model.

#### &nbsp;Service Collection
* In Personium, as an interface for executing user-defined server side logic,  
We support service collection.

* By making a service collection with MKCOL and making appropriate settings,  
You can freely provide user-defined services in the paths below that collection.

* For details, see the Service model.
