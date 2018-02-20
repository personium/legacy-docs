# How to use OData Service Collection (OSC)
Personium's OData Service Collection (OSC) is a space that can handle relational data that can be created in Box.You can create one or more tables to manage and search data by OData (v2) protocol.

## Create of OSC
To use OSC, you first need to create an OSC in any place in the Box.

## Confirm the schema information
[Schema information acquisition API](../apiref/current/316_User_Defined_Data_Schema.md) allows you to check schema information such as table definition. The XML to be returned is a form called EDMX, which represents information on what kind of table, what kind of column, what kind of relationship is put in briefly.  

Naturally, there is nothing at the beginning of the table and no data can be registered as it is. First let's create a table.

## Schema definition
In Personium, the schema manipulation itself is also done with the OData interface. Specifically, $ metadata or less of the target OSC's URL is a space of OData for manipulating the schema, and we manage the schema by manipulating EntitySet for schema management such as EntityType, Property prepared in advance here.

## Create table
By creating an EntityType in Personium, it is possible to create something equivalent to a table.  
   http://personium.io/docs/en/apiref/current/345_Create_EntityType.html

> In the OData specification, EntityType is originally type information, and based on it, it is the idea of making something equivalent to a table called EntitySet. Personium emphasizes practicality and automatically creates an EntitySet (table equivalent concept) of the same name by creating EntityType. Therefore, the table will be created by EntityType creation.

## Preset properties
The table created by OSC automatically defines the creation date and time (__created) and update date and time (__ update) of the single primary key field (__id) and Entity (record).
> The ability to define your own (compound) primary key item is a concept but is not implemented yet.

## Dynamic Property
OData's EntityType has the notion of OpenType.This incorporates a schema-less DB-like way of thinking, and the current Personium EntityType is all OpenType.That is, when there is a data registration request including an undefined item, it accepts this data.

> In the schema information (EDMX), the OpenType attribute of the EntityType element always appears as True. For users who dislike such behavior, we are planning to support EntityType with OpenType = false (registration of undefined items becomes an error), but it is not implemented yet.  

Items stored in this way are called DynamicProperty in OData, Personium recognizes it as an undeclared property with Declared = false in the schema, and it can be confirmed in the schema definition.  
> The function to change this Declared attribute to true later is also planned, but it is not implemented yet.
DynamicProperty is a function to support agile development, for example, it is possible to create only EntityType as a schema definition and make Property all Dynamic.

### Current limit
Please note that the current Personium has many restrictions on schema change.

* Property can not be updated.
* In order to delete EntityType, it is necessary to delete all associated properties.
* To delete Property, it is necessary to empty the data.

## Access control
Although you can set ACLs on OSC itself, you can not set ACLs for internal child resources at the current Personium. So you can not change the access right for each table, for example.

