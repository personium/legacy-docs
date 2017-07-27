# Data management
### Two types of data management
Personium manages user's data with Elasticsearch and file system.<br>Data on Elasticsearch is OData interface, data on file system follows WebDAV interface.

* OData (Open Data Protocol)<br>A protocol that standardized data access method in Web application.<br>It returns JSON or XML data as a response in the standard WebAPI HTTP request.<br>OData official : http://www.odata.org/

* WebDAV (Web-based Distributed Authoring and Versioning)<br>Protocol aimed at managing files on a Web server that extends HTTP 1.1.<br>It can be used without problem even under Proxy environment because of pure HTTP extension.<br>In addition to the HTTP standard, several methods such as PROPFIND have been added.<br>WebDAV official : http://webdav.org/

### Management of each object data
Indicates management of each object of Personium.

|Category|Object|Interface type|
|:--|:--|:--|
|Unit control object|Cell|OData|
|Cell control object|Role<br>Account<br>Box<br>ExtCell<br>Relation<br>ExtRole<br>SentMessage<br>ReceivedMessage|OData|
|Box resource schema|ODataServiceCollection<br>WebDAVServiceCollection<br>EngineServiceCollection|WebDAV|
|Box resource<br>File|File<br>ServiceCollectionSource|WebDAV|
|Box resource<br>OData|EntityType<br>AssociationEnd<br>ComplexType<br>Property<br>ComplexTypeProperty<br>Entity|OData|
|Access control setting|ACL (Cell Level)<br>ACL (Box Level)|WebDAV|
<br>
#### Reference information
For example, if you want to acquire the data in the cell for backup purposes etc., it can be done by executing the Personium API.
> Account password can not be obtained.<br>We plan to implement an API that can collect data all at once.

##### How to get OData's data
Execute list acquisition API of each object and obtain data.<br>In the case of a large amount of data, it is good to utilize the query at the time of API execution and acquire it in multiple times.

* $inlinecount : Acquire the number of search results
* $top : Restrict the number of search results
* $skip : Acquire the specified number of skipped search results
* $orderby : Sort search results

##### How to get WebDAV's data
**ACL (Cell Level)**<br>Execute property acquisition API of Cell.<br>

**Box resource**<br>Execute the collection setting acquisition API with depth = 1.<br>The following information can be acquired with the collection setting acquisition API.

* Resource Path
* Resource Type (ODataServiceCollection, WebDAVServiceCollection, EngineServiceCollection, File)
* ACL

When the Resource Type is WebDAVServiceCollection or EngineServiceCollection, the collection setting acquisition API is recursively executed for that subordinate to acquire information.<br>If the Resource Type is a file, execute the file acquisition API and acquire the file.

##### How to register acquired data
Execute creation / registration API of corresponding object.<br>If there are multiple data, execute it recursively.
