# Access control model

## ACL
The access control to the access subject by the ACL is done by applying [WebDAV ACL](http://www.ietf.org/rfc/rfc3744) to role based access control.  
By setting the ACL with the ACL method for Cell, Box, Collection, etc., access right to that resource can be set.   
Basically, it conforms to the specification of WebDAV ACL, but this page will explain Personium original specifications.   

ACL settings are defined in XML.   

### ACL component in Personium
The Personium ACL consists of the following elements.   

|Element name|Contents|
|:--|:--|
|ace|Represents an access entity that sets ACLs and a set of their grants|
|pricipal|Define the access subject of the ACL to be set up|
|grant|Define one or more privileges to be given to principal|
|privilege|Define permission settings |

### Limitations
In Personium V1 series, there are the following restrictions.  
* The ACL is updated by overwriting the existing setting  
* Set up deprivation of authority by deny element  
* Acquire a list of authorizations that can be granted  

### Object
The target of ACL setting of Personium is a resource, and it is set by the ACL method to the URL of each resource.  
In the case of a path of a cell, it becomes a cell level ACL, and in case of a path under a box, it becomes a box level ACL.  
These two have different Privileges (authorities) that can be set, and they will not affect each other.  

||Object|Target resource|
|:--|:--|:--|
|Cell Level ACL|Setting to the cell, <br>Control CRUD of cell control object|Cell|
|Box Level ACL|Control CRUD of Box control object|Box, WebDAV collection, ODatacollection, Servicecollection <br>Directory and file under the WebDAV collection|

## ace
The target access agent is defined as a Principal element, and the authorization is defined as a grant element. You can set multiple ace elements.  

### Principal
Although Principal has "human or computational actor" in the WebDAV ACL, it is defined as a role in Personium.   
The role of Personium is a concept close to "Group" in WebDAV ACL.   

#### all
As defined in the WebDAV ACL, setting the all element in pricipal gives the authorization setting, It can also be defined for all roles and unauthorized access agents (without Authorization header).   
Since it is authority for all access agents to the resource, caution is required when using it.   

```
principal:all
privilege:all
```

With the above setting, all operations are released to all accesses accessed.  
**However, if schema authentication level setting is done, that checking will take effect.**  

##### Setting example
Give read access to all access subjects.   

```
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xml:base="http://fqdn/testcell1/__role/box1/"
    xmlns:p="urn:x-personium:xmlns"
    p:requireSchemaAuthz="none">
    <D:ace>
        <D:principal>
            </D:all>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```

#### Role
To define a role for the target access agent, enclose it in an href element and set the role resource URL.  
For specifications on role resources see Role Issue.   

Note that the role resource URL that can be set can not specify a role resource URL different from the cell URL of the ACL setting target.   

##### Setting example
Describe all role resource URLs to be set in Principal  
(Example of giving read and write privileges to doctor attached to box 1 and giving read only to guest attached to box 2)  

```
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:"
    xmlns:p="urn:x-personium:xmlns"
    p:requireSchemaAuthz="none">
    <D:ace>
        <D:principal>
            <D:href>http://fqdn/testcell1/__role/box1/doctor</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
            <D:privilege><D:write/></D:privilege>
        </D:grant>
    </D:ace>
    <D:ace>
        <D:principal>
            <D:href>http://fqdn/testcell1/__role/box2/guest</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```

Omission of description by xml: base  
By describing the role resource URL up to the box in the xml: base attribute of the acl element, omit the description of the role resource URL set in Principal can do.  
(Example of giving read and write privileges to doctor attached to box 1 and giving read only to guest attached to box 2)  

```
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xml:base="http://fqdn/testcell1/__role/box1/"
    xmlns:p="urn:x-personium:xmlns"
    p:requireSchemaAuthz="none">
    <D:ace>
        <D:principal>
            <D:href>doctor</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
            <D:privilege><D:write/></D:privilege>
        </D:grant>
    </D:ace>
    <D:ace>
        <D:principal>
            <D:href>../box2/guest</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```

\* Like guest, when setting a role attached to a box different from the xml: base box, it is possible to describe relative paths as described above.  

#### Output with PROPFIND
When outputting the ACL setting with PROPFIND, the xml: base attribute is output as follows.  
* In the case of PROPFIND to a cell, the URL of the main box  
* In the case of PROPFIND under Box, the URL to that Box  

### grant/Privilege
The authority is set with the element defined by Personium, and set by enclosing it in the Privilege element in the grant element.  
In addition, you can specify multiple Privilege elements in the grant element.  

#### Cell Level ACL Privilege
For the set cell, specify execution authority of the cell control object and execution authority of the method.  
When the authority located at the higher level is set, it has the authority belonging to the lower rank. (Eg message has the authority of message-read)  

|Authority name|Target cell control object|Top authority name|Methods that can be executed|
|:--|:--|:--|:--|
|root|It has all the authorities below |-|All|
|auth|Account, Role, ExtRole|root|PUT, POST, DELETE, GET, OPTIONS|
|auth-read|Account, Role, ExtRole|auth|GET, OPTIONS|
|message|RecievedMessage, SentMessage|root|POST, DELETE, GET, OPTIONS|
|message-read|RecievedMessage, SentMessage|message|GET, OPTIONS|
|event|event|root|PUT, POST, DELETE, GET, OPTIONS|
|event-read|event|event|GET, OPTIONS|
|log|log|root|PUT, POST, DELETE, GET, OPTIONS|
|log-read|log|log|GET, OPTIONS|
|social|Relation, ExtCell|root|PUT, POST, DELETE, GET, OPTIONS|
|social-read|Relation, ExtCell|social|GET, OPTIONS|
|box|Box|root|PUT, POST, DELETE, GET, OPTIONS|
|box-read|Box|box|GET, OPTIONS|
|box-install|Box|box|MKCOL(Barfileinstallation)|
|box-export|Box|root|GET(Barfileexport) * Not supported|
|acl|Cell|root|ACL|
|acl-read|Cell|acl|Display of ACL setting of PROPFIND|
|propfind|Cell|root|PROPFIND|
|rule|Rule|root|POST,DELETE,GET,OPTIONS|
|rule-read|Rule|rule|GET,OPTIONS|

##### Setting Example

```
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns"
    xml:base="https://example.com/cell/box">
    <D:ace>
        <D:principal>
            <D:href>role10</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><p:root/></D:privilege>
        </D:grant>
    </D:ace>
    <D:ace>
        <D:principal>
            <D:href>../box2/role13</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><p:social/></D:privilege>
        </D:grant>
    </D:ace>
    <D:ace>
        <D:principal>
            <D:href>role15</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><p:acl/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```

#### Box level ACL Privilege
Specify the execution authority of the method for the resources below the set box.  
Box level Privilege is basically defined along WebDAV ACL.  
When the authority located at the higher level is set, it has the authority belonging to the lower rank.(Example: read also has the authority of read-properties)  

|Authority name|Target cell control object|Top authority name|Methods that can be executed|
|:--|:--|:--|:--|
|all|It has all the authorities below |p:root|All|
|read|Has read permission. It does not include read-acl.|all|GET, OPTIONS|
|write|Has write authority. It does not include write-acl.  |all|PUT, POST, DELETE, MKCOL|
|read-properties|Has the right to read properties.|read|PROPFIND|
|write-properties|Have authority to write properties. |write|PROPPATCH|
|read-acl|It has read authority of ACL. |all|Display of ACL setting of PROPFIND|
|write-acl|Has authority to write ACL. |all|ACL|
|write-content|Has authority to write content.|write|*Notsupported|
|bind|Has bind authority.|write|*Notsupported|
|unbind|Has unbind authority. |write|*Notsupported|
|exec|Has service execution authority. * Personium original implementation|all|-|

##### Setting Example

```
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xml:base="http://fqdn/testcell1/__role/box1/"
    xmlns:p="urn:x-personium:xmlns"
    p:requireSchemaAuthz="none">
    <D:ace>
        <D:principal>
            <D:href>doctor</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
            <D:privilege><D:write/></D:privilege>
        </D:grant>
    </D:ace>
    <D:ace>
        <D:principal>
            <D:href>../box2/guest</D:href>
        </D:principal>
        <D:grant>
            <D:privilege><D:read/></D:privilege>
        </D:grant>
    </D:ace>
</D:acl>
```

## ACL inheritance
For box level ACL setting, the setting of the parent (upper directory) of the accessed resource is applied back to the cell.  
The ACL setting for the access subject is inherited in the form in which the parent setting is added.  
Therefore, the following points need to be noted when setting ACL.  
* When strong permission of all etc. etc is set for parent, even if restriction is applied to child, it becomes invalid  

### Examples of ACL inheritance and applied privileges
Exampleresource  

|Resource type|Resource name|Resource URL|
|:--|:--|:--|
|Cell|cell|https&#58;//fqdn/cell|
|Box|box|https&#58;//fqdn/cell/box|
|WebDAV Collection|webdav|https&#58;//fqdn/cell/box/webdav|
|Directory|directory|https&#58;//fqdn/cell/box/webdav/directory|
|File|file|https&#58;//fqdn/cell/box/webdav/directory/file|

After applying the following ACL setting to the above resource, the authorities applied when accessing each resource are as follows.  

|Resources to access|Permission set|Applicable authority|
|:--|:--|:--|
|Cell|auth-read|auth-read|
|Box|read-acl|auth-read, read-acl|
|WebDAV Collection|read|auth-read, read-acl, read|
|Directory|nosettings|auth-read, read-acl, read|
|File|read-propaties|auth-read, read-acl, read-properties, read|

## Schema authority request level
For access control to the application according to the schema authority request level, the request level is set by the RequireSchemaAuthz attribute of the ACL element at the time of setting the ACL.  
For schema authentication specifications, see "Schema authentication (application authentication)" in the authentication model.  

### Setting value
Schema privilege request level value  

|Level value|Contents|
|:--|:--|
|none(Default)|Accessible without schema authentication |
|public|Accessible if schema authentication result is OK  |
|confidential|When the schema authentication result is OK and the special role confidentialClient is available|

#### Setting Example
Sample Schema Privilege Request Level Setting ACL  

```
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xml:base="http://localhost:8080/testcell1/__role/box1/"
    xmlns:p="urn:x-personium:xmlns"
    p:requireSchemaAuthz="{レベル値}">
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

### Inheritance of schema authority request level setting
The schema authority request level setting is applied by setting the parent (upper directory) of the accessed resource back to the box only when the accessed resource is not set.  
If the schema authority request level is not set, it is treated as none, but it is not inherited if explicitly set to none.  
Inheritance is confirmed back to the Box, but when the schema level setting is performed on the intermediate resource, the setting value becomes effective.  

#### Schema privilege Request level inheritance and example of authority to be applied
The schema authority request level applied when accessing each resource after setting the following schema authority request level to the above resource is as follows.  

Example resource  

| Resource type | Resource name | Resource URL|
|:--|:--|:--|
| Cell| cell| https&#58;//fqdn/cell |
| Box | box | https&#58;//fqdn/cell/box |
| WebDAV Collection | webdav| https&#58;//fqdn/cell/box/webdav|
| Directory | directory | https&#58;//fqdn/cell/box/webdav/directory|
| File| file| https&#58;//fqdn/cell/box/webdav/directory/file |

After applying the following ACL setting to the above resource, the authorities applied when accessing each resource are as follows.  

| Resources to access | Set level| Applicable level|
|:--|:--|:--|
| Box | confidential | confidential|
| WebDAV Collection | public | public|
| Directory | no settings| public|
| File| none | none|
