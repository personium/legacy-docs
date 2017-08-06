# Personium Concepts  

### Based on Standard  

Personium's API is build on international standards.  

<ul class="listStyleTypeNone">
<li>OAuth2.0 for Authorization</li>
<li>WebDAV for File operation</li>
<li>OData for relational data</li>
</ul>

### The three-layered object  
Personium is made up of the following three layer which are the basic.  
![3LayerObject](image/3LayerStructure.png "3LayerObject")  

#### Unit  
<ul class="listStyleTypeNone">
<li><p>A unit is a system infrastructure which runs Personium which have a unique FQDN.</p></li>
<li><p>Since Personium adopts unique distributed architecture, it is possible to create a relationship between units and give privilege based on it.</p></li>
<li><p>In a unit, it is possible to create multiple Cell.</p></li>
</ul>

#### Cell  
<ul class="listStyleTypeNone">
<li>A cell is a fundamental concepts of personium.io.</li>
<li><p>Each Cells are independent as if they are different tenant in multi-tenancy model.</p></li>
<li><p>A Cell provides following feature</p>
<ul class="listStyleTypeNone">
<li>Authentication and authorization</li>
<li>Access Control</li>
<li>Data Store for Applications (Box)</li>
<li>Event Processing, Messaging, Script Execution</li>
</ul></li>
</ul>


#### Box  
<ul class="listStyleTypeNone">
<li><p>A box is data store for application.</p></li>
<li><p>A box can store following data.</p>
<ul class="listStyleTypeNone">
<li>Directory</li>
<li>File Object</li>
<li>OData Data Service</li>
</ul></li>
</ul>

### Box installation  
<ul class="listStyleTypeNone">
<li>It is possible to install the Box in the specified path using the bar file.</li>
<li>For more details, please click <a href="./006_Box_install.html">here</a>.</li>
</ul>

### Collection  
<ul class="listStyleTypeNone">
<li>Collection is a data set stored in Box.</li>
<li><p>There are the following three types.</p>
<ul class="listStyleTypeNone">
<li><h6 id="webdav-model"><a href="./007_WebDAV_model.html">WebDAV model</a></h6></li>
<li><h6 id="odata-model">OData model</h6></li>
<li><h6 id="service-model">Service model</h6></li>
</ul></li>
</ul>

### Cell control object
![Cell control object E-R diagram](image/cell_ctrl_obj.png "Cell control object E-R diagram")

![$Links creation combination list of cell control objects](image/LinkingCellControlObjects.gif "$Links creation combination list of cell control objects")

### Account
coming soon

### Role
coming soon

### Relation
coming soon

### ExtCell
coming soon

### ExtRole
coming soon
