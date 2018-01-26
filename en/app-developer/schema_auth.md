# Schema authentication
## What is Schema authentication?
When Personium Box utilizes some kind of service that utilizes data associated with individuals, an entity that owns Cells,
It includes implementations aimed at providing a mechanism that prevents other services from illegally accessing or modifying the data.

Therefore, there is provided a framework of authentication "to make it impossible for owner of authority to operate certain Box to access other Box with the same token"
Personium calls it **Schema authentication**. (Although it may be described as application authentication for intuitive understanding, it is assumed to be an unofficial term)

Since the Schema authentication API is prescribed in the framework of client authentication in OAuth 2.0,
It can be implemented only by adding ClientID and ClientSecret as parameters at the time of authentication.

```
    A client application consisting of multiple components, each with its
    own client type (e.g. a distributed client with both a confidential
    server-based component and a public browser-based component), MUST
    register each component separately as a different client to ensure
    proper handling by the authorization server.
```

## Setting for Schema authentication
### Overview
In order for an application to access data in a Box, normally, authentication is first performed with a Target specification as an application client in a central cell (application Cell) managed by a service provider, and <br>
After that, by executing Schema authentication by designation of normal ID / PW, ClientID, ClientSecret, a token that accesses only that Box is issued.

Alternatively, when updating the expiration date using RefreshToken acquired when executing normal ID / PW authentication, you can issue TransCell token by specifying ClientID · ClientSecret as described above. (V1.5.2 or later)

### premise
In order to perform Schema authentication, the following cells are mandatory. <br>
· {Appcell}: application cell (schema authentication cell)
· {Cell}: User cell

### Flow of authentication
In Personium, we perform <br> Schema authentication (application authentication) by tying a special role (`{issuerUrl} + / __ role / __ / confidentialClient`) to the application's account. (Schema authentication level `confidential`)
User authentication and schema authentication are evaluated together by performing user authentication by including schema authentication information in `client_id` and` client_secret` at the time of user cell authentication.

## Schema authentication procedure
### App authentication information setting to the application cell

Create an account on the app store (normal account creation)
Creating roles (normal role creation)
Creating a role is optional. Executed only when performing the top level schema authentication (Confidential Client)
Connecting accounts and roles (normal association process)
For the same reason as creating a role,

### Schema authentication level setting for user cell collection
Configure schema authentication level using ACL.

Sample Schema Authentication Configuration ACL

```
<D:acl xmlns:D="DAV:" xml:base="https://demo.personium.io/cell/__role/box/"
xmlns:p="urn:x-personium:xmlns"
p:requireSchemaAuthz="{Schema authentication level}">
    <D:ace>
        <D:principal>
            <D:all/>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
            <D:privilege><D:write/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```
#### Possible Values for Schema Authentication Level

| Level value | Contents |
|: - |: - |
| none | accessible without schema (default) |
| public | accessible if schema is present |
| confidential | accessible if schema has special role confidentialClient |

### Authenticating with an applet
Acquire transcell token for data cell by authenticating to application cell from application
Here, normal password authentication

### Authentication with User Cell
We perform normal password authentication from the Personium application to the user cell and at the same time authenticate by adding the transit token received from the application cell to the client_secret and the URL of the <br> application cell to the client_id.
Check `issuer` and` client_id` in client_secret, and if they match, give schema information (URL) to the access token to be issued.
Check the role (`AttributeStatement \ Attribute \ AttributeValue`) in client_secret and if the <br> role is a special value (` {issuerUrl} + / __ role / __ / confidentialClient`) Give c (a sign that it is conficential).

```
curl - X POST '{UnitURL} / {cell}} / __ auth' - d \
'grant_type = password & username = user & password = pass & client_id = {UnitURL} / {appcell} / & client_secret = {trancel token received from the application cell}
```

### Data access control for boxes and collections
Check the schema authentication information of the access token when accessing the box and collection and the schema set in the <br> box (the box to which the access destination belongs in the collection).

Schema of the box / collection to access Compares the authentication level setting with the schema information of the access token, and rejects access if it does not match the <br> level setting.

· None => Do not perform schema authentication check

· Public => Perform schema authentication check and make it accessible if schema authentication is done

· Confidential => Perform schema authentication check and make it accessible if there is a special role (confidentialClient)

Compare the schema value of the accessed box with the schema value of the access token, and deny access if the values ​​are different.
