# Extension: Email sending function
## Mail transmission function specification

Mail is sent from within UserScript via the mail server in Personium. For UserScript, it is exposed as MailSender class of _p.extension scope.


### Outgoing Mail Specification

By using the mail sending function of Extension, send a mail transmission request to the mail server in the following way.

|Header|Contents|Requirement|
|:---|:---|:---|
|To/Cc/Bcc|Destination mail address|Multiple designation possible<br>Display name can be given<br>The display name is converted to Base64 encoding|
|From|Source mail address| Only one can be specified<br>Display name can be given<br>The display name is converted to Base64 encoding|
|Return-Path|Notification destination of sending error|Only one can be specified|
|Content-Type|Format of body|『Content-Type: text/plain; charset="ISO-2022-JP"』Default|
|Content-Transfer-Encoding|Encoding format of body|『Content-Transfer-Encoding: quoted-printable』Default |
|Subject|Title|Subject is converted to Base64 encoding|
|Date|Sent date|Automatically given at the time of transmission|
|No header|Body|Specify body <br>According to the contents of Content-Type, Content-Transfer-Encoding described above, the mail is transmitted|

### Functional restriction

In the mail sending function, we do not support.

* Attach file
* Mail body format other than text / plain

※ Notes

* No virus check is performed on the contents of outgoing mail.
* The specification of the extension header is arbitrary, but the behavior by it is not guaranteed.
* Ther is  no check about  presence of script etc in the body of the mail. Depending on the mail client, there is a possibility that the script is executed, so do not write tags etc in the mail body.
* The relay server in the mail transmission route, the mail header according to the specifications and restrictions of the mail client, the addition / deletion / modification of the text, problems on the mail display are not involved in this function.
* As suggested as a functional requirement, the number of mails is assumed to be 200 emails / day. It is necessary for the application side to consider not to send large number / large volume mails.

※ Operation not compliant with RFC 5322 is not guaranteed.

### Call format in JavaScript

The format of JSON specified when using the mail sending function from within UserScript is as follows.

|Key|Type|Restriction|Contents|Required/Optional|Default value|
|:---|:---|:---|:---|:---|:---|
|to|Array|※1|List of destinations|Optional||
|to.address|String||Destination address|Required||
|to.name|String||Destination display name|Optional|-|
|cc|Array|※1|List of cc destinations|Optional|-|
|cc.address|String||cc Destination address|Required||
|cc.name|String||cc Destination display name|Optional|-|
|bcc|Array|※1|List of bcc destinations|Optional|-|
|bcc.address|String||bcc Destination address|Required||
|bcc.name|String||bcc Destination display name|Optional|-|
|from|Object||Sender|Required||
|from.address|String||Source address|Required||
|from.name|String||Display name of sender|Optional|-|
|reply-to|Array|※2|Reply destination list|Required||
|reply-to.address|String||Reply address|Required||
|reply-to.name|String||Reply-to display name|Optional|-|
|subject|String||Subjec|Required||
|text|String||The content of the email|Required||
|charset|String||Character code of text when sending mail|Optional|ISO-2022-JP|
|envelope-from|String||Reply address (specified when explicitly specifying Return-Path)|Optional|-|
|headers|Map||Optional optional header|Optional|-|
|headers.{key}|String||Header key|Required||
|headers.{value}|String||Value of header|Required||

※1 The addresses that can be specified for to, cc, and bcc are limited to 50 in total. At least one must be specified.  

※2 rThe address that can be specified for reply-to is limited to a maximum of 50 addresses.

### Retry

If you can not send mail, do not retry in  Extension.


### Error notification

Errors that occurred when sending mail are sent to UserScript in the form of a JavaScript Error object.

#### Call sample

```
/**
  Send Mail Extension call expample
*/
function (request) {

    var req = {
        "to" : [
            { "address" : "hoge1@example.com", "name" : "Ichiro Tanaka" },
            { "address" : "hoge2@example.com", "name" : "Jiro Tanaka" }
        ],
        "cc" : [
            { "address" : "hoge3@example.com", "name" : "Saburo Tanaka" }
        ],
        "bcc" : [
            { "address" : "hoge4@example.com", "name" : "Shiro Tanaka" }
        ],
        "from" : { "address" : "hoge5@example.com", "name" : "Goro Tanaka" },
        "reply-to" : [
            { "address" : "hoge6@example.com", "name" : "Rokuro Tanaka" }
        ],
        "subject" : "Title",
        "text" : "Contents of the mail body",
        "charset" : "ISO-2022-JP",
        "envelope-from" : "hoge7@example.com",
        "headers" : { "Organization" : "personium" }
    };

    var sender = new _p.extension.MailSender();
    try {
        sender.send( req );
    } catch (e) {
        alert(e.message);
    }
}
```
