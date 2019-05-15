# Security of Unit (setting that recommends change from default)

## Overview

When creating a Personium unit using Ansible, unit master token with strong authority is enabled by default. In this chapter, we will explain the setting to recommend change from default.

Recommended settings are as follows.

1. Invalidating the unit master token
1. Management of unit management account

## Invalidating unit master token

The unit master token is supposed to be used at the time of development and testing, and in many cases except special cases, it should be invalidated from the security point of view in the production operation.
However, the newly created Personium does not have a cell or account to be used for unit management. Therefore, an arbitrary unit master token is set up before Ansible execution and it is built with it enabled.

### Unit master token invalidation procedure

The unit master token can be invalidated by performing the following procedure on the server on which the AP service runs.

1. Modification of 'personium-unit-config.properties'

    ```sh
    vi /personium/personium-core/conf/18888/personium-unit-config.properties
    ```

    * Unit master token can be invalidated by commenting out the io.personium.core.masterToken parameter.

    eg.

    ```sh
    ...
    ##### Major Settings Items #####
    # Unit Master Token.
    # Blank string should be configured in production use to disable it.
    # io.personium.core.masterToken=                                       <- Comment out this parameter
    #
    ...
    ```

1. Restart Tomcat

    ```sh
    systemctl restart tomcat
    ```

## Managing unit management accounts

As an account to manage Personium units with Ansible, we have created unit user named unitadmin by default. unitadmin can perform operations such as adding, changing, and deleting resources such as all cells and boxes. Therefore, in an environment built with Ansible, the security level is lowered because it is an account name to be used commonly.

It is necessary to carry out the combination of the following measures in production use.

1. Change the unitadmin account password regularly
1. Rename and use the unitadmin account
1. Rename and use unitadmin Cell
1. Build and use a unit user management mechanism externally

### Change unit user's password

1. Get unit management token (unit user token) accessible to Cell as administrator authority.
    Access as an administrator authority means to operate with authority to create and erase Cell.
    The unit user token is acquired using the unit management account information acquired in [Environment information on units constructed by Ansible](./Confirm_environment_settings.md). <br>
    Use the OAuth 2 Token endpoint API. (Tokens acquired once are valid for 1 hour)

    ```sh
    curl "https://{Personium_FQDN}/unitadmin/__token" \
    -X POST -i -k \
    -d "grant_type=password&username={unitadmin_account}&password={unitudmin_password}&p_target=https://{Personium_FQDN}/" \
    -H "Content-Type: application/x-www-form-urlencoded"
    ```

    If it succeeds, the response is returned from the API in JSON format.
     The value of "access_token" acquired here becomes the unit user token.

    ```json
    {
	"access_token":"PEFzc........(snip)........W9uPg",
	"refresh_token_expires_in":86400,
	"refresh_token":"RA~tw........(snip)........EeWsQ",
	"token_type":"Bearer",
	"expires_in":3600,
	"p_target":"https://{Personium_FQDN}/"
    }
    ```

1. We will change the password using the acquired token. Password change can be changed by specifying an arbitrary password in 'X-Personium-Credential' in the request header of [Account Update API](../apiref/current/215_Update_Account.md).
    In this example, "abcd 1234" is the changed password.

    > **(Note)**  
    > **Because the unit management account has strong authority, please specify the password that is hard to guess as the changed password.**

    ```sh
    curl "https://{Personium_FQDN}/unitadmin/__ctl/Account('{unitadmin_account}')" \
    -X PUT -i -k \
    -d "{\"Name\":\"{unitadmin_account}\"}" \
    -H "X-Personium-Credential:abcd1234" -H "Content-Type: application/json" -H "Authorization:Bearer {Token}"
    ```

    This API does not return a json style response (body).
    It is successful if response code 204 returns.

    ```
    HTTP/1.1 204 No Content
    ```

    > **(Note)**  
    > **When forgetting the changed "unit management password", it is necessary to change the unit management password by using the master token.**　　

### Rename and use the unitadmin account

The default configuration makes it easy to find out which account to obtain a token with strong privileges.
Renaming the unitadmin account eliminates this condition.
In this example, "administrator" is the new account.

```sh
curl "https://unitadmin.{Personium_FQDN}/__ctl/Account('unitadmin')" \
-X PUT -i -k \
-H "X-Personium-Credential:{unitadmin_password}" -H "Content-Type: application/json" -H "Authorization: Bearer {Token}" \
-d "{\"Name\":\"administrator\"}"
```

> **(Note)**  
>**After execution, existing Cell which has been created with unitadmin token can not be accessed except master token.**

### Rename and use unitadmin Cell

The default configuration makes it easy to find the endpoint URL to get a token with strong privileges.
Renaming the unitadmin Cell eliminates this condition.
In this example, "personium-admin" is the modified Cell name.

```sh
curl "https://{Personium_FQDN}/__ctl/Cell(Name='unitadmin')" \
-X PUT -i -k \
-H "Authorization: Bearer {Token}" -H "Content-Type: application/json" \
-d "{\"Name\":\"personium-admin\"}"
```

It is set in the unit-config.properties file on the AP server that the unitadmin Cell is a special Cell that can issue unit user tokens.
It is also necessary to change the settings on the unit-config.properties file in order for the renamed Cell to continue to have the same privileges.

1. Modification of 'personium-unit-config.properties'

    ```sh
    vi /personium/personium-core/conf/18888/personium-unit-config.properties
    ```

    * Modify the io.personium.core.unitUser.issuers parameter to give the renamed Cell the same permissions.

    eg.

    ```sh
    ...
    # befor
    io.personium.core.unitUser.issuers=personium-localunit:/unitadmin/
    # after
    io.personium.core.unitUser.issuers=personium-localunit:/personium-admin/
    ...
    ```

1. Restart Tomcat

    ```sh
    systemctl restart tomcat
    ```

> **(Note)**  
>**After execution, existing Cell which has been created with unitadmin token can not be accessed except master token.**

### Build and use a unit user management mechanism externally

If you have a separate mechanism for issuing tokens that meet the unit user token requirements, you do not need to use the unitadmin Cell itself.

