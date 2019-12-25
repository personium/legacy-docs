# Setup Engine Extensions
Engine Extension is a mechanism for extending the function of Engine Library.  
For details [Personium Engine](../app-developer/Personium-Engine.md) please.  

This page describes how to set up the Engine Extension published by Personium Open Source.  

## Repositories
* [personium-ex-httpclient](https://github.com/personium/personium-ex-httpclient)
* [personium-ex-mailsender](https://github.com/personium/personium-ex-mailsender)
* [personium-ex-slack-messenger](https://github.com/personium/personium-ex-slack-messenger)
* [personium-ex-ew-services](https://github.com/personium/personium-ex-ew-services)

## Installation

### Install
Deploy the jar file to your AP server and restart it.  
The default deploy path is "/personium/personium-engine/extensions".  
```
# cd /personium/personium-engine/extensions
# curl -O https://personium.io/mvnrepo/io/personium/personium-ex-${COMPONENT}/${VERSION}/personium-ex-${COMPONENT}-${VERSION}-libs.jar
# systemctl restart tomcat
```

### Update
If you wish to update the Engine Extension, overwrite the jar file and restart it just as you did during installation.  

## Make jar file
Maven is required for build.  
Refer to http://maven.apache.org/install.html and install maven.  

Check out the target repository (personium-ex-xxxxx) and do the following:  
```
cd personium-ex-xxxxx
mvn clean package -DskipTests
```
Jar file is created under "personium-ex-xxxxx/target".  
