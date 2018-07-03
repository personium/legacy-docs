# Setup Authentication Plugins
## Authentication Plugins
The Authentication Plugin is intended to extend the behavior of OAuth 2 token End Point of Cell.  
By introducing an Authentication Plugin into the unit, the expanded behavior defined for the plugin is added to the OAuth 2 token end point of all Cells on that unit.  
In OAuth 2, the token endpoint is responsible for issuing an access token for resource access.  
With the OAuth 2.0 specification, grant_type which is a required parameter of this end point can be used by defining arbitrary absolute URI in addition to which are definition values in the specification.  

reference: https://tools.ietf.org/html/rfc6749#section-4.5  

The Authentication Plugin describes it in a corresponding form.  

## Behavior of Authentication Plugins
By installing the authentication plugin the following will be expanded.  

- When [Create Account](../apiref/current/212_Create_Account.md), the Type defined in the authentication plugin can be specified
- By calling the [OAuth2.0 Token Endpoint](../apiref/current/293_OAuth2_Token_Endpoint.md) with "grant_type defined in the authentication plugin", it becomes possible to call the authentication function of the authentication plugin
- If you call [OAuth2.0 Token Endpoint](../apiref/current/293_OAuth2_Token_Endpoint.md) with "grant_type defined in authentication plugin", you can specify free key-value for body

## Repositories
* [personium-plugin-sample](https://github.com/personium/personium-plugin-sample)

## Installation
Describes how to set up the Authentication Plugin published by Personium Open Source.  
### Make jar file
Maven is required for build.  
Refer to http://maven.apache.org/install.html and install maven.  

Check out the target repository (personium-plugin-xxxxx) and do the following:  
```
cd personium-plugin-xxxxx
mvn clean package -DskipTests
```
Jar file is created under "personium-plugin-xxxxx/target".  

### Install
Deploy the jar file to your AP server and restart it.  
The default deploy path is "/personium/personium-core/plugins".  
```
# cp personium-plugin-xxxxx/target/personium-plugin-xxxxx.jar /personium/personium-core/plugins
# systemctl restart tomcat
```

### Update
If you wish to update the Authentication Plugin, overwrite the jar file and restart it just as you did during installation.  
