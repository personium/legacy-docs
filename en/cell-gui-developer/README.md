# Cell GUI developer's Guide

Documents for people who want to develop GUI that manages Personium's Cell


## Cell's GUI
Personium is a PDS server that provides most of its functions in the form of Web API.   
Exceptionally, however, the following three endpoints can be configured to return GUI.  

1. Cell URL (When Accept header with the value 'application/json' is NOT specified.)
1. OAuth 2.0 Authorization endpoint
1. Password change request screen during OAuth 2.0 Authorization process.

These GUIs can be configured to use arbitrary HTML since they should be presented to 
the cell user (owner) under Unit provider's brand or each user's preference.

## Configuration

Both bulk configuration at Unit level and respective configuration at Cell level are available.  
Each Cell's respective setting has the priority over uniform configuration at Unit level.  
If no configuration is present at Cell level, Unit level configuration will be used.  

||Unit Configuration|Cell Configuraion|Note|
|:--|:--|:--|:--|
|[Cell Root URL](../apiref/current/200_Cell_Root.md)|cell.relayhtmlurl.default|p:relayhtmlurl||
|[Authorization Endpoint](../apiref/current/292_OAuth2_Authorization_Endpoint.md)|cell.authorizationhtmlurl.default|p:authorizationhtmlurl||
|[Password Change](../apiref/current/292_OAuth2_Authorization_Endpoint.md)|cell.authorizationpasswordchangehtmlurl.default|p:authorizationpasswordchangehtmlurl||

### Sample GUI
You can get the source program of "home-app (demonstration application)" from following link.  
[home-app](https://github.com/personium/app-cc-home/)



