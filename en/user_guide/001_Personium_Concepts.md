## <a name="unit">Unit
A unit is a system infrastructure which runs Personium which have a unique FQDN.

Since Personium adopts unique distributed architecture, it is possible to create a relationship between units and give privilege based on it.

In a unit, it is possible to create multiple [cell](#cell).

## <a name="cell">Cell

A cell is a fundamental concepts of personium.io.
Each Cells are independent as if they are different tenant in multi-tenancy model.

A Cell provides following feature

* Authentication and authorization
* Access Control
* Data Store for Applications ([Box](#box))
* Event Processing, Messaging, Script Execution


## <a name="Box">Box

A box is data store for application.

A box can store following data.

* Directory
* File Object
* OData Data Service
