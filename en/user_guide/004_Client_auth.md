# Client registration & authentication
To register client, following steps are required.

### 1. Create a cell used for client registration & authentication (application cell)
* Create a cell.
* Create an account used for client authentication in the cell.
* If client authentication level is "confidential", then create a roll which name is "confidentialClient" and box is "\__" and link it to the account created.

### 2. Set client information and client authentication requirement level to the resource.
* Set URL of the application cell as schema to the box which is accessed from the client.
* Set client authentication requirement level to the resource. More details, see client authentication requirement level.
* This cell can be same cell of the application cell or not.

### 3. Deploy HTML File (For Implicit Grant Only)
* Deploy HTML File with embedded Javascript which returns access token to the application cell.
  * URL of the HTML File is the "Redirection URI" which is used in the flow.

### 4. Retrieve client authentication information when required.

* Send authentication requests to the token endpoint of the application cell with created account with following.
  * "client secret", used in Resouce Owner Password Credentials Grant is the token in response body.
  * "client id" is the URL of the application cell.
