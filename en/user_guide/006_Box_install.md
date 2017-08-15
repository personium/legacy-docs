# Box installation

### Overview
* A Box which is a data storage unit for each application is always created in a cell using an application,  
All the data structures for making applications such as webDAV and OData's Scheme behave should be the same.

* In order to create Box and resources under it, it can be realized by running individual APIs,  
Since it is inefficient to execute all the existing APIs in order to create resources of the same structure in a plurality of cells,  
To create a new Box which is a data storage unit for each application, use the "box installation" function.

* ![Box installation](image/box_install_en.png "Box installation")

### Bar file
* The bar file means "box archive file" and refers to an archive file that organizes the contents of Box.

* The file format is zip format, the hierarchical structure in the folder represents the hierarchical structure of the webDAV collection,  
By storing the file for each hierarchy, it holds the file to be stored in webDAV.  
For the Scheme information of OData, define the structure with "edmx.xml".

* See [Bar file](../apiref/1.5.2/301_Bar_File.md) for details.

### Runtime flow
* Box Running the installation API
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Create Box
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Confirm that there is already a Box with the same schema or name in the target cell → If it exists 409 Error
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Create directory / file under Box
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Create OData collection and underlying OData resource
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Store user data
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Create Role/ExtRole
  * &nbsp;&nbsp;&nbsp;&nbsp;↓
* Access right (ACL) setting for each created directory

* <u>Abnormal termination</u>  
If an error occurs due to the check of the Bar file before creation of the Box and the process ends abnormally, the Box installation will be terminated as it is.  
For the reasons and causes of abnormal termination, execute the "Box metadata acquisition API" and "Log file acquisition API" described later to check the contents.

### Confirm progress
* Unlike other APIs, installing sometimes creates various resources during processing during installation,  
Processing takes time from receipt of processing to completion of registration.

* To check the progress of the process, use [Box metadata acquisition](../apiref/1.5.2/303_Progress_of_Bar_File_Installation.md).

* ##### Condition check by acquiring Box metadata
	* In order to execute the Box metadata acquisition API, you need "box" authority of box level ACLPrivilege.

	* Therefore, in the ACL setting in the bar file, it is necessary to make settings to give "box" of box level ACLPrivilege to the role of the account using the box installation status confirmation API.

* ##### Response of Box metadata acquisition API
	* There are three ways to execute the Box installation that can be acquired with the Box metadata acquisition API.

* 1.Completion of Box installation (Including creation completed with normal Box registration API)
```
"status": "ready"
```
* 2.Completion of Box installation (Including creation completed with normal Box registration API)
```
"status": "installation in progress"
```
* 3.Box installation abnormal termination
```
"status": "installation failed"
```

* 3.For Box installation abnormal termination, it is overwritten to 1 72 hours after abnormal termination.  
For details of the reason for failure, please check with the log acquisition API described later.

### Confirm processing result
* Box Installation processing contents are output as a log to the EventBus of Cell to which box installation target Box belongs.  
To refer to that log, use [Log file acquisition API](../apiref/1.5.2/285_Retrieve_Log_File.md) to refer to it.
Also, in order to use the above API, "log - read" authority is required.
