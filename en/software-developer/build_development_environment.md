# Build development environment

## Target OS
Windows

## List of tools necessary for development
Download the necessary tools for development.

| Tool name | Version | Download URL |
|:--|:--|:--|
| Eclipse (Pleiades) | 2018-09 Full Edition or later | http://mergedoc.osdn.jp/ |
| OracleJDK | 1.8 series | Pleiades Do not introduce individual items to use the items included |
| Git | Latest | https://git-scm.com/ |
| Maven | 3 series | https://maven.apache.org/download.cgi |

## List of tools necessary for operation check
Please download the necessary tools for operation check.

| Tool name | Version | Download URL |
|:--|:--|:--|
| Tomcat | 9.0 series | Pleiades Do not introduce individual items to use the items included |
| Elasticsearch | 5.6.14 | https://www.elastic.co/jp/downloads/past-releases/elasticsearch-5-6-14 |
| ActiveMQ | 5.15 series | http://activemq.apache.org/download-archives.html |
| Nginx | 1.14 series | http://nginx.org/download/nginx-1.14.0.zip |


## Initial setting of various tools
Execute the command as a user with administrator authority.
### OracleJDK
Set environment variable (JAVA_HOME).  

```
variable:JAVA_HOME
value:java installation directory path(e.g.: C:\Program Files\pleiades\java\8)
```

Add the following to the system environment variable (Path).

```
%JAVA_HOME%\bin
```

### Git
Add the following description to C:¥Users¥[user]¥.gitconfig  

```
[core]
	autocrlf = false
 	ignorecase = false
```

> When building a development environment under a proxy environment, we also add the following.  
\* The value of {} will input your own information.

```
[http]
	proxy = {protocol}://{username}:{pass}@{host}:{port}
[https]
	proxy = {protocol}://{username}:{pass}@{host}:{port}
```


### Maven

Set environment variable (M2_HOME).  

```
variable:M2_HOME
value:maven installation directory path(e.g.: C:\Program Files\apache-maven-3.5.4)
```

Add the following to the system environment variable (Path).

```
%M2_HOME%\bin
```

> When building a development environment under a proxy environment, add the following description to apache-maven-3.5.4 \ conf \ settings.xml.  
\* The value of {} will input your own information.

```
<proxies>
  <proxy>
      <id>proxy00</id>
      <active>true</active>
      <protocol>http</protocol>
      <username>{username}</username>
      <password>{pass}</password>
      <host>{host}</host>
      <port>{port}</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
  </proxy>
  <proxy>
      <id>proxy01</id>
      <active>true</active>
      <protocol>https</protocol>
      <username>{username}</username>
      <password>{pass}</password>
      <host>{host}</host>
      <port>{port}</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
  </proxy>
</proxies>
```

### Elasticsearch
#### Modification of elasticsearch-5.6.14 \ config \ elasticsearch.yml

Add the following description to elasticsearch.yml.

```
cluster.name: {Optional name}

network.host: 0.0.0.0
action.auto_create_index: false
http.cors.enabled: true
http.cors.allow-origin: "*"
indices.fielddata.cache.size: 80%(Optional: What percent of heap memory is used as data cache)
```

### ActiveMQ
none


### Tomcat
none


### Nginx
For initialization of Nginx, modify the nginx.conf file under nginx-1.14.0\conf.  

1. Add a description below in http.

    ```
        ignore_invalid_headers on;
        proxy_set_header Host $http_host;
        proxy_http_version 1.1;
        large_client_header_buffers 4 55k;

        map $http_upgrade $connection_upgrade {
          default upgrade;
          '' close;
        }
    ```

1. Change contents of http.server.location / to the following description.

    ```
                #root   html;
                #index  index.html index.htm;

                if ($request_uri ~ [\x00-\x20\x22\x3c\x3e\x5b-\x5e\x60\x7b-\x7d\x7f]) {
                    return 400;
                }

                if ($request_uri ~* ([^?]+)\?(.*)) {
                  set $personium_path $1;
                  rewrite .* /personium-core$personium_path break;
                }
                if ($is_args = "") {
                  rewrite .* /personium-core$request_uri break;
                }

                proxy_pass http://localhost:8080;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header X-Forwarded-Proto http;
                proxy_set_header X-Forwarded-Path $request_uri;
                proxy_set_header Host $http_host;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection $connection_upgrade;
                proxy_hide_header X-Powered-By;
                proxy_hide_header X-Rack-Cache;
                proxy_hide_header X-Content-Digest;
                proxy_hide_header X-Runtime;
    ```

## Project registration in Eclipse
Register personium-core and personium-engine as a project.  
1. Clone from the GitHub repository.  
https://github.com/personium/personium-core.git  
https://github.com/personium/personium-engine.git

1. Register each as an Eclipse maven project.  

1. Create personium-unit-config.properties in each /src/main/resources.
> The value of io.personium.core.es.cluster.name is the Elasticsearch config file (elasticsearch.yml)  
Specify the value set in cluster.name of the cluster.

**/personium_core/src/main/resources/personium-unit-config.properties**

```
#################################################
# personium-core configurations
#################################################
# general configurations
io.personium.core.masterToken=personiumio
io.personium.core.unitScheme=http
#io.personium.core.unitPort=9998
#io.personium.core.unitPort=8080
io.personium.core.unitPort=
#io.personium.core.unitPath=/personium-core
io.personium.core.unitPath=
io.personium.core.pathBasedCellUrl.enabled=true

io.personium.core.unitUser.issuers=personium-localunit:/unitadmin/ personium-localunit:/unitadmincell/ personium-localunit:/unitusercell/

# cell configurations
io.personium.core.cell.relayhtmlurl.default=https://demo.personium.io/app-cc-home/__/index.html

io.personium.core.es.cluster.name={Value set with elasticsearch.yml}
io.personium.core.es.retryTimes=10

io.personium.core.plugin.path=/personium/plugins
io.personium.core.blobStore.root=/personium_nfs/personium-core/dav
io.personium.core.bar.tmp.dir=/personium_nfs/personium-core/bar
io.personium.core.event.log.current.dir=/personium_nfs/personium-core/eventlog
io.personium.core.cellSnapshot.root=/personium_nfs/personium-core/snapshot

# lock type configurations
io.personium.core.lock.type=inProcess

# cache configurations (memcached protocol)
io.personium.core.cache.type=inProcess
io.personium.core.cache.cell.enabled=false
io.personium.core.cache.box.enabled=false
io.personium.core.cache.schema.enabled=false

# security configurations
io.personium.core.security.secret16=gv7hpmmf5siwj5by
io.personium.core.security.auth.password.salt=voAbizvF
io.personium.core.security.dav.encrypt.enabled=false

# Davlimit configurations
io.personium.core.dav.childresource.maxnum=30
io.personium.core.dav.depth.maxnum=5

# OData $links configurations
io.personium.core.odata.links.NtoN.maxnum=40
```

**/personium_engine/src/main/resources/personium-unit-config.properties**

```
#################################################
# personium-engine configurations
#################################################
# general configurations
io.personium.core.masterToken=personiumio

io.personium.core.es.cluster.name={Value set with elasticsearch.yml}

io.personium.core.blobStore.root=/personium/personium_nfs/personium-core/dav

# security configurations
io.personium.core.security.secret16=secret167pm5m4y6
```

> \* If there are maven and pom.xml related build errors on Eclipse,  
Please carry out the procedure described below.

1. Move to the directory where pom.xml exists at the command prompt etc.  

1. Execute the following command.

    ```
    mvn clean package -DskipTests
    ```

    If the command does not end with SUCCESS, remove the cause and re-execute.  

1. In Eclipse, right-click the target project -> [Maven] -> [Update Project] -> [OK].


## Startup confirmation method
Execute the command as a user with administrator authority.
### Elasticsearch launch confirmation

Go to Elasticsearch installation directory at the command prompt etc.

```
> cd Elasticsearch installation directory
```

Execute the following command.

```
> bin\elasticsearch-service install
> bin\elasticsearch-service start
```

Access http://localhost:9200 in the browser.  

The output will be successful if it is output as follows.

```
{
  "name" : "MODAM",
  "cluster_name" : "{Value set with elasticsearch.yml}",
  "cluster_uuid" : "VM2fJ2hXQRSI4PsYhJBtLA",
  "version" : {
    "number" : "5.6.14",
    "build_hash" : "f310fe9",
    "build_date" : "2018-12-05T21:20:16.416Z",
    "build_snapshot" : false,
    "lucene_version" : "6.6.1"
  },
  "tagline" : "You Know, for Search"
}
```

### ActiveMQ startup confirmation

Go to the Activemq installation directory with command prompt etc.

```
> cd Activemq installation directory
```

Execute the following command.

```
> bin\activemq start
```

Access http://localhost:8161 in the browser.  
The startup will be successful when the management screen is displayed.  

### Startup confirmation for development server
In Eclipse, right-click the [personium-core] project -> select [Run] -> [Run on Server].  

For the first time, add the server of Tomcat 9 with the definition of the new server and execute it.  

> \* Starting Tomcat 9 may cause a startup error to exceed the timeout time.  
Please change the timeout time at Tomcat startup in Eclipse.


Access http://localhost:8080/personium-core/ in the browser.  
The output will be successful if it is output as follows.

```
{"unit":{"path_based_cellurl_enabled":true,"url":"http:\/\/localhost\/"}}
```

### Confirm Nginx startup

Navigate to the Nginx installation directory with a command prompt.

```
> cd Nginx installation directory
```

Execute the following command.

```
> start nginx
```

Access http://localhost in the browser.  
The output will be successful if it is output as follows.

```
{"unit":{"path_based_cellurl_enabled":true,"url":"http:\/\/localhost\/"}}
```
