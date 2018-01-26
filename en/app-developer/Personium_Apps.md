# Personium App  
## Overview  
Personium interface is basically REST API based and does not provide any GUI tools.  However, it is better to provide GUI tools to end-users.  

Personium Project has implemented several sample GUI tools to demonstrate the functions of Personium. App developers are free to modify the published sample GUI tools.  

However, Personium App developer should note that other Personium App developers are involved in this open ecosystem. Therefore, it is inevitable that all of us should follow certain basic developer guidelines (Likewise for any other OSS communities).  

![Diagram](https://raw.githubusercontent.com/personium/Hands-on-Demo/master/doc/app_overview.png)  

## Video Demonstrations  
1. Data Synchronization  
[![Data Synchronization](https://i.ytimg.com/vi/gv0p2jfn2kw/2.jpg?time=1514274465341)](https://youtu.be/gv0p2jfn2kw)  

1. Data ACL Management  
[![Data ACL Management](https://i.ytimg.com/vi/indyfGp4KJQ/2.jpg?time=1514274599855)](https://youtu.be/indyfGp4KJQ)  

## Types of Personium App  
In Personium, App is categorized according to the level of permission of APIs the App can use. There are basically 3 types of Apps. For details on how APIs are categorized, please refer to the [Personium Concepts](../user_guide/001_Personium_Concepts.md).  

1. [General Apps](#1-general-apps)
1. [Cell Management Clients](#2-cell-management-clients)
1. [Unit Management Clients](#3-unit-management-clients)

In the following sections, definitions and deployment procedures for the above GUI types will be explained.  
For detailed deployment procedures, please check out each repository's "How to deploy" section.  

### 1. General Apps  
General App is a Box level GUI that can perform operation on data contained in a dedicated Box which is only accessible to the corresponding App.  

App developer designs what kind of data (files, DB, etc.) must be installed onto the user's Cell to provide services on the Personium Platform.  
Most App developers implements Apps in this category.  

#### Merits  
Both App users and developers can benefit from this arrangement.  

* **App user (data subject)**  
    * All data is contained in the App user's PDS (Personium Cell) while a variety of services can be used.  
    * The user can reduce the risk of information leakage by customizing the access control configurations of the data provided to the service provider.  

* **App developer (service provider)**  
    * Since data management and access control are already performed by the App user, the App developer only need to provide minimal data management on the service side.  
    * The App developer can ask for permission to access data which is created by other Apps.  
    > An easy way to conduct marketing research or survey.

#### Examples  
All source codes are available on GitHub.  

* [Minimal App](https://github.com/personium/template-app-cell) - Personium's Hello World App  
* [MyBoard](https://github.com/fujitsu-pio/myboard-app) - Provide data access control using Role only  
    * Demo available on YouTube  
    [![MyBoard on YouTube](https://i.ytimg.com/vi/X_djQih94tU/1.jpg)](https://youtu.be/X_djQih94tU)  
* [Calorie Smile Sync](https://github.com/fujitsu-pio/calorie-smile-app) - Synchronize data from another Web service and provide data access control using Relation and Role  
* [Personal Data Brokering (Wakaba Municipal Information Bank)](https://github.com/fujitsu-pio/wakaba-user-app)  
etc  

#### How to deploy an App and provide service  
In this section, we will explain the basic rules and recommendations on setting up an repository. By following these rules and recommendations, it makes deploying the Personium App on Personium Cell easier.  
> A [simple example](https://github.com/personium/template-app-cell) is available.  

##### Folder structure  
The following diagram shows the folder structure of a very simple Personium App.   
> [Calorie Smile Sync](https://github.com/fujitsu-pio/calorie-smile-app) has a more complicated bar folder.  

    │  launch.json
    │  profile.json
    │  relations.json
    │  roles.json
    │  
    ├─bar
    │  └─00_meta
    │          00_manifest.json
    │          90_rootprops.xml
    │          
    ├─doc
    │      
    ├─icon
    │      
    ├─locales
    │  ├─en
    │  │      profile.json
    │  │      
    │  └─ja
    │          profile.json
    │          
    └─src
        └─html
            │  app.html
            │  
            ├─css
            │      common.css
            │      
            ├─Engine
            │      getAppAuthToken.js
            │      
            ├─img
            │      github.png
            │      
            ├─js
            │      app.js
            │      common.js
            │      common_personium.js
            │      
            └─locales
                ├─en
                │      common.json
                │      glossary.json
                │      
                └─ja
                        common.json
                        glossary.json

##### Explanation and deployment procedures    
|#|Resource (Folder/File)|Description|
|:--|:-------|:---|
|1|bar     |Contains [definitions and contents](../user_guide/006_Box_install.md) needed to create a [BAR file](https://github.com/personium/api-references/blob/master/api/en/301_Bar_File.md) which will be installed as Box onto the user's Cell. Compress (zip) this folder and name the compressed file with a ".bar" extension.|
|2|icon    |Icon to be displayed in HomeApp.|
|3|launch.json|Contains information used by the HomeApp to lauch the app. [Sample file](https://github.com/personium/template-app-cell/blob/master/launch.json) has entry that allow launching native App (Android/iOS) which will be supported in the near future.|
|4||Defaults to be used when the App developer decides not to provide multilingual support.|
||profile.json|Contains information (Name/Description/Images, etc.) about the App. ([Sample file](https://github.com/personium/template-app-cell/blob/master/profile.json))|
||relations.json|Contains display name, description and image of the relation(s) defined by the App. <br>If relation is not defined, write a [JSON file with an empty hash](https://github.com/personium/template-app-cell/blob/master/relations.json).|
||roles.json|Contains display name, description and image of the role(s) defined by the App.<br>If role is not defined, write a [JSON file with an empty hash](https://github.com/personium/template-app-cell/blob/master/roles.json).<br>If role is defined, write necessary information. ([Sample file](https://github.com/personium/app-myboard/blob/master/roles.json))|
|5||Multilingual files of the App|
||locales/en/*.json|English version|
| |locales/ja/*.json|Japanese version. ([Sample file](https://github.com/personium/template-app-cell/blob/master/locales/ja/profile.json))|
|6|src/android|Source codes for Android App.|
|7|src/html|Source codes for mobile browser App. Usually can be deployed on a Web server.|
|8|src/ios|Source codes for iOS App.|

### 2. Cell Management Clients  
Cell Management Client is the GUI tool for managing Cell.  

Cell level APIs allow administrative operations to be performed on the Cell.  
For details, see [here](../user_guide/001_Personium_Concepts.html).  

#### Functions  
The Cell management client provides the following functions.  

1. Data management through Cell management authority (root)  
1. Registration/Modification of Cell control objects such as account and Role, or user profile  
1. Register relationship with other Cell, request registration by message (like typical friends registration)  
1. After relation registration, access data in another Cell that is permitted to access
1. Installation of a Box (data structure) attached to an App  
1. Launch an App  
1. Send and receive messages not associated with Box  

The following functions are under planning.  

1. App usage data privilege management, BOX uninstallation
1. Cell data explorer  
1. Implementation of native App  
1. Automated Cell URL input by QR code, NFC etc.  
1. Configuration of user defined event, browsing of trigger log   

#### Sample Apps  
1. [HomeApp Repository](https://github.com/dixonsiu/app-cc-home/)    
	- [Overview](https://github.com/dixonsiu/app-cc-home/blob/master/)  
	- [Demo with tutorial](https://demo.personium.io/democell/io_personium_demo_HomeApplication/src/login.html?lng=en)  
	- [Demo](https://demo.personium.io/HomeApplication/__/box-resources/login.html?lng=en&mode=global)  

### 3. Unit Management Clients  
Unit management clients are Unit level management tools that helps you manage Personium cell(s).

1. [Unit/Cell Manager](https://github.com/personium/app-uc-unit-manager)  
[![Unit/Cell Manager YouTube](https://i.ytimg.com/vi/d1_pET0M-YA/1.jpg?time=1514263611186)](https://youtu.be/d1_pET0M-YA)  
1. [Cell Creator Wizard](https://github.com/personium/app-uc-cell-creator-wizard)  
[![Cell Creator Wizard YouTube](https://i.ytimg.com/vi/M4cYLFYRyEk/1.jpg)](https://youtu.be/M4cYLFYRyEk)  
1. [PCUI](https://github.com/personium/pcui)  

The above management tools require a special token (issued by the corresponding UnitAdmin Cell) which possesses Unit management permission. Therefore, the following information is required during user authentication.  

1. Personium Unit URL  
1. UnitAdmin Cell name (Specified in the Personium Unit's UnitConfig file)  
1. UnitAdmin account name  
1. UnitAdmin account password  

#### How to deploy  
Similar to HomeApp, Unit/Cell Manager can also be deployed on a normal Web server instead of a Personium Cell.  
> We are also considering to build our next version of management tool in [Electron](https://electronjs.org/).  

## App authentication  
In the Personium Apps ecosystem, in order to defend against unauthorized phishing Apps against PDS, App authentication must be enabled for the Box defined by the same App.  

App authentication means that the App that accesses the data must be authenticated by the App Cell in addition to the User's Cell authentication, and see here for details.  

When the App developer cannot start the App from the HomeApp properly, in order to access the Box, it is necessary to separately acquire a token after App authentication.  

> Note:　App authentication is planning to support multiple schemas (implement URL hash).  

Source codes based example is available [here](https://github.com/personium/app-myboard/blob/master/src/html/js/common.js#L360).  
