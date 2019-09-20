# Unit configurations
The unit configuration file is a java property file named "personium-unit-config.properties" which manages the setting of Personium unit.  
To configure a Personium unit, just place this file at a specified location and start the servlet container.  

An unit uses the values of each setting items defined in "personium-unit-config.properties". It uses default values if not specified.

## Default settings

The default settings are defined in the "personium-unit-config-default.properties" file on the GitHub source. Configuration of a unit can also be done by changing this file, but it is not recommended.

## Where to place the file

The location of "personium-unit-config.properties" can be specified in Java system properties.
```
io.personium.configurationFile={Path including up to filename}
```
If the specified file does not exist at the specified location or is not specified in the system property, then it searches for a file named "personium-unit-config.properties" on the classpath.


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

### Required settings

The setting items below are required configuration, which need to be changed properly in order to run Personium unit.

|Key|Description|Value|Description example|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|x509.key|X509 Path where secret key is placed|Full path of DER format secret key|/opt/x509/localhost.key|core, engine|<br>|
|x509.crt|Path where X509 certificate is placed|Full path of DER format certificate|/opt/x509/localhost.crt|core, engine|<br>|
|x509.root|X509 Path where root certificate is placed|Full path of trusted DER format root certificate<br>More than one space can be specified|/opt/x509/personium_ca.crt|core, engine|If you do not specify anything (do not define the key), the certificate of Personium official CA will be automatically trusted.|
|security.secret16|Encryption key when generating token or file|16 hexadecimal character string|secret16abcdefgh|core, engine|<br>|
|unitUser.issuers|Character string<br>The cell can be specified by specifying cell URL for a unit user token publisher. |Cell URL<br>More than one space can be specified|http&#58;//localhost:8080/UnitUserCell/ |core|<br>|


### Optional settings

Below are optional configuration items, which the server operators may use the default values and do not necessarily have to change.

#### Basic configuration
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|version|version|String||core, engine|<br>|
|thread.pool.num|Number of thread pools|int|20|core|v1.5.4 - v1.6.9. PersoniumUnit The total number of thread pools. Split the thread pool for each function since v1.6.10.|
|thread.pool.num.io.cell|Number of thread pools used for Cell Export/Import|int|10|core|v1.6.10 or later.|
|thread.pool.num.io.box|Number of thread pools used for Box Export/Install|int|20|core|v1.6.10 or later.|
|thread.pool.num.misc|Number of general thread pool|int|10|core|v1.6.10 or later.|
|plugin.path|Personium plugin placement destination path|Plugin placement destination Full path|/personium/personium-core/plugins|core|<br>|
|unitScheme|Unit scheme setting|"http" or "https"|https|core|Please set https when you operate it though it is also possible to set http to the development usage.|
|unitPort|Unit port setting|Port number||core|v1.6.0 or later. When UnitURL is "https&#58;//p-host:8080/", unitPort becomes 8080. When UnitURL is "https&#58;//p-host/", unitPort is no need.|
|unitPath|Unit path of URL|String||core|v1.6.0 or later. When UnitURL is "https&#58;//p-host:8080/p-path/", unitPath becomes "/p-path". When UnitURL is "https&#58;//p-host:8080/", unitPath is no need.|
|masterToken|Master Token|Token string||core, engine|Please do not set it when you operate it though it is possible to set by the development usage.|
|pathBasedCellUrl.enabled|URL format to access cell|true:path based cell url<br>false:per cell fqdn url|v1.7.5 or before:true<br>v1.7.6 or later:false|core|v1.7.0 or later.|

#### Cell
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|cell.relayhtmlurl.default|URL to access when executing Get Cell Root API.|URL||core|v1.6.15 or later.|
|cell.authorizationhtmlurl.default|URL to access when executing authentication form request for OAuth2.0 Authorization Endpoint API.|URL||core|v1.6.15 or later.|
|cell.authorizationpasswordchangehtmlurl.default|URL to access when executing OAuth 2.0 authorization endpoint API password change form request|URL||core|v1.7.7 or later.|

#### OData
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|odata.batch.bulkRequestMaxSize|Maximum number of requests when doing $batch processing|Int|1000|core|<br>|
|odata.batch.timeoutInMillis|Timeout time of $batch processing (msec)|Long|270000|core|<br>|
|odata.batch.sleepInMillis|Sleep time of $batch processing (msec)|Long|50|core|<br>|
|odata.batch.sleepIntervalInMillis|Sleep interval of $batch processing (msec)|Long|1000|core|<br>|
|odata.links.NtoN.maxnum|Maximum number of N: N $links can be created|Int|v1.7.5 or before:10000<br>v1.7.6 or later:150000|core|<br>|
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
|account.lastauthenticated.enabled|Whether to update the last login time of Account when password authentication is successful|true:Update<br>false:Do not update|true|core|- v1.7.4<br>Abolish with v1.7.5<br>If you record the last update date and time, the registration process will be performed inside the authentication process, so it will be affected by multiple locks of writing (lock range is cell unit).<br>In addition, writing occurs, so performance degradation will occur.<br>Basic authentication does not record the last login date and time with this setting.|

#### WebDAV
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|dav.childresource.maxnum|Maximum number of child elements of the collection|Int|1024|core|<br>|
|dav.depth.maxnum|Maximum depth of collection hierarchy|Int|50|core|<br>|

#### Security
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|security.dav.encrypt.enabled|Whether to encrypt the WebDAV file|true:To encrypt<br>false:Do not encrypt|false|core|v1.5.1 or later|
|security.auth.password.regex|Password restriction|string<br>Regex pattern|^[a-zA-Z0-9-_!$\*=^\`{&#124;}~.@]{6,32}$|core|v1.7.5 or later<br>\* The number of characters of the password is 1 to 256. Regardless of the limit, it is not possible to set a password of 257 or more characters.|
|security.auth.password.hashAlgorithm|Password hash algorithm|string<br>"scrypt" or "sha-256"|scrypt|core|v1.7.8 or later<br>\* "scrypt" is recommend<br>\* use of "sha-256" here is deprecated (It will be removed soon.)|
|security.auth.password.scrypt.cpuCost|CPU cost of scrypt hash|Int<br>Power of 2|16384|core|v1.7.8 or later|
|security.auth.password.scrypt.memoryCost|Memory cost of scrypt hash|Int|8|core|v1.7.8 or later|
|security.auth.password.scrypt.parallelization|Number of parallelizations of scrypt hash|Int|1|core|v1.7.8 or later|
|security.auth.password.scrypt.keyLength|Key length of scrypt hash|Int|32|core|v1.7.8 or later|
|security.auth.password.scrypt.saltLength|Salt length of scrypt hash|Int|64|core|v1.7.8 or later|
|security.auth.password.salt|Password hash salt value|16 hexadecimal character string|saltijkl|core|only applicable for SHA256 hash Algorithm|
|security.token.defaultScope.ropc|default (maximum) scope given to the access tokens issued via ROPC process|Space separated scopes string|root|core|v1.7.18 or later|
|security.token.defaultScope.assertion|default (maximum) scope given to the access tokens issued via assertion process|Space separated scopes string|root|core|v1.7.18 or later|
|security.token.defaultScope.grant_code|default (maximum) scope given to the access tokens issued via grant_code process|Space separated scopes string|root|core|v1.7.18 or later|

#### Lock
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|lock.type|Type of Lock|"memcached":Memcached<br>"inProcess":InProcess|memcached|core|<br>|
|lock.accountlock.time|Account lock expiration date (sec)<br>Lock authentication for that account at the time of authentication failure, and for a period during which authentication fails|Int|1|core|- v1.7.4<br>Abolish with v1.7.5|
|lock.retry.times|Number of retries at lock acquisition|Int|50|core|<br>|
|lock.retry.interval|Interval at lock acquisition retry (msec)|Long|100|core|<br>|
|lock.cell.retry.times|Number of retries at cell lock acquisition|Int|50|core|<br>|
|lock.cell.retry.interval|Interval at cell lock acquisition retry (msec)|Long|100|core|<br>|
|lock.memcached.host|Memcached host name to hold lock on memcached|Host Name|localhost|core|<br>|
|lock.memcached.port|Memcached port number for keeping locks on memcached|Port number|11211|core|<br>|
|lock.memcached.opTimeout|Lock memcached operation Timeout value (msec)|Long|12000|core|<br>|

#### Authentication
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|authn.account.lockCount|Account lock threshold<br>Number of times to lock that account on successive authentication failures and cause authentication to fail|Int<br>0～100|0|core|v1.7.5 or later<br>Setting it to 0 will not lock accounts|
|authn.account.lockTime|Account lock expiration date (sec)<br>A period of time that locks the account at the time of consecutive authentication failure and causes the authentication to fail<br>|Int<br>0～2592000 (30 days)|0|core|v1.7.5 or later<br>Setting it to 0 will not lock accounts|
|authn.account.validAuthnInterval|Valid authentication interval (sec)<br>Fail authentication attempt at intervals shorter than the authentication interval|Int|1|core|v1.7.5 or later|

#### Elasticsearch
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|es.hosts|Elasticsearch host name|Specify Elasticsearch node in {host: port} format<br>Multiple designation possible with comma delimited|localhost:9300|core, engine|If even one node that can be connected is specified, it can operate.|
|es.cluster.name|Elasticsearch cluster name|String|clusterpersonium|core, engine|<br>|
|es.unitPrefix|When using Elasticsearch, prefix used for index name at index creation|String|u0|core, engine|Normally specify the unit name.|
|es.topnum|Search result output upper limit number of Elasticsearch|Int|10000|core|<br>|
|es.retryTimes|Number of retries at error occurrence|Int|3|core|<br>|
|es.retryInterval|Retry interval at error occurrence (msec)|Int|1500|core|<br>|
|es.index.numberOfShards|Elasticsearch number of shards|Int|10|core|v1.7.5 or later|
|es.index.numberOfReplicas|Elasticsearch number of replicas|Int|0|core|v1.7.5 or later|
|es.index.maxResultWindow|Elasticsearch limit number of result view|Long|v1.7.6 or before:110000<br>v1.7.7 or later:150000|core|v1.7.5 or later|
|es.index.merge.scheduler.maxThreadCount|Elasticsearch limit number of thread of merge scheduler|Int|<br>|core|v1.7.5 or later|

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
|event.hop.maxnum|Event hop limitation|Int|3|core|v1.6.2 or later. When you want to stop event processing, set to 0.|

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
"engine.host", "engine.port" and "engine.path" are used to access Engine from Core.
```
http://{engine.host}:{engine.port}/{engine.path}
```
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|engine.host|Engine server host name|Host name|localhost|core|<br>|
|engine.port|Engine server port number|Port number|8080|core|<br>|
|engine.path|Path of Engine|Path|personium-engine|core|<br>|
|engine.script.cache.maxNum|Maximum number of registered engine script caches.|Int|100000|engine|If the maximum number of registrations is exceeded, the last access date is deleted from the old cache.<br>v1.5.19 or later.|
|engine.script.connection.timeout|Engine script connection timeout time(msec)|Int|50000|engine|Set connection timeout time when calling API in engine script.<br>v1.5.21 or later|

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
|cellSnapshot.root|Route path to store snapshot data|Full path of directory|/personium_nfs/personium-core/snapshot|core|v1.5.4 or later|

#### EventBus
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|eventbus.mq|Message Queue|activemq<br>kakfa|activemq|core|Select 'activemq' or 'kafka'.<br>v1.6.8 or later|
|eventbus.activemq.brokerUrl|ActiveMQ broker URL|URL|tcp://localhost:61616|core|v1.6.0 or later|
|eventbus.kafka.bootstrap.servers|Kafka server list|Comma-separated host:port list|localhost:9092|core|v1.6.8 or later|
|eventbus.queue|Queue name of event|String|personium_event_queue|core|v1.6.0 or later|
|eventbus.topic.all|Topic name for all event|String|personium_event_topic|core|v1.6.0 or later|
|eventbus.topic.rule|Topic name for rule event|String|personium_event_topic_rule|core|v1.6.0 or later|
|eventbus.eventProcessing.thread.num|Number of threads to process event.|Int|1|core|v1.6.8 or later|

#### Rule
|Key|Description|Value|Default value|Used component|Notes|
|:--|:--|:--|:--|:--|:--|
|rule.timerEvent.thread.num|Number of threads to manage timer event.|Int|1|core|v1.6.8 or later|
