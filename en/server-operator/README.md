# Server Software Operator's Guide  

It is a document for people who use Personium's server software to build Personium units, who build/deploy/configure Personium server programs, and who wish to provide / operate a PDS service environment using Personium.

Those who access the constructed/configured Personium unit using the unit user token and perform the main task of the unit administrator, that is, the creation/payout of the Cell, management of the dispensed Cell, etc., Please see [Guide for unit administrator](../unit-administrator/).

### Personium unit structure

Personium unit is configurable based on different purpose of usages like evaluation, development, verification, production etc.. Personium is provisioning the unit setup tool, for the easiness of the developer to construct Personium unit automatically based on their needs.  
Although you may construct the Personium unit without using the setup tool, but it is recommended to use the setup tool for constructing the Personium unit easily.

### Personium setup tool

This setup tool will install middleware and configure the OS and its network on your machine (linux server or virtual machine on windows/mac) before installing Personium module.  
There are different patterns of setup tools to construct the Personium unit. Please select the setup tool based on you purpose.

### Server architecture for Personium unit

Personium unit construction requires to assign the combination of following 7 roles on a single or multiple interconnected servers properly.

|Role|Usage|definition|
|:--|:--|:--|
|Web|Required|Reverse proxy server, contains Global IP and also should be accessible to the internet.|
|AP|Required|Application server, where Personium will be executed.|
|ES|Required|server to operate `ElasticSearch`.|
|MQ|Required|server to operate `ActiveMQ`.|
|NFS|Required|server to operate `Network File System (NFS)`.|
|Bastion|Optional|Bastion server. Used to execute ansible and to connect other servers by ssh.|

## Unit configuration design

Personium has a scalable architecture. For evaluation and personal use, it is also possible to build a Personium unit packed all in one machine. Meanwhile, it is recommended to adopt the layer structure such as Web layer - AP layer - DB layer because non-function such as security and performance is required to construct units used by hundreds or thousands of people, You should take a minimum of 2-3 configurations. Furthermore, in order to construct a large-scale unit that tens of thousands to hundreds of thousands of people use every day, each layer is scaled out and it takes 10 to 20 units.

First of all, let's decide what kind of unit to make and design the necessary infrastructure.

## Construction of unit

By using it you can build a unit using Virtual image, Vagrant, Ansible. If you are building in an Open Stack-based cloud environment, you can almost unit-build by using Heat Template. Of course, you can also build units using any cloud or physical/virtual machine without using these automatic construction tools. However, since we do not have the physical strength to prepare and maintain the document etc. for that, please build it with reference to the server infrastructure building procedure using Heat of Open Stack and the automatic unit building procedure using Ansible.

We are pleased to hear the story that the unit was built in various environments on the #infra channel of the community.

|    | Server | Server construction | Personium Setup | Installed extension engine | Installed Application |
| :- | :----- | :-------- | :------------------- | :------------- | :------------------ |
| Try Personium on your machine | 1 Linux server | unnecessary | unnecessary | httpclient<br>ew-services<br>mailsender<br>slack | unit-manager |
| Small Personium Environment  | 1 Linux server | Vagrant | unnecessary | httpclient<br>ew-services<br>mailsender<br>slack | unit-manager |
| | | Prepare the Linux server yourself | Ansible | httpclient<br>ew-services<br>mailsender<br>slack | None |
| Medium / Large-Scale Personium Environment | 3 Linux servers | HeatTemplate | Ansible | httpclient<br>ew-services<br>mailsender<br>slack | None |
| | | Prepare the Linux server yourself | Oneself | None | None |

### Try Personium on your machine

* Automatic building of unit using virtual images
  
  Using Virtual image. we are publishing guides for building a unit .  

  * [Getting Started with Personium using Virtual image](./setup_virtual_image.md)

### Small Personium Environment

**If you are more curious about Personium and want to develop some simple applications or to test this system, you can select this pattern. You will get Personium unit on a single server.**

* Vagrant  

  Using Vagrant. we are publishing guides for building a unit .  

  * [Getting Started with Personium using Vagrant](https://github.com/personium/setup-vagrant)  

* Ansible(1-Server)  
  
  Using Ansible(1-Server). we are publishing guides for building a unit .  

  * [Getting Started with Personium using Ansible(1-Server)](https://github.com/personium/ansible/tree/master/1-server_unit)

### Medium / Large-Scale Personium Environment

**If you are devoted to Personium and want to release some marvelous applications with it, you should try this pattern! You will get Personium unit with 3 servers, which will meet practical performance.**

* Open Stack Heat

  Using HeatTemplate. OpenStack has released a guide to automatically construct the network and server configuration for Personium 3 Server units.

  * [Automatic construction of server infrastructure](https://github.com/personium/openstack-heat)

* Ansible(3-Server)

  Using Ansible(3-Server). we are publishing guides for building a unit .  

  * [Getting Started with Personium using Ansible(3-Server)](https://github.com/personium/ansible/tree/master/3-server_unit "3-server_unit")

### Environment information of units automatically constructed

Confirm the environment information of the main middleware of the unit constructed.

* [Confirmation of the environment of units constructed](./Confirm_environment_settings.md)

When you want to check how to manage the unit after build, please click [here](../unit-administrator/).

### Apply plugin

When building the environment by the procedure of **Ansible(1-Server)**, **Ansible(3-Server)** Please see here.

* [Setup Authentication Plugins](./setup_authentication_plugins.md)
* [Setup Engine Extensions](./setup_engine_extensions.md)

## Unit settings

Once you have configured the unit, you need to set the unit properly.
In Ansible, the basic configuration is set for automatic construction unit, but it is not complete. Please refer to the following and make appropriate settings.

* [Unit operation design](./unit_operation_design.md)
* [Unit configurations](./unit_config_list.md)  
* [How to set coordination between units](./unit_coordination.md)  

## Start/Stop unit

When setting is completed, the unit is activated. Please start each server in the following order.

|Boot order|Activation method|
|:--|:--|
|1|Memcached, ElasticSearch, ActiveMQ|
|2|Tomcat|
|3|Nginx|

Please stop in the reverse order as above.

## Operation of unit

* About server security correspondence  
    In many cases Personium's unit will contain information on personal privacy and security measures are essential to establish a server on the Internet. Please do not leave it built first, but apply security patches appropriately.

* About unit security compliance  
    The environment constructed by Ansible may contain settings that can be a security hole depending on circumstances. For that reason, I will explain the setting which should be changed from the default.
    
    * [Settings that recommend changes from default](./unit_security.md)

### Related repositories

* [ansible](https://github.com/personium/ansible)
* [openstack-heat](https://github.com/personium/openstack-heat)
