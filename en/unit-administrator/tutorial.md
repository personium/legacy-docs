**\* This document is intended for those who use Personium Version 1.6.15 or later.**
# Personium Unit management tutorial
##### [1. About this document](#sect1)
##### [2. Who should read this document?](#sect2)
##### [3. Overview of Unit, Cell, and Box](#sect3)
##### [4. About token](#sect4)
##### [5. Issue PDS to Users](#sect5)
##### 　　[5-1. Create a Cell](#sect5.1)
##### 　　[5-2. Create an Administrator Account for a Cell](#sect5.2)
##### 　　　　[5-2-1. Create an Account](#sect5.2.1)
##### 　　　　[5-2-2. Create a Role](#sect5.2.2)
##### 　　　　[5-2-3. Link an Account and a Role](#sect5.2.3)
##### 　　　　[5-2-4. Configure the ACL](#sect5.2.4)
##### 　　[5-3. Store the First Data in the Main Box](#sect5.3)
##### 　　　　[5-3-1. Store profile.json](#sect5.3.1)
##### 　　[5-4. Assign a default operating screen for user](#sect5.4)
##### 　　[5-5. Using the GUI](#sect5.5)
##### [6. Delete the Issued PDS](#sect6)
##### [7. Try a demo video of GUI operation](#sect7)
##### [8. Automated PDS Creation](#sect8)

## <a name="sect1">1. About this document</a>
This document will explains the detailed procedures so that even a first-time user can quickly manage the Personium Unit.  

Since all the functions of Personium Service are provided as REST API, it is OS and programming language independent.  
A sample source using javascript is released, please feel free to use them.  

* [MinimalApp](https://github.com/personium/template-app-cell) … Personium's "Hello, World!" app.
* [MyBoard](https://github.com/personium/app-myboard) … Personium app that demonstrates ACL management and data enquiry/approval.

[cURL](https://curl.haxx.se/) is used for all samples that call API in this tutorial.

## <a name="sect2">2. Who should read this document?</a>

The intended audience of this document is a first-time user of Personium Service.
Prerequisite Knowledge:

* Basic knowledge of the Internet
* Basic knowledge of Representational State Transfer (REST)
* Basic knowledge of the operating system to be used

## <a name="sect3">3. Overview of Unit, Cell, and Box</a>
I extracted keywords that should be kept at the minimum in using "Personium".
It will be a keyword that will appear many times even in this tutorial.

|Keyword<br>|Overview<br>|
|:--|:--|
|Unit<br>|The data area composed of Multiple Cells on the personium server.<br>It has a fully qualified domain name (UnitFQDN) that is referred to as the absolute domain name.<br>|
|Cell<br>|Data Strore for each data subject. PDS (Personal Data Store) is used for personal use.<br>In "Personium", since we are modeling the notion of data subjects not only for people but also organizations and objects,<br>we can also use it as a data store for organizations and goods.<br>(Eg My Cell, Your Cell, Cell of xx Company, Cell of xx Department, Cell of My Car)<br>|
|Box<br>|The area that stores the data used for the application. The Box itself is also a WebDAV collection. <br>It has a unique name and schema URL.<br>Cell has one Box (main Box) in its initial state and can not be deleted.<br>|

## <a name="sect4">4. About token</a>

In this document, we use unit master token or unit user token for operation of Personium unit.
For details of unit master token and unit user token, please refer to [here](Unit-User.md).  

Refer to [here](../server-operator/Confirm_environment_settings.md) for how to check the unit master token of the environment constructed using Ansible and the account name / password of the unit user.
Please check with your server software administrator if you have created your own environment.

>**[Note]**
>**Since the information acquired here is the initial value, if you change it, please manage by yourself.**

## <a name="sect5">5. Issue PDS to Users</a>
This series of API operations will be automated by a program in the actual Personium Service operation, but these tutorials show how to manually perform these operations step by step.

### <a name="sect5.1">5-1. Create a Cell</a>
Create an empty Cell (PDS).

Before creating a new additional Cell, confirm the status using the Cell_List_Acquisition_API in advance.  
In the Personium Unit immediately after construction, only cells for Unit management are registered.

```sh
curl "https://{Personium_FQDN}/__ctl/Cell" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {master_token}"
```

One cell information for Unit management returns to the response.  
This state is the initial state of the Personium Unit.

```json
{
	"d": {
		"results": [
			{
				"__metadata": {
					"uri": "https:\/\/jp-west-1-dev-2034289.k5personium.cloud\/__ctl\/Cell('unitadmin')",
					"etag": "W\/\"1-1537265056908\"",
					"type": "UnitCtl.Cell"
				},
				"Name": "unitadmin",
				"__published": "\/Date(1537265056908)\/",
				"__updated": "\/Date(1537265056908)\/"
			}
		]
	}
}
```

Now, actually create a Cell.
When calling the Cell_Create_API, specify the desired Cell name.  
In this example, "usercell" will be the Cell name.
>**[Note]**  
>**The root URL of the Cell is released.**  
>**Note that if your email address, etc. is used in the Cell name as-is, the presence will be determined by the response, so caution is necessary.**

```sh
curl "https://{Personium_FQDN}/__ctl/Cell" \
-X POST -i -k \
-d "{\"Name\":\"usercell\"}" \
-H "Authorization:Bearer {master_token}"
```

If successful, the information of the Cell created at this point is returned in the response.

```json
{
	"d": {
		"results": {
			"__metadata": {
				"uri": "https://{Personium_FQDN}/__ctl/Cell('usercell')",
				"etag": "W\/\"1-1539241336221\"",
				"type": "UnitCtl.Cell"
			},
			"Name": "usercell",
			"__published": "\/Date(1539241336221)\/",
			"__updated": "\/Date(1539241336221)\/"
		}
	}
}
```

If you call the Cell List Retrieval API again, the state that "usercell" is added is returned to the response.

```json
{
	"d": {
		"results": [
			{
				"__metadata": {
					"uri": "https:\/\/jp-west-1-dev-2034289.k5personium.cloud\/__ctl\/Cell('unitadmin')",
					"etag": "W\/\"1-1537265056908\"",
					"type": "UnitCtl.Cell"
				},
				"Name": "unitadmin",
				"__published": "\/Date(1537265056908)\/",
				"__updated": "\/Date(1537265056908)\/"
			},
			{
				"__metadata": {
					"uri": "https:\/\/jp-west-1-dev-2034289.k5personium.cloud\/__ctl\/Cell('usercell')",
					"etag": "W\/\"1-1539241336221\"",
					"type": "UnitCtl.Cell"
				},
				"Name": "usercell",
				"__published": "\/Date(1539241336221)\/",
				"__updated": "\/Date(1539241336221)\/"
			}
		]
	}
}
```

### <a name="sect5.2">5-2. Create an Administrator Account for a Cell</a>
Accounts refer to the users belonging to a particular Cell and are retained using the account name and password information.  
Multiple accounts can be registered for one Cell.

#### <a name="sect5.2.1">5-2-1. Create an Account</a>
Create an Account in the Cell created in the previous section.

Before creating additional accounts, confirm the status using the Account_Acquire_List_API in advance.  
The Cell immediately after creation has no accounts registered.

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Account" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {master_token}"
```

The state where there is no account information is returned in the response.
```json
{
	"d": {
		"results": []
	}
}
```

Now, create an account.  
When calling the Account_Create_API, specify the desired account name.  
In this example, "me" will be the account name, and "password" will be the account password.

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Account" \
-X POST -i -k \
-d "{\"Name\":\"me\"}" \
-H "X-Personium-Credential:password" -H "Content-Type: application/json" -H "Authorization:Bearer {master_token}"
```

If successful, the information of the account created this time is returned in the response.
```json
{
	"d": {
		"results": {
			"__updated": "/Date(1484724933394)/",
			"__published": "/Date(1484724933394)/",
			"Cell": null,
			"Type": "basic",
			"LastAuthenticated": null,
			"Name": "me",
			"__metadata": {
				"type": "CellCtl.Account",
				"etag": "W/\"1-1484724933394\"",
				"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')"
			}
		}
	}
}
```

Call the Account_Acquire_List_API again, and the state where "me" exists is returned in the response.

```json
{
	"d": {
		"results": [
			{
				"_ReceivedMessageRead": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')/_ReceivedMessageRead"
					}
				},
				"__metadata": {
					"type": "CellCtl.Account",
					"etag": "W/\"1-1484724933394\"",
					"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')"
				},
				"Name": "me",
				"LastAuthenticated": null,
				"Type": "basic",
				"Cell": null,
				"__published": "/Date(1484724933394)/",
				"__updated": "/Date(1484724933394)/",
				"_Role": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')/_Role"
					}
				}
			}
		]
	}
}
```

#### <a name="sect5.2.2">5-2-2. Create a Role</a>
Create a role for the Cell for which an account was created in the previous section.  
Roles set and retain the Cell access privileges based on functions such as administrator, teacher, and student.

Before creating an additional role, confirm the status using the Role_Acquire_List_API in advance.  
The Cell immediately after creation has no role registered.

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {master_token}"
```

The state where there is no role information is returned in the response.

```json
{
	"d": {
		"results": []
	}
}
```

Now, create a role.  
When calling the Role_Create_API, specify the desired role name.  
In this example, "adminrole" will be the role name.

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role" \
-X POST -i -k \
-d "{\"Name\":\"adminrole\"}" \
-H "Accept:application/json" -H "Authorization:Bearer {master_token}"
```

If successful, the information of the role created this time is returned in the response.

```json
{
	"d": {
		"results": {
			"_Box.Name": null,
			"__updated": "/Date(1484728984079)/",
			"__published": "/Date(1484728984079)/",
			"Name": "adminrole",
			"__metadata": {
				"type": "CellCtl.Role",
				"etag": "W/\"1-1484728984079\"",
				"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)"
			}
		}
	}
}
```

Call the Account_Acquire_List_API again, and the state where "adminrole" exists is returned in the response.

```json
{
	"d": {
		"results": [
			{
				"_Relation": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_Relation"
					}
				},
				"_ExtRole": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_ExtRole"
					}
				},
				"__metadata": {
					"type": "CellCtl.Role",
					"etag": "W/\"1-1484728984079\"",
					"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)"
				},
				"Name": "adminrole",
				"_Box.Name": null,
				"__published": "/Date(1484728984079)/",
				"__updated": "/Date(1484728984079)/",
				"_Box": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_Box"
					}
				},
				"_Account": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_Account"
					}
				},
				"_ExtCell": {
					"__deferred": {
						"uri": "https://{Personium_FQDN}/usercell/__ctl/Role(Name='adminrole',_Box.Name=null)/_ExtCell"
					}
				}
			}
		]
	}
}
```

#### <a name="sect5.2.3">5-2-3. Link an Account and a Role</a>
Associate the created account and role.  
The account and role created above belong to the same Cell, but are independent of each other, having no direct relationship.

Before starting operations, confirm the status using the Role_$links_Acquire_List_API in advance.  
The role is in the state immediately after creation and has no exclusive links with the account.

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role('adminrole')/\$links/_Account" \
-X GET -i -k \
-H "Accept:application/json" -H "Authorization:Bearer {master_token}"
```

The state where the role has no relationship information is returned in the response.

```json
{
	"d": {
		"results": []
	}
}
```

Now, call the Role_$links_Register_API and create a link with the account.  
(Calling the Account_$links_Register_API for the role as the operation in the opposite direction yields the same result)

```sh
curl "https://{Personium_FQDN}/usercell/__ctl/Role('adminrole')/\$links/_Account" \
-X POST -i -k \
-d "{\"uri\":\"https://{Personium_FQDN}/usercell/__ctl/Account('me')\"}" \
-H "Accept:application/json" -H "Authorization:Bearer {master_token}"
```

This API does not return a json format response (body).  
If the status code 204 is returned, processing was successful.

```
HTTP/1.1 204 No Content
```

When you call the Role $links list retrieval API again, the information of the account associated with (to role) is returned to the response.

```json
{
	"d": {
		"results": [
			{
				"uri": "https://{Personium_FQDN}/usercell/__ctl/Account('me')"
			}
		]
	}
}
```

#### <a name="sect5.2.4">5-2-4. Configure the ACL</a>
Set the access rights for the created Cell.  
The access rights can be set for all roles (by specifying 'root') or can be set individually for each role.  
The access privileges of the account (user) are determined based on the link between the role and account in the previous section.

Use the Cell_Level_Access_Control_Configure_API.

```sh
curl "https://{Personium_FQDN}/usercell" \
-X ACL -i -k \
-d "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
<D:acl xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\" xml:base=\"https://{Personium_FQDN}/usercell/__role/__/\">\
<D:ace><D:principal><D:href>adminrole</D:href></D:principal><D:grant><D:privilege>\
<p:root/></D:privilege></D:grant></D:ace></D:acl>" \
-H "Accept:application/json" -H "Authorization: Bearer {master_token}"
```

(Expanded display of the request body section)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns" xml:base="https://{Personium_FQDN}/usercell/__role/__/">
	<D:ace>
		<D:principal>
			<D:href>adminrole</D:href>
		</D:principal>
		<D:grant>
			<D:privilege>
				<p:root/>
			</D:privilege>
		</D:grant>
	</D:ace>
</D:acl>
```

This API does not return a json format response (body).  
If the status code 200 is returned, processing was successful.

```
HTTP/1.1 200 OK
```

### <a name="sect5.3">5-3. Store the First Data in the Main Box</a>
The main Box is a special Box named "__" (two underscores) which is created by default when Cell is created.  
This special Box is similar to a normal Box except that it can not be deleted.  
It is used for storing application data and storing unique information (using json format) of that Cell.

#### <a name="sect5.3.1">5-3-1. Store profile.json</a>
The profile.json file is a json format file needed to place PDS public profile information.  
For interoperability between PDS operators of Personium Service, we recommend placing the profile.json file directly under the main Box.  
For profile.json sample, see [here](https://demo.personium.io/app-uc-cell-creator-wizard/__/defaultProfile.json)  
>* You can also operate PDS without placing this file.  
>Although this file is not handled specially as API behavior, it is assumed that this file existence and possibility of anonymous access (access with no authorization header) also when operating the sample GUI described later.

actually place profile.json.  
Use the file registration update API to place.  
In this example, "John Doe" will be the display name, and "Senior Director, Personium Project" will be the description.  
Also, specify the URL of the profile image as the value of Image. In the following example, the data URI scheme of image data is specified.

```sh
curl "https://{Personium_FQDN}/usercell/__/profile.json" \
-X PUT -i -k \
-d "{\"DisplayName\":\"John Doe\",\"Description\": \"Senior Director, Personium Project\",\
\"Image\": \"{Image data encoded with Base64}\"}" \
-H "Authorization:Bearer {master_token}"
```

This API does not return a json format response (body).  
If the status code 201 is returned, processing was successful.

```
HTTP/1.1 201 Created
```

After storing  profile.json, set the access right to profile.json.  
Use the Access_Control_Configure_API.

```sh
curl "https://{Personium_FQDN}/usercell/__/profile.json" \
-X ACL -i -k \
-d "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
<D:acl xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"  p:requireSchemaAuthz=\"none\" \
xml:base=\"https://{Personium_FQDN}/usercell/__role/__/\">\
<D:ace><D:principal><D:all></D:all></D:principal><D:grant><D:privilege><D:read/></D:privilege></D:grant></D:ace></D:acl>" \
-H "Accept:application/json" -H "Authorization: Bearer {master_token}"
```

(Expanded display of the request body section)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:acl xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns" p:requireSchemaAuthz="none" xml:base="https://{Personium_FQDN}/usercell/__role/__/">
		<D:ace>
			<D:principal>
				<D:all></D:all>
			</D:principal>
			<D:grant>
				<D:privilege>
					<D:read/>
				</D:privilege>
			</D:grant>
		</D:ace>
</D:acl>
```

This API does not return a json format response (body).  
If the status code 200 is returned, processing was successful.

```
HTTP/1.1 200 OK
```

### <a name="sect5.4">5-4. Assign a default operating screen for user</a>
When accessing a Cell URL from a browser, an operating screen (HomeApp screen) can be displayed.  
Let's set the sample GUI (HomeApp screen) from the open source project as the default operating screen.

In order to assign a default operating screen (HomeApp screen), the Cell property must be modified.

```sh
curl "https://{Personium_FQDN}/usercell/" \
-X PROPPATCH -i -k \
-d "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\
<D:propertyupdate xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"><D:set><D:prop>\
<p:relayhtmlurl>https://demo.personium.io/app-cc-home/__/index.html</p:relayhtmlurl></D:prop></D:set></D:propertyupdate>" \
-H "Accept: application/json" -H "Authorization: Bearer {master_token}"
```

(Request body)

```xml
<?xml version="1.0" encoding="utf-8" ?>
<D:propertyupdate xmlns:D="DAV:" xmlns:p="urn:x-personium:xmlns">
	<D:set>
		<D:prop>
			<p:relayhtmlurl>https://demo.personium.io/app-cc-home/__/index.html</p:relayhtmlurl>
		</D:prop>
	</D:set>
</D:propertyupdate>
```

If the request succeeded, modified property will be in the response.  

```xml
<multistatus xmlns="DAV:">
	<response>
		<href>https://{Personium_FQDN}/usercell/</href>
		<propstat>
			<prop>
				<p:relayhtmlurl xmlns:p="urn:x-personium:xmlns" xmlns:D="DAV:">
				https://demo.personium.io/app-cc-home/__/index.html</p:relayhtmlurl>
			</prop>
			<status>HTTP/1.1 200 OK</status>
		</propstat>
	</response>
</multistatus>
```

Besides configuring individual Cell, it is also possible to configure the default values for the entire Unit.  
The following values of the Unit configuration file are modifiable.

```
io.personium.core.cell.relayhtmlurl.default
```

### <a name="sect5.5">5-5. Using the GUI</a>

Now the Cell is ready for use.  
* Administrator account name : me
* Administrator account password : password

Let's check the operation with GUI using the above information.

```
https://{Personium_FQDN}/usercell
```

The registered profile.json information is displayed on the login screen and you should be able to confirm the login with the administrator account.  
If you want to install it yourself without using the sample GUI published in the open source project, please click [here](https://github.com/personium/app-cc-home).

## <a name="sect6">6. Delete the Issued PDS</a>
Delete the issued Cell.

Delete the Cell created in these tutorials using the Recursive_Cell_Deletion_API.  
This API deletes everything, including the data included in the Cell.

```sh
curl "https://{Personium_FQDN}/usercell/" \
-X DELETE -i -k \
-H "X-Personium-Recursive: true" -H "If-Match: *" \
-H "Accept:application/json" -H "Authorization: Bearer {master_token}"
```

This API does not return a json format response (body).  
If the status code 204 is returned, processing was successful.

```
HTTP/1.1 204 No Content
```

## <a name="sect7">7. Try a demo video of GUI operation</a>
Furthermore, the complicated operations of [5. Issue PDS to Users](#sect5) and [6. Delete the Issued PDS](#sect6) can be simplified using the graphical user interface ("Cell Creator Wizard","Unit Manager").
<br>

For details see [Cell Creator Wizard](https://github.com/personium/app-uc-cell-creator-wizard).
<br>
<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/M4cYLFYRyEk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>


For details see [Unit Manager](https://github.com/personium/app-uc-unit-manager/blob/master/README.%6D%64).
<br>
<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/d1_pET0M-YA" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>


Please use the Unit management account information acquired in "4. Acquire the information used in this document" for login information required when using "Unit Manager".


## <a name="sect8">8. Automated PDS Creation</a>
Manual procedures were posted so that the flow of PDS creation can be understood,  
but we will introduce a sample program that automates the series of API calls from 5.1 to 5.3.  
For details see [here](https://github.com/personium/org-admin).
