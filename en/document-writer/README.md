# Personium How to participate in document maintenance / improvement  
In the open source project Personium, not only code but also document contribution are welcome.If you are interested in helping to improve the document, please follow the steps below to add and modify the document, please pullrequest on GitHub.

> __Please prepare a GitHub account__

1. Fork the GitHub repository
    1. [API Reference](https://github.com/personium/api-references)
    1. [Other documents](https://github.com/personium/docs)  

1. Clone to Local repository  

1. Write the document in GFM (Github Flavored Markdown) format and edit the file  

1. Convert to HTML format
    1. If you want to confirm by converting in your own environment, please refer to [Procedure](https://gist.github.com/dixonsiu/28c473f93722e586e6d53b035923967c) 
    1. If confirmation of conversion is unnecessary, Personium project member responds after accepting pull request.  

1. Push to Fork's own GitHub repository and issue a Pull Request to the parent repository of Fork  

By conducting the above procedure, we will review it with Personium project members and publish it in the appropriate form.  
We are waiting for your cooperation.


***

> __Note of the Document description__

 * Line break in sentences 
    If you wish to line break in sentences, do not use `<br>`, enter two space characters and enter a new line.
    However, please use `<br>` if you want line break in the table.
   For example)  
       abcdefg  (two space characters)  
       hijklmn

 * How to disable the automatic conversion of URL to hyperlink during the MD to HTML conversion  
    If you make an entry like "http&#58;//~" in the MD file, it will be automatically converted to a hyperlink. If you do not want to have a hyperlink in the description. You have to explicitly write "`&#58;`" instead of ":".
    For example)
       `http&#58;//`

 * How to write of the cURL command sample  
    If the cURL command sample is longer than **100 characters**, please make a line feed so that the length per line is less than 100 characters.
    For example) 
    curl "https&#58;//{UnitFQDN}/__ctl/Cell" -X POST -i -H 'Authorization: Bearer {AccessToken}' `\`(Append \ to the line break position)
    -H 'Accept: application/json' -d '{"Name":"{CellName}"}'

