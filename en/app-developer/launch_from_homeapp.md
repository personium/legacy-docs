# Launch application from Home application

There are various forms of Personium applications, but here we will explain about the applications launched from the most standard Home application.  

+ Parameters passed at application startup
+ Processing to be done after launching the application

Caution: Personium core version 1.6.9 or above required

## Parameters passed at application startup

The application launcher of the home application executes the application by calling the following URL.  

    {AppUrl}#cell={cellUrl}

Example

    myapp-custom-scheme://#cell=https://demo.personium.io/john.doe/
    https://some.svr.example/my-app/index.html#cell=https://pds.personium.example/john.doe/

## Steps after launching the application

The actual process of application development depends on the implementation method of the application (Android application, HTML5 application, iOS application, etc.) and the implementation language, but the flow to be done after the application is started is the same.  

1. Receive Cell URL from startup URL
1. App authentication is performed according to the procedure of OAuth2 code flow
1. Receive access token
1. Get the URL of Box
1. Access various resources under the Box

### Receive necessary parameters from startup URL

The Personium App launched from the Home App launcher will be launched with some launch URL. The startup URL may start with https or it may start with some custom scheme. Generally, an application launched with a custom scheme URL can acquire the URL which was launched by itself. If it is a URL starting with https, the browser will start up, but even browser application can get the URL it was launched. First of all, please obtain the start URL in each implementation.  

Parsing # from the startup URL that could be acquired next and acquire the cell, refresh_token parameter.  

|Item|Overview|
|:--|:--|
|cell|User Cell URL to be targeted|

These parameters are needed in the subsequent process.

### App authentication is performed according to the procedure of OAuth2 code flow

` This chapter is in the middle of writing. Please wait for a moment. `

In order to prove the validity of your application to the user Cell, we obtain an application authentication token. This is security for protecting your application and user Cell from attacks from malicious applications such as phishing apps.  

You can obtain the application authentication token by sending the ID / password of the application to the Token endpoint of the application Cell. Specifically, I will POST the following information.

    grant_type=password&p_target={User Cell URL}&username={Application ID}&password={Application Password}

Only your application knows the application ID and application password. To set these as an endpoint of the application Cell from your application, you can obfuscate and embed it in the code, and you may ask the server to issue the above request from some server. It is a good idea to put Engine script on the application Cell and realize this. In the case of obfuscating and embedding, it is impossible to completely prevent leakage of application ID and application password due to reverse engineering by an attacker, although there is a certain deterrent by obfuscation.  

In any case, the "authentication_token" item of the authentication success response JSON for this request is "application authentication token". Please parse JSON and get it.  

Reference: http://personium.io/docs/en/apiref/current/293_OAuth2_Token_Endpoint.html

### Receive access token

You will receive an access token as your App for the User Cell.  

1. Application authentication token
1. Refresh token  

This time POST the following information to Token end point of user Cell.  

    grant_type=refresh&refresh_token={refreshToken}&client_id={Applecation CellURL}&client_secret={Application authentication token}

The "access_token" item in the response JSON returned here is the access token for your application to the target user Cell.

### Get the URL of Box

Use the following API to get the URL of Box which is the area for your application on target user Cell.  

Reference: http://personium.io/docs/en/apiref/current/304_Get_Box_URL.html

At this time, please specify the access token acquired in the Authorization header.  

    Authorization: Bearer {access_token}

In this way, you can see which URL is the root to access the data.

### Access various resources under the Box

You, as an application developer, should know about the structure under Box for your app on target user Cell. Use the Box level API (WebDAV, OData) for data access to access various resources under Box.
