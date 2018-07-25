# Role in Personium

## API protection with role-based access control

Nearly all Personium APIs are protected by role - based access control.
Role-based access control does not directly grant authority for resource operation to each of various access subjects,
It is an access control method that grants authorization indirectly via a role as follows.

1. Assign roles to access agents
1. Give the role operational authority on the role

With this two-step configuration, the access agent obtains the operation authority to the resource.
Role-based access control itself is a familiar way of thinking that has been implemented in various operating systems and file systems for a long time and is still used frequently.

## Effective range of Role

In Personium who considers Cell as a basic unit, roles are set in Cell, and its setting is effective only in Cell.
Role is a Cell control object, and by creating a Role object, it becomes possible to set access control using that role in that Cell.

It is not possible to access control using that role in another Cell by using the role object registered in a Cell.

## Assignment of Role

Role assignment can be done for various objects as follows. These are all Cell control objects and Role is also a Cell control object.
Role assignment is done by linking the Role object with the following objects and linking the different Cell control objects to each other.

|Target Object|Effect|
|:--|:--|
| Account | Authentication unit in Cell. By assigning different roles to different accounts, for example, it is possible to give stronger authority only when authenticated by stronger authentication means, and to give limited authority when authenticated by simple authentication means I will. |
| ExtCell | Access entity authenticated by another user with Cell. For the easiest way to disclose information to others or to grant operational authority, link ExtCell and Role. |
| Relation | Role can be assigned to relation with other cell (external cell) seen from own cell. For example, assigning an administrator role to Cell that is in family relationship. |
| ExtRole | An entity that has been assigned a specific role in a cell with a specific relationship. |

In this way, since it is a model for assigning roles to various access subjects,
The access control (ACL) setting that is set for each of myriad data resources in Cell has a structure that can be set in a centralized manner with a simple set of settings on what role is allowed.

## Role defined by the application

The Role of the Cell control object is structured to be associated with at most one Box. I think wondering what this is for.

### Who defines Role and ACL?

For PDS applications with complex data structures, it is generally impossible for consumers who become PDS owners to understand what data has meaning. For this reason, Personium provides a model that allows the application developer to distribute the data area in which the access control list is set in advance and the role definition that accesses it, and the consumer controls only which role to assign to whom.

### Role associated with Box

Here is the answer to what Rox-based Box is. Looking in the reverse direction, Role can be seen in the way that there are things that are attached to some Box and others are not. In other words, Role has something linked to Box and others not. Roles not associated with Box are the roles defined and defined by the owner of that Cell.
The Role associated with Box is the Role defined by the definer of Box, that is, the application development vendor. For example, suppose that an application related to medical care and healthcare defines a role called "family doctor", and that "family doctor" uses it in such a way that it can be read and written as ACL setting throughout the Box doing.
Specifically, the Role associated with the Box and the access control setting (ACL) for those Role are set and defined by the application developer, and distributed to the PDS user in the form of a bar file. And the PDS user uses it to set who (in which cell account, which external cell, which Relation, etc.) The Role is to be assigned.



