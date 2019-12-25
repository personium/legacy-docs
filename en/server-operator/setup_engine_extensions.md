# Setup Engine Extensions  
Engine Extension is a mechanism for extending the function of Engine Library.  
For details [Personium Engine](../app-developer/Personium-Engine.md) please.  

This page describes how to set up the Engine Extension published by Personium Open Source.  

## Repositories  
* [personium-ex-httpclient](https://github.com/personium/personium-ex-httpclient)
* [personium-ex-mailsender](https://github.com/personium/personium-ex-mailsender)
* [personium-ex-slack-messenger](https://github.com/personium/personium-ex-slack-messenger)
* [personium-ex-ew-services](https://github.com/personium/personium-ex-ew-services)

## Install the pre-built extensions  
Download the jar file(s) from our official file server to your AP server and restart Tomcat.  
The default target path on your AP server is "/personium/personium-engine/extensions".  
```
# cd /personium/personium-engine/extensions
# curl -O https://personium.io/mvnrepo/io/personium/personium-ex-${COMPONENT}/${VERSION}/personium-ex-${COMPONENT}-${VERSION}-libs.jar
# systemctl restart tomcat
```

## Build and install the latest extensions  
If you wish to build the latest Engine Extension and deploy in on your AP server, perform the followings.  

### Pre-requisite (Maven)  
Maven is required for building the jar file(s).  
Refer to http://maven.apache.org/install.html and install maven.  

### Procedures  
Check out the target repository (personium-ex-xxxxx) and execute the following commands.  
Jar file is created under "personium-ex-xxxxx/target".  
```
# cd personium-ex-xxxxx
# mvn clean package -DskipTests
# cp personium-ex-xxxxx/target/personium-ex-xxxxx.jar /personium/personium-engine/extensions
# systemctl restart tomcat
```  
