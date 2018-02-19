# Application Developer's Guide

It is a document for people who want to develop  PDS applications using Personium's API

## Development of Apps that uses Personium


## Personium Apps Development

* [Application development guide](./Personium_Apps.md)  
* [Client registration & authentication](../user_guide/004_Client_auth.md)
* [App authentication](./app_authn.md)
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
