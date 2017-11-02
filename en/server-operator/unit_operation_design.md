# User guide for Unit manager
This user guide is the one for the manager who monopolizing manages Personium Unit.
<br>
## Operation design and setting of Unit
When Personium Unit is introduced, it is necessary to do the operation design and to
set it according to it.
<br>
## Personium and PKI
The unit of Personium is the decentralized BaaS/PDS server such as web and OpenID.
By defining mutual links, you can link Personium servers grouped in different environments.Then you can share and utilize data across the infrastructure environment.

Personium uses the frame of PKI to establish the mutual trusts of each other between Personium servers that exist in a separate environment. Concretely, the Trans-Cell AccessToken used by Personium is the Assertion format of SAML 2.0.In addition, x.509 is used for the electronic signature used in the Assertion.

To do the e-signature for the SAML issue, the unit should have the private key and the certificate of peculiar X.509. Moreover, it is necessary to set the material  used when the received certificate is verified to the unit.
<br>
## Unit private key, preparation of certificate, and setting
It is necessary to sign the certificate from appropriate route providers of digital certification services.
Moreover, it is necessary to set the certificate of the route providers of digital
certification services that accept as Unit. (Written schedule)
<br>
## Unit User management design
First, the unit administrator decides whether to create UnitUser depending on whether you want to use the unit only by yourself or multiple people.

When you don't use Unit User, you use Unit Master Token  and operate the Unit level.
When you use Unit User, you have to decide how do you procure the Unit User administrative mechanism.
WWhen you use the management mechanism that exists on the outside, you have to generates the token of the SAML.
Both the private key and the certificate set to the unit are necessary to make the
token of the SAML form.
The character string that can be used for the Unit User name is a character string of UTF-8.
This is because the Unit owner already has the possibility to connect with the user ID.

An outside user management mechanism does not exist and when it is not necessary to newly establish it, Cell can be used as Unit User administrative mechanism.
When specific Cell is used as Unit User administrative mechanism, the UnitUser name becomes Personium subject URL ({Cell URL} #{ account name }).
<br>
## Data Bundle design
Data Bundle is a unit of the backup restoring of the data stored in the Personium unit. Information preserved in ES, MySQL, and the filesystem that Personium adopts is separated by this DataBundle name and preserved.
The Unit manager should design by what kind of unit to cut Data Bundle according to the backup operation of data and the foreseen migration plan, etc.In many cases, there is no problem if the Unit user-name is used as DataBundle name.

If you define theData Bundle name decision function, you can preserve all unit user's data as one Data Bundle or you can divide Data Bundle according to each unit user's affiliation or the prefix of the unit user-name.


There is the following limitations in the character that can be used as DataBundle name. Therefore, when you make the DataBundle name decision function, you need to note these.
In default, the DataBundle name decision function is the following logics.
<br>
1. Only the following character string is used from it when there is # sign.
2. It escapes about the character that cannot be used as DataBundle name.

When a specific Cell is used as a Unit User management mechanism, the UnitUser name is Personium Subject URL {Cell URL} # {Account Name}.
However, if you use the default Data Bundle name determination function, the DataBundle name will be the account name of the Unit User Management Cell.

