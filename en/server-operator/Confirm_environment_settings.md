# Environment information on units constructed by Ansible

-------------------------------------------------

## Introduction

Describe the basic settings and considerations for the environment constructed with Ansible.
By performing this procedure, you can understand the installation location and basic settings of the main middleware that makes up Personium.

## Web service

* Check the basic settings of the server on which the Web service runs.

### Nginx

* Personium uses Nginx to realize the Web.
Nginx is installed as follows.

| item                    | path                                |
|-------------------------|-------------------------------------|
| Install Directory       | /opt/nginx-1.14.0/                  |
| Config Files            | /opt/nginx-1.14.0/conf/             |
| Log Directory           | /personium/nginx/log/accesslog_443/ |  

### Server Certificate

* Personium is a service provided by HTTPS. Confirm the setting of the server certificate used to realize HTTPS.

1. First, check the path of the server certificate used by Nginx.
   To check the path of the currently used server certificate Execute the following command and confirm the item "ssl_certificate" "ssl_certificate_key".

    ```console
    # cat /opt/nginx/conf/nginx.conf
    ```

    Immediately after construction, it is as follows.

    ```
    ssl_sertificate         /opt/nginx/conf/server.crt
    ssl_certificate_key     /opt/nginx/conf/server.key
    ```

1. Check the contents of the server certificate you are using.
   Execute the following command to check the common name of the server certificate.

    ```console
    # openssl x509 -noout -subject -in /opt/nginx/conf/server.crt
    ```

    When creating as in the example of creating a server certificate described in [1-server_unit/README](https://github.com/personium/ansible/tree/master/1-server_unit) or [3-server_unit/README](https://github.com/personium/ansible/tree/master/3-server_unit), It is displayed as follows. CN must represent common name and must match FQDN when accessing with HTTPS protocol.

    ```
    subject= /C=XXX/L=Default City/O=Default Company Ltd/CN=personium.example.com
    ```

## AP service

Check the basic settings of the server on which the AP service runs.

### Tomcat environment

* Personium uses Tomcat to realize the AP.
  Tomcat is installed as follows.

| Item                          | Path                                |
|-------------------------------|-------------------------------------|
| Install Directory             | /opt/apache-tomcat-9.0.10/          |
| Config Files                  | /opt/apache-tomcat-9.0.10/conf/     |
| Log Directory                 | /personium/tomcat/logs/             |
| Application Directory         | /opt/apache-tomcat-9.0.10/webapps/  |  

### Unit Certificate

* Personium is an important file using unit certificates with various functions such as access token verification.

1. First, check the path of the unit certificate currently in use. The unit certificate is specified in the file personium-unit-config.properties.
    * Execute the following command to check the file.  

    ```console
    # cat /personium/personium-core/conf/18888/personium-unit-config.properties | grep ^io.personium.core.x509
    ```

    The environment automatically constructed with Ansible has the following settings.
    
    ```
    io.personium.core.x509.root=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.crt=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.key=/opt/x509/unit.key
    ```

1. Check the common name of the unit certificate. At this time, the common name of the unit certificate must match the FQDN of its own Personium Unit.
    * You can check the unit certificate information by executing the following command.

    ```console
    # openssl x509 -noout -subject -in /opt/x509/unit-self-sign.crt
    ```

    * When created as shown in the example of creation of unit certificate described in [How to generate Self-signed Unit Certificate](How_to_generate_Self-Signed_Unit_Certificate.md), it is displayed as follows. The CN should represent the common name and it must match the FQDN for HTTPS access.

    ```
    subject= /C=XXX/L=Default City/O=Default Company Ltd/CN=personium.example.com
    ```

### Personium environment

* Personium is installed as follows.

| Item                          | Path                                                                  |
|-------------------------------|-----------------------------------------------------------------------|
| personium-core                | /opt/tomcat/webapps/                                                  |
| personium-engine              | /opt/tomcat/webapps/                                                  |
| personium-core Log Directory  | /personium/personium-core/log/personium-core.log                      |
| personium-engine Log Directory| /personium/personium-engine/log/personium-engine.log                  |
| Unit Config File              | /personium/personium-core/conf/18888/personium-unit-config.properties |  

* By changing personium-unit-config.properties, you can change [Unit configurations](https://personium.io/docs/en/server-operator/unit_config_list.html) from the default.  
    Immediately after construction with Ansible, it is set as follows.  
    \* {} Means that the contents defined in hosts changed before Ansible execution are described.  
    \* {{}} Indicates that a randomly determined character string is described when Ansible is executed. 

    ```
    io.personium.core.masterToken={master_token}
    io.personium.core.unitScheme=https
    io.personium.core.unitUser.issuers=personium-localunit:/UnitUserCell/ personium-localunit:/unitadmin/
    io.personium.core.lock.accountlock.time=1
    io.personium.core.plugin.path=/personium/personium-core/plugins
    io.personium.core.x509.root=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.crt=/opt/x509/unit-self-sign.crt
    io.personium.core.x509.key=/opt/x509/unit.key
    io.personium.core.security.secret16={{token.key}}
    io.personium.core.security.auth.password.salt={{sakt.key}}
    io.personium.core.account.lastauthenticated.enabled=false
    io.personium.core.lock.memcached.host=127.0.0.1
    io.personium.core.lock.memcached.port=11211
    io.personium.core.lock.memcached.opTimeout=12000
    io.personium.core.cache.type=memcached
    io.personium.core.cache.memcached.host=127.0.0.1
    io.personium.core.cache.memcached.port=11212
    io.personium.core.cache.cell.enabled=true
    io.personium.core.cache.box.enabled=true
    io.personium.core.cache.schema.enabled=true
    io.personium.core.cache.memcached.opTimeout=12000
    io.personium.core.cache.memcached.expiresin=86400
    io.personium.core.es.hosts=127.0.0.1:9300
    io.personium.core.es.cluster.name=personium
    io.personium.core.es.ads.type=none
    io.personium.core.engine.enabled=true
    io.personium.core.engine.host=localhost
    io.personium.core.engine.port=18888
    io.personium.core.engine.path=personium-engine
    io.personium.core.binaryData.physical.delete.mode=true
    io.personium.core.binaryData.fsync.enabled=true
    io.personium.core.blobStore.root=/personium_nfs/personium-core/dav
    io.personium.core.event.log.current.dir=/personium_nfs/personium-core/eventlog
    io.personium.core.bar.file.maxSize=100
    io.personium.core.bar.entry.maxSize=10
    io.personium.core.bar.installfile.dir=/personium_nfs/personium-core/barInstall
    io.personium.core.bar.progress.expireInSec=259200
    io.personium.core.defaultBaseUrl=https://personium.example.com
    io.personium.engine.masterToken={master_token}
    io.personium.engine.elasticsearch.hosts=127.0.0.1:9300
    io.personium.engine.elasticsearch.cluster=personium
    io.personium.engine.binaryData.fsync.enabled=true
    io.personium.engine.blobStore.root=/personium_nfs/personium-core/dav
    io.personium.engine.x509.root=/opt/x509/unit-self-sign.crt
    io.personium.engine.x509.key=/opt/x509/unit.key
    io.personium.engine.x509.crt=/opt/x509/unit-self-sign.crt
    io.personium.engine.security.secret16={{token.key}}
    io.personium.core.dav.childresource.maxnum=1000000
    ```

## DB service

* Check the settings of the server on which the Elasticsearch service runs.

### Elasticsearch environment

* Personium uses Elasticsearch to realize DB. 
  Elasticsearch is installed as follows.  
  For version,Please check the version of elasticsearch [here](https://github.com/personium/ansible#middleware-on-vm).  

    | Item                    | Path                                                         |
    |-------------------------|--------------------------------------------------------------|
    | Install Directory       | /opt/elasticsearch-{ Elasticsearch version }/                |
    | Config Files            | /opt/elasticsearch-{ Elasticsearch version }/config/         |
    | Log Direcroty           | /personium/elasticsearch/log/                                |
    | Data Direcroty          | /personium/elasticsearch-{ Elasticsearch version }/data/     |  
