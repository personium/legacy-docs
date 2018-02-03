# Personium Architecture  

## Basic three-layered objects
Personium defines the following three layered basic objects in order to achieve a new ICT model centered around data subjects.
![3LayerObject](image/3LayerStructure.png "3LayerObject")  

|Name|Overview|URL example|
|:--|:--|:--|
|**Unit**|A server to host multiple Cells. What you get by server installation|https://personium.example/|
|**Cell**|A datastore for a data subject|https://personium.example/john.doe/|
|**Box**|Per-app datastores installed on each Cell|https://personium.example/john.doe/schedule/|

### Unit  
* A unit is a system infrastructure which runs Personium which have a unique FQDN.
* Since Personium adopts unique distributed architecture, it is possible to create a relationship between units and give privilege based on it.
* In a unit, it is possible to create multiple Cell.

### Cell  

* A cell is a fundamental concepts of Personium
* Each Cells are independent as if they are different tenant in multi-tenancy model.
* A Cell provides following feature  
    * Authentication and authorization
    * Access Control
    * Data Store for Applications (Box)
    * Event Processing, Messaging, Script Execution


### Box  

* A box is data store for application.
* A box can store following data.  
    * Directory
    * File Object
    * OData Data Service



## Based on Standards  

Personium's API is build on international standards.  

* OAuth2.0 for Authorization
* WebDAV for File operation
* OData for relational data

