
# Personium Authentication Plugin Developer Manual

This is a document of  Personium Authentication Plugin Developer Manual.

## Documents

It describes the information necessary for developing Personium's Authentication plugin.  
Please refer to [Setup Authentication Plugins](../server-operator/setup_authentication_plugins.md) for details of Authentication Plugin.  
This document explains the procedure for creating Authentication plugin.  

## Method of development

Specifically, the plugin defines the following three points.

1. What kind of AccountType value should be handled
1. What kind of grant_type value should be handled
1. How to evaluate the input parameter values other than grant_type of the token endpoint and what kind of entity should be recognized as a result

In other words, the plugin author implements the above three pieces of information as concrete Java code.
Personium further evaluates the authenticated identification subject information (AuthenticatedIdentity object) returned by the Authentication Plugin as the response 3 above from the following point of view,
We decide whether or not to issue a token, determine the content of issue token, and issue token.

- Is there an Account with a Name attribute in the string that can be obtained with getAccountName()
- If it exists, whether the type value of 1 above is included in the type value of the hit account

## Security considerations

Naturally, the plug-in author should generally implement the "parameter value evaluation" above in 2 so that the access agent goes through the appropriate authentication process.
For example, a specific subject (such as a real person who is not a guest etc.) to be originally protected without checking any input value,
Creating such a plug-in as to recognize it and placing it in the unit causes serious security problems.
Therefore, it is necessary for the plug-in author to implement a secure implementation, and the plug-in user (unit administrator) to use only plug-ins that are believed to be secure.

---

The following is an example using the google version Authentication Plugin.

## Class structure of Plugin

The border part of the creation plug-in is created.

The class structure diagram of Authentication Plugin is shown below.
![class structure](./images/plugin_02.png "PluginClass Structure")

> **Note:**  Return value of authentication processing
> - If authentication succeeds, AuthenticatedIdentity is returned.
> - If authentication fails, PluginException is thrown or null is returned.

## Plugin Behavior

The operation of Authentication Plugin is shown below.

![Plugin behavior](./images/plugin_01.png "PluginBehavior")

　1. Plugin initialization processing
　   PluginManager is called in the PersoniumCoreApplication class and reads all plugins.

　2. Call authentication process
　   In the TokenEndPointResouce class, select the target GrantType Plugin.
　   Execute the authenticate method of the selected plugin.

> **Note:**
> - Personium Plugin can be executed simply by placing it in the Plugins folder.
> - The Authenticate Plugin specifies each provider for "auth" and GrantType as Type, and by writing the authenticate method, the target plugin is selected and the authenticate method is executed.

### 1.Plugin initialization processing
#### <i class="icon-file"></i> [PersoniumCoreApplication.java](https://github.com/personium/personium-core/blob/master/src/main/java/io/personium/core/rs/PersoniumCoreApplication.java)  
　pm = new PluginManager();  
　Generate the PluginManager class.  

### 2.Call authentication process
#### <i class="icon-file"></i> [TokenEndPointResource.java](https://github.com/personium/personium-core/blob/master/src/main/java/io/personium/core/rs/cell/TokenEndPointResource.java)  
Calling authentication process with callAuthPlugins() method.  

---
## Sample implementation

- [personium-plugin-sample](https://github.com/personium/personium-plugin-sample)

The method to be implemented is as follows.  
- getType()
  - Returns the type of Plugin. Currently only "auth".
- getGrantType()
  - Returns the corresponding grant_type value.
- getAccountType()
  - Returns the Type value of the corresponding account.
- authenticate()
  - Authentication processing.

## Procedure for creating plugin

Please refer to [Setup Authentication Plugins](../server-operator/setup_authentication_plugins.md).  
