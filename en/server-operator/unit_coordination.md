# How to set coordination between units

## Overview

Personium has a great advantage that units that are set up to be separated into different server infrastructures can cooperate with each other.
Specifically, by setting cooperation between units, it becomes possible to link Cells across units.
Although it is not possible to do so, it is recommended that this cooperation setting is used because it shares the ecosystem of applications and users across the unit making full use of this feature of Personium.

Conversely speaking, it is impossible to link Cells that span the unit unless this setting is made, so be careful.

Setting of cooperation between units is performed by setting the following for the unit.

1. Unit secret key
1. Unit certificate
1. Certificate of unit certificate issuer

Unit secret keys are created and managed by the unit operator himself, but there are three options as to who to issue the unit certificate.

1. Have the open source Personium community publish
1. Issued by another unit certificate issuer
1. Create yourself self-signed unit certificate and use it

The unit certificate proves that the unit is not operated by an unauthorized entity, and this is realized by the PKI framework of x509. Specifically, some entity authenticating the unit will be the unit certificate issuer.

## Flow of cooperation setting

The procedure for receiving unit certificate issuance is the same as that for receiving SSL certificate issued by SSL / TLS in x509.
Specifically, we will set coordination between units with the following flow.

1. Unit (server) operator creates secret key and CSR using tools such as openssl
1. Unit operator sends CSR to certificate issuer and requests certificate issuance
1. The certificate issuer examines the request and issues a certificate if there is no problem
1. The unit operator sets the certificate issued by the unit operator and the secret key created by the unit itself as 1

For 2 and 3, the process changes depending on who becomes the unit certificate issuer.

## Creating a private key

Here is the procedure for creating a secret key using openssl.

```console
     # openssl genrsa - out unit.key 2048 - outform DER
```

Example:)

```console
     # openssl genrsa - out unit.key 2048 - outform DER
     Generating RSA private key, 2048 bit long modulus
     ..................................................... .......... +++
     ..................................................... . +++
     e is 65537 (0x10001)
     -------------------------------------------------------------------- ---------------------------------
```

The unit.key obtained here is the secret key.
Confirm that the unit.key is created

```console
    # ls -l
```

Example:)

```console
    # ls
    total 4
    -rw-r--r--. 1 root root 1675 Sep  1 20:27 unit.key
```
## Creating a CSR

Create a CSR using unit.key. The unit.csr obtained below is CSR.
When creating CSR, please set the FQDN to be used for the CN item.

```console
  # openssl req -new -key unit.key -out unit.csr
    > enter the required information interactively.
      * Common Name value should be the unit domain name (required)
```

Example:)


```console
    # openssl req -new -key unit.key -out unit.csr
    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.
    -----
    Country Name (2 letter code) [XX]:
    State or Province Name (full name) []:
    Locality Name (eg, city) [Default City]:
    Organization Name (eg, company) [Default Company Ltd]:
    Organizational Unit Name (eg, section) []:
    Common Name (eg, your name or your server's hostname) []:example.com            <* Enter the unit domain name (required)
    Email Address []:
    Please enter the following 'extra' attributes
    to be sent with your certificate request
    A challenge password []:
    An optional company name []:

```

Submit a certificate based on # # CSR

### When asking for a Personium project

To participate in the Personium unit ecosystem, please ask the Personium project to issue a unit certificate.

⇒ Please request from the Slack community.


### Self-issuing case

To make settings that do not work with other units, you can do this by setting a self-signed unit certificate.
https://github.com/personium/ansible/blob/master/3-server_unit/How_to_generate_Self-signed_Unit_Certificate.md

## Setting up private key and certificate

Set the issued certificate and the secret key created by itself on the server to the server. Please set the following items in the unit setting file.

| Key name | setting content |
|:--|:--|
| x509.key | Unit secret key file path |
| x509.crt | unit certificate file path |
| x509.root | unit certificate issuer's certificate file path |

For x509.root, multiple files can be specified.
If you do not specify anything, the certificate of Personium official CA will be automatically trusted. (It does not define the key)
If any setting is made this action will be invalidated so join the ecosystem of the Personium project
If you do not want to do so, please make some settings.

reference:
https://personium.github.io/en/server-operator/unit_config_list.html

## Become a unit certificate issuer

The open source Personium community is also the unit certificate issuer. If you can support our activities, please join our ecosystem by all means. Participation in the ecosystem is possible by setting unit certificate issued by the open source Personium community in the unit.

On the other hand, if you want to build your own ecosystem, anyone can set up an X509 certificate authority and become a unit certificate issuer
You can form your own ecosystem. In order to become a unit certificate issuer, the following two points are required.

1. Establish an X509 certificate authority
1. Have the unit participating in the ecosystem set up the certificate of the X509 certificate authority set up as 1 as the certificate of the issuer of the unit certificate

If you are interested in this method and want to know specific methods, please contact the community.
