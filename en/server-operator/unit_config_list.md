# Unit configurations
The unit configuration file is a file that manages the setting of Personium unit.  
The default setting is defined in the "personium-unit-config-default.properties" file on the GitHub source.  
Please do not change the default setting.  
If you want to change the setting, place a java property file named "personium-unit-config.properties" and start the servlet container.  
The unit then replaces the default value defined in "personium-unit-config-default.properties" with the value of each setting item defined in "personium-unit-config.properties".  

The location of "personium-unit-config.properties" can be specified in Java system properties.
```
io.personium.configurationFile={Path including up to filename}
```
If the specified file does not exist or is not specified in the system property, it reads "personium-unit-config.properties" on the classpath.
<br>
#### About the key name
All keys have the following key prefix.
```
io.personium.core.
```
As an example you need to use the following keys to set up unit certificates.
```
io.personium.core.x509.crt
```
<br>
### Required change setting
It is a setting that requires changing from the default in order to operate Personium.

|Key|Description|Value|Description example|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|x509.key|X509 Path where secret key is placed|Full path of DER format secret key|/opt/x509/localhost.key|core, engine|<br>|
|x509.crt|Path where X509 certificate is placed|Full path of DER format certificate|/opt/x509/localhost.crt|core, engine|<br>|
|x509.root|X509 Path where root certificate is placed|Full path of trusted DER format root certificate<br>More than one space can be specified|/opt/x509/personium_ca.crt|core, engine|If you do not specify anything (do not define the key), the certificate of Personium official CA will be automatically trusted.|
|security.secret16|Encryption key when generating token or file|16 hexadecimal character string|secret16abcdefgh|core, engine|<br>|
|security.auth.password.salt|Password hash salt value|16 hexadecimal character string|saltijkl|core|<br>|
|unitUser.issuers|Character string<br>The cell can be specified by specifying cell URL for a unit user token publisher. |Cell URL<br>More than one space can be specified|http://localhost:8080/UnitUserCell/ |core|<br>|
<br>
### Change optional setting
It is a setting which change from default as optional when operating Personium.

#### Basic configuration
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|version|version|String|1.5.3|core, engine|<br>|
|thread.pool.num|Number of thread pools|int|20|core|PersoniumUnit The total number of thread pools. We plan to divide the thread pool for each function in the future.|
|plugin.path|Personium plugin placement destination path|Plugin placement destination Full path|/personium/personium-core/plugins|core|<br>|
|unitScheme|Unit scheme setting|"http" or "https"|https|core|Please set https when you operate it though it is also possible to set http to the development usage.|
|masterToken|Master Token|Token string||core, engine|Please do not set it when you operate it though it is possible to set by the development usage.|

#### OData
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|odata.batch.bulkRequestMaxSize|Maximum number of requests when doing $batch processing|Int|1000|core|<br>|
|odata.batch.timeoutInMillis|Timeout time of $batch processing (msec)|Long|270000|core|<br>|
|odata.batch.sleepInMillis|Sleep time of $batch processing (msec)|Long|50|core|<br>|
|odata.batch.sleepIntervalInMillis|Sleep interval of $batch processing (msec)|Long|1000|core|<br>|
|odata.links.NtoN.maxnum|Maximum number of N: N $links can be created|Int|10000|core|<br>|
|odata.query.expand.top.maxnum|$Top Maximum number when $expand is specified|Int|100|core|<br>|
|odata.expand.retrieve.maxnum|Max expanded number of $expand (when acquiring one case)|Int|1000|core|<br>|
|odata.query.top.maxnum|Maximum number of $top|Int|10000|core|<br>|
|odata.query.skip.maxnum|Maximum number of $skip|Int|100000|core|<br>|
|odata.query.top.defaultnum|Number of default returns at the time of list acquisition|Int|25|core|<br>|
|odata.query.expand.property.maxnum.list|Maximum number of properties of $expand (when list is acquired)|Int|2|core|<br>|
|odata.query.expand.property.maxnum.retrieve|Maximum number of properties of $expand (when acquiring one item)|Int|10|core|<br>|

#### Account
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|account.lastauthenticated.enabled|Whether to update the last login time of Account when password authentication is successful|true:Update<br>false:Do not update|true|core|If you record the last update date and time, the registration process will be performed inside the authentication process, so it will be affected by multiple locks of writing (lock range is cell unit).<br>In addition, writing occurs, so performance degradation will occur.<br>Basic authentication does not record the last login date and time with this setting.|

#### WebDAV
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|dav.childresource.maxnum|Maximum number of child elements of the collection|Int|1024|core|<br>|
|dav.depth.maxnum|Maximum depth of collection hierarchy|Int|50|core|<br>|

#### Security
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|security.dav.encrypt.enabled|Whether to encrypt the WebDAV file|true:To encrypt<br>false:Do not encrypt|false|core|<br>|

#### Lock
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|lock.type|Type of Lock|"memcached":Memcached<br>"inProcess":InProcess|memcached|core|<br>|
|lock.accountlock.time|Account lock expiration date (sec)<br>Lock authentication for that account at the time of authentication failure, and for a period during which authentication fails|Int|1|core|<br>|
|lock.retry.times|Number of retries at lock acquisition|Int|50|core|<br>|
|lock.retry.interval|Interval at lock acquisition retry (msec)|Long|100|core|<br>|
|lock.cell.retry.times|Number of retries at cell lock acquisition|Int|50|core|<br>|
|lock.cell.retry.interval|Interval at cell lock acquisition retry (msec)|Long|100|core|<br>|
|lock.memcached.host|Memcached host name to hold lock on memcached|Host Name|localhost|core|<br>|
|lock.memcached.port|Memcached port number for keeping locks on memcached|Port number|11211|core|<br>|
|lock.memcached.opTimeout|Lock memcached operation Timeout value (msec)|Long|12000|core|<br>|

#### Elasticsearch
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|es.hosts|Elasticsearch host name|Specify Elasticsearch node in {host: port} format<br>Multiple designation possible with comma delimited|localhost:9300|core, engine|If even one node that can be connected is specified, it can operate.|
|es.cluster.name|Elasticsearch cluster name|String|clusterpersonium|core, engine|<br>|
|es.unitPrefix|When using Elasticsearch, prefix used for index name at index creation|String|u0|core, engine|Normally specify the unit name.|
|es.topnum|Search result output upper limit number of Elasticsearch|Int|10000|core|<br>|
|es.retryTimes|Number of retries at error occurrence|Int|3|core|<br>|
|es.retryInterval|Retry interval at error occurrence (msec)|Int|1500|core|<br>|

#### BinaryData
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|binaryData.physical.delete.mode|Do you delete physically when deleting files?|true:Physical delete<br>false:Logical delete|true|core|During logical deletion, deleted files remain, so there is a possibility of pressing down the disk.|
|binaryData.fsync.enabled|Whether to enable fsync when writing to a file|true:Valid<br>false:Invalid|false|core, engine|If it is enabled WebDAV registration performance deteriorates because fsync is performed when writing WebDAV files.<br>Activate it if you need to acquire the backup with snapshot etc. or strictly write to the disk.|
|binaryData.dav.retry.count|Number of retries when hard link creation / renaming / deletion of Dav file is performed|Int|100|core|<br>|
|binaryData.dav.retry.interval|Retry interval for hard link creation / renaming / deletion of Dav file (msec)|Long|50|core|<br>|

#### BlobStore
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|blobStore.root|Root path that stores blob data|Full path of directory|/personium_nfs/personium-core/dav|core, engine|<br>|

#### User data
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|box.odata.schema.MaxEntityTypes|Maximum number of EntityType|Int|100|core|<br>|
|box.odata.schema.MaxProperties|Maximum number of properties contained in EntityType|Int|400|core|<br>|
|box.odata.schema.property.LayerLimits.SimpleType|Maximum number of SimpleTypes for each hierarchy|Int<br>Comma separated|*,50,30,10|core|<br>|
|box.odata.schema.property.LayerLimits.ComplexType|Maximum number of ComplexType of each hierarchy|Int<br>Comma separated|20,5,2,0|core|<br>|

#### Event
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|event.log.current.dir|Event log file storage directory|Full path of directory|/personium_nfs/personium-core/eventlog|core|<br>|

#### Cache
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|cache.type|Cache type|"memcached":Cache with memcached<br>"none":Cache invalid|memcached|core|When it is set to none Elasticsearch load increases because it inquires Elasticsearch every time management information.|
|cache.cell.enabled|WWhether to enable Cell's cache|true:Valid<br>false:Invalid|true|core|<br>|
|cache.box.enabled|Whether to enable Box's cache|true:Valid<br>false:Invalid|true|core|<br>|
|cache.schema.enabled|Whether to enable Schema's cache|true:Valid<br>false:Invalid|true|core|<br>|
|cache.memcached.host|Memcached host name|Host name|localhost|core|<br>|
|cache.memcached.port|Memcached port number|Port number|11212|core|<br>|
|cache.memcached.opTimeout|mEmcached operation Timeout value (msec)|Long|12000|core|<br>|
|cache.memcached.expiresin|Cache effective period (sec)|Int|86400|core|<br>|

#### Engine
Engine settings are used to access Engine from Core.
```
http://{engine.host}:{engine.port}/{engine.path}
```
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|engine.host|Engine server host name|Host name|localhost|core|<br>|
|engine.port|Engine server port number|Port number|8080|core|<br>|
|engine.path|Path of Engine|Path|personium-engine|core|<br>|

#### Bar file
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|bar.file.maxSize|Maximum file size of bar file (MB)|Long|100|core|<br>|
|bar.entry.maxSize|Maximum file size of entry in Bar file (MB)|Long|10|core|<br>|
|bar.userdata.linksOutputStreamSize|Size to which responses are returned when linking user data|Long|5|core|<br>|
|bar.userdata.bulkSize|Number of batch registration of user data|Long|1000|core|<br>|
|bar.installfile.dir|Root directory for storing bar files and log details|Full path of directory|/personium_nfs/personium-core/barInstall|core|<br>|
|bar.progress.expireInSec|Store in memcached bar Expiration date of installation processing status (sec)|Int|259200|core|<br>|

#### OpenID Connect
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|oidc.google.trustedClientIds|In Google OpenID Connect, this unit trusts ClientID<br>More than one space can be specified|	String|*|core|When "*" is specified Trust all ClientIDs<br><b>In the future planned to move as Plugin original setting</b>|

#### CellSnapshot
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|cellSnapshot.root|Route path to store snapshot data|Full path of directory|/personium_nfs/personium-core/snapshot|core|<br>|
