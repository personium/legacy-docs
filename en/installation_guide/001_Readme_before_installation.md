Please read following information before using Personium.

## HTTPS is a MUST
Use of HTTPS is a MUST for a production use. Most of Personium unit API's are protected 
by its access control mechanism. They should be accessed with a OAuth 2.0 Bearer token.

Use of HTTP exposes the token to attackers who try to steal and use it for spoofing.

See https://tools.ietf.org/html/rfc6750


## Unit Master Token / Unit User Token
Unit Master Token and Unit User Token are tokens with special privilage.
You can execute all api operation with them. (ACL settings will be ignored)
So, you need special care using these tokens. 

Especially, Unit Master Token is dangerous. It is designed for use in 
evaluation, development or testing phase only. Do not forget to disable it for 
production use.

## Status API

This endpoint is designed for administrative access from internal network.
(no authentication /access control) so should be hidden with reverse proxy.

Below are configuration example for nginx

```
location ~ ^/__status/?$ {
    deny all;
}
```

## Domain and URL

### Transefer original request URL and uri scheme
In case using a reverse proxy, please make sure that it passes Personium's original host header and URL scheme.

Below are configuration example for nginx

```
            proxy_set_header Host $http_host;
            proxy_set_header X-Forwarded-Proto http;
```
### Keep domain name
Because of its distributed architecture, Personium stores URL information including domain name.
Please keep domain name after you start using Personium.

Use of unitlocal: scheme is recommended for future FQDN change of units.

### Personium Unit URL

Please make sure that Personium unit URL is "https&#58;//{domainname}/". (not "https&#58;//{domainname}/{subdir}/")


When you need to deploy personium-core to sub-directory of the application server,
you need to rewrite URL using reverse proxy.


## personium-engine deployment

You can deploy personium-engine on same server with personium-core, or different server.
For either case, please make sure that

 - personium-core can send http request to personium-engine server
 - personium-engine can resolve domainname and send http request to the endpoint of the Personium with domain name.
