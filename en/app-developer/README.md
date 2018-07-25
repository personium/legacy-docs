# Application Developer's Guide

It is a document for people who want to develop  PDS applications using Personium's API

## Diversity and freedom in programs that connect to Personium
Personium is software that aims to promote computing centering on individuals and other data entities. In order to realize such computing, it is essential that not only Personium which is a data store server but also abundant appealing applications exist.
It is unrealistic to support all human activities with just one application. Work, education, movement, shopping, meals, games, medical, etc. Programs specialized in various fields are occasionally desktop PCs, sometimes smart phones, sometimes in car terminals, sometimes in virtual machines in data centers It works, where user's data is generated.

In order to be able to receive any data from these diverse programs, Personium exchanges with the outside with a general-purpose protocol called HTTP and adopts as colorful API structure as data store as much as possible. As a result, Personium is server software that can be used for various purposes. Personium can also be regarded as open source BaaS software which provides API group for storing and managing data based on REST. Of course, it is the freedom of the developer who uses this to know how to use Personium and what value. "Personium-based application" can take any form.


## An app that can co-exist with others and build an ecosystem
On the other hand, diversity and freedom can also have negative aspects when thinking about promoting computing around data subjects. For example, if some applications do not authenticate and collaborate, ask each user to enter their password, will they be happy? When there is an application that listens to the URL of PDS every time it is launched, is the user irritated? In order for users to combine various applications to accumulate their own data in PDS and to realize a world where it can comfortably utilize it, the application should take form according to some restrictions.

1. The means by which the user finds the application can be constructed
1. It is possible to provide means for users to obtain information in order to consider application use
1. Have operable interoperability for Cells on various Personium units
1. It is not necessary for users to input the URL of Cell every time
1. It is compatible with single sign-on with other applications

<!--
1. 利用者がアプリを発見する手段が構築可能であること
1. 利用者がアプリ使用を検討するために情報を得る手段が提供可能であること
1. 様々なPersoniumユニット上のCellに対しても動作可能な相互運用性を持つこと
1. 利用者がいちいちCellのURLをいちいち入力しないでよいこと
1. 他のアプリとのシングルサインオンに対応していること
-->

We are aware of ecosystem formation co-prospering with other applications, and applications written in a certain way to satisfy these conditions are called Personium applications.
<!--
他アプリと共存共栄するエコシステム形成を意識し、これらの条件を満たせるよう一定の流儀で記述されたアプリのことをPersoniumアプリと呼びます。
-->

## "Personium App" and "Apps that uses Personium"

The above two directions are very different because one denotes "independent and separated development ignoring the other apps" while the other "Development considering the whole ecosystem including other apps" 

|Terms|Meaning|
|:--|:--|
|Apps that uses Personium|Arbitrary app programs that access Personium|
|Personium Apps|Among the above, those apps that comply with certain rules in order to achieve interoperability and collaboration with other apps|

When starting to develop an app, it is important to decide and make clear which standpoint to stand.


## Development of Apps that uses Personium

In order to develop a "Personium App", additional considerations are necessary such as how to coexist with other apps.
So it is easier to start from non-Personium App when learning.

Let us first use a single box inside a single cell and start trying to write or read data there.

### [OData,WebDAV Experience](https://demo.personium.io/baas-demo/1/index.html)

It would be better to first grasp the overview of OData and WebDAV.

### [Use of OData inside a Box](./using_odata.md)

## Personium Apps Development

* [Application development guide](./Personium_Apps.md)  
* [Client registration & authentication](../user_guide/004_Client_auth.md)
* [App authentication](./app_authn.md)
* [Role in Personium](./Roles.md)
* [Launging from Home App](./launch_from_homeapp.md)
* [Personium Engine](./Personium-Engine.md)


## Sample Apps

Some sample apps are available. They are implemented in the form of AJAX apps for Web browsers.

* [app-myboard](https://github.com/personium/app-myboard)
* [app-sample-calorie-smile](https://github.com/personium/app-sample-calorie-smile)

Also, a project template is available for the use as a base to develop an AJAX app for web browsers.

* [template-app-cell](https://github.com/personium/template-app-cell)


## Developer Tools

#### [Cell Manager](https://github.com/personium/app-uc-unit-manager)
Cell Manager is a GUI tool to handle almost all API calls against a Personium Cell as a Cell administrator.

[![Cell Manager Intro](https://img.youtube.com/vi/d1_pET0M-YA/3.jpg)](https://www.youtube.com/embed/d1_pET0M-YA)



It can be used conveniently in the app development to register, delete test data, and make sure if the data is correctly registered or not.

Please see the README file of [Cell Manager Repository](https://github.com/personium/app-uc-unit-manager) for details. 

#### [PCUI](https://github.com/personium/pcui)

PCUI is a tool or sample to demonstrate Personium API calls via Script language rather than curl command.
Mainly referencinf API'a are covered currently.  

The following environment is required in order to try PCUI
* Ruby 2.0 or above
    * Depending on your Ruby package, following libraries needs to be installed additionally. If load error occurs on 'require', please install necessary libraries using a packaging sysgem on your environ
        * readline
        * rest-client
        * io/console


## Related Repositories

* [app-myboard](https://github.com/personium/app-myboard)
* [app-sample-calorie-smile](https://github.com/personium/app-sample-calorie-smile)
* [personium-client-java](https://github.com/personium/personium-client-java)
* [js-client](https://github.com/personium/js-client)
* [template-app-cell](https://github.com/personium/template-app-cell)
