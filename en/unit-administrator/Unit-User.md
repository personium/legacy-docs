# Unit User
## What is a Unit User?
A unit user is an entity that operates a unit level API such as CRUD of a cell.  
The unit user performs API access using a unit user token (Unit User Token (UUT)) or a unit master token (Unit Master Token (UMT))

## Unit-level access control model

Unit-level API's handling Cell creation and deletion are the same as other API's in the sense that 
they identifies the accessing entity by using OAuth 2.0 Bearer tokens. 

In other words, accessing entity can be authenticated and identified by sending a retrieved token using HTTP Authorization header as follows, 

```
Authorization: Bearer unitLevelAccessToken
```

On the other hand, the access control model for the Unit-level API's and operating Unit Users are totally different from the one for users authentiated at a normal Cell accessing to the Cell itself or visiting other Cells.

The only following two kinds of tokens are recognized in the Unit-level API's;

* Unit User Token (UUT)
* Unit Master Token (UMT)

When using these tokens, Cell-level or Box-level ACL is not taken into consideration at all.
Also, cross-Unit access is not allowed unlike Cell-level API access using Trans-Cell Tokens.

### Unit Master Token (Unit Master Token (UMT))

Unique token in the unit, accessing with this token will be treated as Unit Admin.  
Set arbitrary character string to "io.personium.core.masterToken =" in personium-unit-config.properties.  
By specifying an arbitrary character string in the X-Personium-Unit-User header, it is also possible to move as a unit user whose unit user name is the character string.

An example

Create a cell with the unit user name of {UnitURL}/{UnitUserName} as its owner

```sh
curl "{UnitURL}/__ ctl/Cell" - X POST \
-H "Authorization: Bearer token" \
-H "X-Personium-Unit-User: {UnitURL}/{UnitUserName}" \
-d '{"Name": "cell1"}'
```

Get cell list with unit user name "{UnitURL}/{UnitUserName}" as its owner

```sh
curl "{UnitURL}/__ ctl/Cell" - X GET \
-H "Authorization: Bearer token" \
-H "X-Personium-Unit-User: {UnitURL}/{UnitUserName}"
```

### Unit User Token (Unit User Token (UUT))

UUT is a Bearer token of OAuth 2 based on the SAML Assertion with the following information.

| Element/attribute name | Contents |
|:--|:--|
| IssueInstant | Authentication time |
| issuer | URL admitted by the unit. <br> describe arbitrary URLs allowed in "io.personium.core.unitUser.issuers =" in personium-unit-config.properties |
| Subject \ NameID | unit user name. Any string. |
| audience | Unit root URL |
| attribute | Unit User Role |


The access agent issuing this token is called a unit user, and the authentication process that issues such SAML assertion is called unit user authentication.

Also, the transcell token issued by giving the root URL of the unit to p_target in the Account authentication in the cell satisfies the requirements of the UUT,
By including the URL of a specific cell in the setting of the unit, the cell can be a UUT issuer.

An example  
When issuing a UUT in a cell  
Set `io.personium.core.unitUser.issuers={UnitURL}/{Cell}/` in personium-unit-config.properties

```sh
curl "{UnitURL}/{Cell}/__ token" -X POST \
-d 'grant_type = password & username = user & password = pass & p_target = {UnitURL} /'
```

io.personium.core.unitUser.issuers can set multiple URLs.

UUT usually does not have access authority other than CRUD of Cell.
When you want to manipulate the contents of Cell, it is necessary to give unit user role (CellContentsReader, CellContentsAdmin) to be described later.


### Unit User Token (Unit User Token (UUT))
UUT plays a big role when providing Personium as a service, but Personium can operate with only UMT without using UUT.  
The biggest motivation for service providers to use UUT is to manage billing destinations of cells at once.  
That is, by having the service provider issue a different UUT to each customer himself and using this to access the cell CRUD API, the following is realized.

     When creating a cell, a cell is created with information that it is owned.
     When searching for a cell, it is not searched except for the cell it created.
     When deleting a cell, deletion other than the cell created by itself fails.

On the other hand, if an individual or organization has its own dedicated unit, all the cells created in that unit will be managed by himself, so the above function is unnecessary.  
In that case, you can use UMT instead of UUT for operation.

Unit users have identifiers, which are called unit user names.  
The unit does not have a unit user name management mechanism, and it assumes the existence of an external management mechanism.

![unituser](./images/unituser.png)


## Type of a Unit User

### Unit Admin

Users who can operate units

### Unit User

A user who can perform operations on the cell whose owner matches.  
When searching the cell, only the cell whose owner matches can be searched

### Owner attribute of unit level control entity (cell)

A unit control object "cell" has a hidden attribute called owner.  
The hidden attribute can not be retrieved the content from the OData format API, but it is an attribute that exists in all cells.  

The owner can not change after setting it at cell creation.


## Unit User Role

When specific strings are configured in the attribute elements of the Unit User Token, 
Personium Unit recognizes them as roles of the Unit User. 
They are called Unit User Roles.
(If other strings are configured, they are just ignored.) 

If a cell is created for the purpose of unit administration and it is configured as one of the issuers of the Unit User Tokens,  
a Unit User Token with Unit User Roles can be issued by creating roles with Unit User Role name not bound to a box and link them to an account.

Following Unit User Roles can be used.

#### UnitAdmin Role

    {UnitURL}/{Cell}/__role/__/UnitAdmin

If the UnitAdmin role is granted, that user becomes Unit Admin.  
In V 0, the master token was abused for various unit management tasks, but such operation is undesirable from the viewpoint of security. <br>
For various unit management tasks, API calls should be made using the token of this role.

* Caution) [v1.6.3 and before spec is different](#ref163)

#### CellContentsReader Role

    {UnitURL}/{Cell}/__role/__/CellContentsReader

If the CellContentsReader role has been granted, the Unit User Token for that user has read permission on the contents of Cell.  

* Caution) [v1.6.3 and before spec is different](#ref163)


#### CellContentsAdmin Role

    {UnitURL}/{Cell}/__role/__/CellContentsAdmin

If the CellContentsAdmin role has been granted, the Unit User Token for that user has read and write permissions on the contents of Cell.  
By assigning "UnitAdmin role" and "CellContentsAdmin role" to the unit user, the Unit User Token of that user becomes equivalent to the Unit Master Token.

* Caution) [v1.6.3 and before spec is different](#ref163)

<a name="ref163"></a>
## Spec of Version 1.6.3 and before

### Unit User Roles

* The only role available in Version 1.6.3 and before spells as following, with the first letter in the lower case.  

    {UnitUserName}/\_\_role/\_\_/unitAdmin

* CellContentsReader, CellContentsAdmin roles do not exist.
* Unit User has all privileges against the Cells it created. (Equivalent to CellContentsAdmin role)
* Unit Admin has all privileges over all Cells on the unit.

### Limitation on X-Personium-Unit-User header

* X-Personium-Unit-User header is not valid except when Unit Master Token is used.
* X-Personium-Unit-User is not valid even when the unit user is assigned unitAdmin role.
