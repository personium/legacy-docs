Getting Started with Personium using Virtual image
----------------------------------------------------

Overview
--------

The purpose of this document is to explain high level specification  
for constructing Personium unit using VirtualBox virtual image.  
This Virtual image is checking the operation with VirtualBox version 1.5.2 later and Windows10.

#### Setup procedures

1. Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads).

1. Please download the image file of the version of Personium unit  
   you want to build from the following URL.  

   * 1.6.15  
     https://personium.io/mvnrepo/image/personium-unit-image-1.6.15.ova  

1. Import virtual image into VirtualBox.  

    1. Click "File" - "Import Appliance".  

    1. Choose a virtual image file to import and click the "Next" button.  
        **if you want to change the spec,It is also possible to change**

    1. Click the "Import" button.

1. Add following to end of hosts file on your machine.(E.G: C:\Windows\System32\drivers\etc\hosts)  

    ```
    127.0.0.1  personium.example.com
    ```

    * If use a proxy environment, Please see [Proxy exclusion setting](proxy_exclusion_setting.md "").  
    * Network setting (optional)  
      * Default value is a virtual network (10.0.2.0) dedicated to VirtualBox.  
      * NAT setting is unnecessary, if it is used only via virtual network.

#### Confirm Personium

Virtual server account information
```
ID  ：root  
PASS：root
```
**Please be sure to change at first login.**

1. Log in to the virtual server from ssh client such as Teraterm.

    1. Please enter the following information and click "OK" button.  

        ```
        host   ：localhost  
        TCPPort：2221
        ```

    1. Since the ssh confirmation screen is displayed,  
       please input ID / PASS described in the above account information.

1. Check the information of personium administration account.

   ```
   # cat /personium/unitadmin_account
   unitadmin_account=unitadmin
   unitudmin_password={password}
   Personium_FQDN=personium.example.com
   ```

1. Verify that your Personium Unit-Manager is up and running.

    1. Access the following URL from the browser.   
        https://personium.example.com/app-uc-unit-manager/__/html/login.html  
        * Please refer to the link for [Unit-Manager](https://github.com/personium/app-uc-unit-manager "").  

    1. Enter the following on the login page and click the "sign in" button.  
       * Login URL      : https://personium.example.com/unitadmin/  
       * Username       : unitadmin  
       * Password       : {password}  
         **For {password}, enter the password confirmed in the above "1."**

    1. After successful login, please confirm that the following Cell exists  
       in "Cell List" on the left side of the screen.  
       * app-uc-unit-manager
       * unitadmin

1. Verify that your Personium is up and running.  

    1. Prepare an environment in which the curl command can be executed with localhost.

    1. Get Unit User Token. Execute the following command.

       ```
       $ curl "https://personium.example.com/unitadmin/__token" -X POST \
       -d \'grant_type=password&username=unitadmin&password={password} \
       &p_target=https://personium.example.com/' -k  
       ```

    1. Create a Cell. Execute the following command.

        ```
        $ curl -X POST "https://personium.example.com/__ctl/Cell" -d "{\"Name\":\"sample\"}" \
        -H "Authorization:Bearer {Token}" -H "Accept:application/json" -i -sS -k
        ```

    1. If Personium works fine, 201 response is returned as below. a cell is successfully created!  

        ```
        HTTP/1.1 201
        Date: Mon, 28 Jan 2019 01:03:39 GMT
        Content-Type: application/json
        Content-Length: 245
        Connection: keep-alive
        Location: https://personium.example.com/__ctl/Cell('sample')
        DataServiceVersion: 2.0
        ETag: W/"1-1548637419191"
        X-Personium-Version: 1.6.15
        Server: Personium
        
        {"d":{"results":{"__metadata":{"uri":"https:\/\/personium.example.com\/__ctl\/Cell('sample')",
        "etag":"W\/\"1-1548637419191\"","type":"UnitCtl.Cell"},"Name":"sample",
        "__published":"\/Date(1548637419191)\/","__updated":"\/Date(1548637419191)\/"}}}
        ```

##### OS and Middleware on VM

* OS  
CentOS 7.2 x86_64

* Middleware  

    |Category       | Name           |Version       |                   |
    |:--------------|:---------------|-------------:|:------------------|
    | java          | AdoptOpenJDK   |        8u192 | --                |
    | tomcat        | tomcat         |       9.0.10 | web               |
    |               | commons-daemon |        1.1.0 | --                |
    | nginx         | nginx          |       1.14.0 | proxy             |
    |               | Headers More   |         0.32 | --                |
    | logback       | logback        |        1.0.3 | --                |
    |               | slf4j          |        1.6.4 | --                |
    | memcached     | memcached      |       1.4.21 | cache             |
    | elasticsearch | elasticsearch  |        2.4.1 | db & search engine|
