# Server Software Operator's Guide  

It is a document for people who use Personium's server software to build Personium units, who build/deploy/configure Personium server programs, and who wish to provide / operate a PDS service environment using Personium.

Those who access the constructed/configured Personium unit using the unit user token and perform the main task of the unit administrator, that is, the creation/payout of the Cell, management of the dispensed Cell, etc., Please see [Guide for unit administrator](../unit-administrator/).

## Unit configuration design

Personium has a scalable architecture. For evaluation and personal use, it is also possible to build a Personium unit packed all in one machine. Meanwhile, it is recommended to adopt the layer structure such as Web layer - AP layer - DB layer because non-function such as security and performance is required to construct units used by hundreds or thousands of people, You should take a minimum of 2-3 configurations. Furthermore, in order to construct a large-scale unit that tens of thousands to hundreds of thousands of people use every day, each layer is scaled out and it takes 10 to 20 units.

First of all, let's decide what kind of unit to make and design the necessary infrastructure.

## Construction of unit

It is convenient to use Ansible to build units. If you are building in an Open Stack-based cloud environment, you can almost unit-build by using Heat Template. Of course, you can also build units using any cloud or physical/virtual machine without using these automatic construction tools. However, since we do not have the physical strength to prepare and maintain the document etc. for that, please build it with reference to the server infrastructure building procedure using Heat of Open Stack and the automatic unit building procedure using Ansible.

We are pleased to hear the story that the unit was built in various environments on the #infra channel of the community.

### Automatic construction of server infrastructure

* [openstack-heat](https://github.com/personium/openstack-heat)

### Automatic building of unit

Using Ansible, we are publishing guides for building a single unit for evaluation and a unit with three units for small-scale production use.

* [Getting Started with Personium using Ansible](./setup.md)

If you customize Ansible's Playbook introduced above, you can build units of various configurations.  
When you want to check how to manage the unit after build, please click [here](../unit-administrator/).

### Environment information of units automatically constructed by Ansible

Confirm the environment information of the main middleware of the unit constructed using Ansible.

* [Confirmation of the environment of units constructed with Ansible](./Confirm_environment_settings.md)


### Environment information of units automatically constructed by Ansible

Confirm the environment information of the main middleware of the unit constructed using Ansible.

* [Confirmation of the environment of units constructed with Ansible](./Confirm_environment_settings.md)

### Apply plugin

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
* [openstack-heat_cent6_8](https://github.com/personium/openstack-heat_cent6_8)
