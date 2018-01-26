# Authentication model
Personim use the OAuth2 Authorization Framework, the industry standard, to allow many types of application to access resources on Personium in secure way.

In addition, Personium provides authorization flow based on the trust between cells.

## Access Token
To let client access to the resource, access token is required.
There are two types of access token and refresh token. Trans-cell token is used for the authorization based on the trust between cells.

|Token Type|Description|Expiration Date|
|:---------|:----------|:---------|
|Cell local Token|Access token valid in the cell which issued the token.|1 hour|
|Trans-cell Token|Access token valid in the target cell which is specified by the issued cell.|1 hour|
|Refresh Token|Token used for refreshing the token which already issued|24 hour|

##### Note
* To accept trans-cell token, configuration ("external cell", "relation", "external role"...etc) is required.
* To accept trans-cell token issued by the different server, X509 certificate need to be signed by same CA as issued server.

## Grant Flow

Before initiating flow, please [register client](./004_Client_auth.md) if client authentication is required.

#### Resouce Owner Password Credentials Grant

1.Client send requests to the token endpoint of the cell which contain the resource with following.
  * Username and Password of the account used for authentication,in the request body.
  *  Client authentication information with authorization header or in request body.

2.As a response, access token with refresh token will be returned.

##### Note
 For Resource Owner Password Credentials, it is also possible to allow access from non-registered client.

## Implicit Grant

1.Browser send GET request to the authorization endpoint of the cell with redirect uri defined in client registration and required parameters.Then, endpoint returns HTML Page which contains the login form.
2.Resource owner provide account name and password to the form and press login. Then, the browser send POST request to the authorization endpoint.
   The endpoint returns redirection response to the redirect uri with access token in fragment.
3.Browser follows redirection and access to redirection uri and retrieve HTML with embedded script.
4.Browser execute embedded script and extract the token.

##### Note
You can modify look & feel of the form by editing  core/src/main/resources/html/authform.html.

## Exchange Token
By Sending the trans-cell token to the token endpoint of the target cell, the cell local token valid in the cell will be returned.


## Refresh Token
To refresh token, send refresh token to the token endpoint. Then, new token and refrsh token will be returned.
It is possible to refresh the token if access token is not expired.
