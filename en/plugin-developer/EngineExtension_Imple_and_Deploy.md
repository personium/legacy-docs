# Engine Extension implementation and deployment specification
## Specifications of classes available from JavaScript via Extension

### Notes
* ####  When implementing the Extension class, keep the following points in mind.
	The Extension class runs within the personium-engine environment.  

	For this reason, when standard output, file output, log output, etc. are performed from within the Extension class, side effects are exerted on the personium-engine environment.  

	For the above reasons, basically, the above operation within the Extension class is prohibited.  

	Minimal logs for development and monitoring are allowed, but other standard input / output, file input / output, etc. should not be performed in principle.

### Class design · Implementation specification
* #### Class declaration
	* Package name：Optional, however, it is recommended to consider the relationship with log output.
	* Class name: Ext_{xxxxx}  
	* ##### One of the following inheritance relations must be satisfied.
		* ・ Inherit `org.mozilla.javascript.ScriptableObject`  
		* ・ Implement the `org.mozilla.javascript.Scriptable` interface
		* ・ Inherit`io.personium.engine.extension.support.AbstractExtensionScriptableObject` 


* #### Constructor
	* ##### Default constructor
		* Definition of Java's default constructor is required (public)

	* ##### jsConstructor({argument}...)
		* Methods called from within JavaScript need to have public visibility.

### Method
※ Methods called from within JavaScript need to have public visibility.

* #### getClassName()
	* Implement to return the class name seen from within JavaScript. Within Javascript it is referred to as a class within _p.extension scope.

* #### jsFunction_{Method name}
	* Implementation of methods called from within JavaScript
	※ Overloading with the same method name can not be performed. Compiling is possible, but it is an error in javascript call by Rhino.

* #### jsGet_{Property name}
	* Method implementation for getting property values from within JavaScript

* #### jsSet_{Property name}
	* Method implementation for setting property values from within JavaScript

	※ When accessing properties of a Javascript object, be sure to define jsGet_ {property name}, jsSet_ {property name} as a pair.  

	Constructors, jsFunction, jsGet, jsSet etc can use annotation qualifications such as @ JSConsturcutor, @ JSFunction, @ JSGetter, @ JsSetter etc.

* #### Base abstract class AbstractExtensionScriptableObject
	* When creating an Extension class, you need to inherit org.mozilla.javascript.ScriptableObject or implement the org.mozilla.javascript.Scriptable interface, but provide io.personium.engine.extension.support.AbstractExtensionScriptableObject as Personium are doing.
	* By inheriting this abstract class as a base class, the following functions can be used within the Extension class.

	* ##### getLogger()
		* According to the environment setting of Personium-engine, it becomes possible to output logs from within Extension class. The output category of the log is the same as the package of the extension class.  

		* For this reason, considering the logback setting on the personium-engine side (the current status: logs from packages belonging to io.personium.engine, those above the INFO level are output), then decide the package name of the class for Extension Recommend.

	* #### getProperties()
		* It is possible to automatically read the property file used by the Extension class and use its contents.

### Implementation sample
* #### When not using annotation
```
package io.personium.engine.extension.sampleproject;
import io.personium.engine.extension.support.AbstractExtensionScriptableObject;
public class Ext_Sample extends AbstractExtensionScriptableObject {
		private int count;
		public Ext_Sample() {
			count = 0;
		}
		public void jsConstructor() {
			// Get contents of Property file
			// Property file to read Ext_{Class name to be published in javaScript}.properties
			String message = getProperties().get("initialMessage");
			// Message log output
			getLogger().info(message);
			count = 0;
		}
		public String getClassName() {
			return "Sample";
		}
		public int jsFunction_add(int delta) {
			count += delta;
			// Message log output
			getLogger().debug(String.format("Value %d is added.", delta));
			return count;
		}
		public int jsGet_count() {
			return count;
		}
		public void jsSet_count(int val) {
			count = val;
		}
}
```

* #### When using annotations
```
package io.personium.engine.extension.sampleproject;
import io.personium.engine.extension.support.AbstractExtensionScriptableObject;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGet;
import org.mozilla.javascript.annotations.JSSet;
public class Ext_Sample extends AbstractExtensionScriptableObject {
		private int count;
		@JSConstructor
		public Ext_Sample() {
			// Get contents of Property file
			// Property file to read Ext_{Class name to be published in javaScript}.properties
			String message = getProperties().get("initialMessage");
			// Message log output
			getLogger().info(message);
			count = 0;
		}
		public String getClassName() {
			return "Sample";
		}
		@JSFunction
		public int add(int delta) {
			count += delta;
			// Message log output
			getLogger().debug(String.format("Value %d is added.", delta));
			return count;
		}
		@JSGetter
		public int count() {
			return count;
		}
		@JSSetter
		public void count(int val) {
			count = val;
		}
}
```

* #### Constraint of class input / output (function argument, return value, exception)
	* ##### Function Arguments
		* Primitives and objects passed from JavaScript by Java's Auto-Boxing function can be accepted as arguments with Java type.  

		* ※ Actually, primitives and objects in JavaScript are of the following types and passed to Java classes. It is converted to an appropriate type such as int / double / java.lang.String etc. by Java's Auto-Boxing function and passed to the argument.

|                       |Types in the JavaScript layer|              |Types in the Java layer|
|:----|:---|:---|:---|
|                       |typoeof     |instanceof          |java|
|Long object in Java    |number      |×                  |java.lang.Long|
|Long primitive in Java |number      |×                  |java.lang.Long|
|String in Java         |string      |×                  |java.lang.String|
|Number primitive in JS |number      |×                  |java.lang.Double|
|Number object in JS    |object      |Number              |org.mozilla.javascript.NativeNumber|
|String primitive in JS |string      |×                  |java.lang.String|
|String object in JS    |object      |String              |org.mozilla.javascript.NativeString|

* #### Return value
	* Passing the following return value from Java automatically converts it to the corresponding object in JavaScript and returns.

		* Boolean object → Boolean
		* java.lang.Number object → Number
		* Character objec、String object → String
		* null → null

	* ##### Other returnable class objects
		* InputStream → It is converted to PersoniumInputStream and returned
		* NativeObject → It is converted to PersoniumJSONObject and returned
		* ArrayList<?>  → It is converted to NativeArray and returned

	* ※ Other than the above, ClassShutter refuses to return so that it can not be returned.

	* ##### Exception
		* To throw an exception from a java class, create and throw an exception object using the construct method of the ExtensionErrorConstructor class.

		* ```
throw ExtensionErrorConstructor.construct(message);
```

		* __Exceptions raised from Extension's Java class are converted and returned as follows in JavaScript.__

			* ##### JavaScript Error Object
				* Property: name, message


## Packaging, deployment method
### Packaging

* #### Extension function consists of Artifact below.

	* ##### jar file
		* A jar file containing Java classes for extension and dependent class files.
		* A single jar file may contain multiple Extension classes in some cases.

	* ##### (optional) Property file for Extension class
		* Property file used by Extension Java class that inherited io.personium.engine.extension.support.AbstractExtensionScriptableObject. If you do not use it you do not need to create it.
		* Unlike jar files, property files are created for each Extension Java class.

### jar file

* #### Java classes and related classes for Extension are packaged in a jar file.<br>You can pack multiple Extension classes into one jar file.

	* ##### Note below
		* Since Extension works on the personium-engine application, it is not necessary to pack classes that the personium-engine class loader can load.

		* > As of V1.3.20, classes loaded on the parent class loader (personium-engine) side have priority, so no problem arises.<br>However, there is a possibility of changing to a class loader that preferentially uses it by enclosing an arbitrary version library on the jar side of Extension as a future plan. <br>For this reason, we recommend that you interpret "this class should not be packaged in the loadable class loader of personium-engine".

		* If you set the description in the scope tag of the dependency module of pom.xml to "provided", it is possible to build Maven, but it can be set not to be included in the jar file.
		* The class loader of personium-engine becomes the parent of the class loader for Extension.<br>Therefore, if the same class exists in both the class loader on the personium-engine side and the jar for the extension, the personium-engine side class is used.
		* As a matter of course, if you refer to a class that does not exist in either personium-engine or jar for Extension, you get ClassNotFoundException or NoClassDefFoundError.

### Property file

* Property file name is created according to the following naming convention. : Ext_{Class name to be published in javaScript}.properties
* The contents and format of the property file are optional. When including multibyte characters such as Japanese, it is necessary to encode with ISO 8859_1.
* If this property file exists, the Java class for Extensions that inherits io.personium.engine.extension.support.AbstractExtensionScriptableObject automatically reads the property file.

### Deployment

* The jar file for Extension is deployed in the personium-engine / extensions under the directory set in the system property "io.personium.environment" of the web container in which the Engine is running.
* If the above system property is not specified, the jar file deployed in the following directory is read. : /personium/personium-engine/extensions

* ##### •Property file
	* Write various settings to be used in Extension class in property file. (＊1)
	* Create and deploy property files in the same directory as jar with the following naming conventions.
	* Ext_{lass name to be published in javaScript}.properties

	* (＊1) When inheriting io.personium.engine.extension.support.AbstractExtensionScriptableObject

## How to call in UserScript

* A class for Extension can be referred to as an object in _p.extension scope.
* You can access the methods, properties defined above.

### Extension usage example in JavaScript

```
/**
	Extension's Sample class (Java implementation is Ext_Sample class) method call
*/
function (request) {
	var extension = new _p.extension.Sample();
	try {
		extension.count = 100;
		extension.add(100);
		var sum = extension.count;
		return {
			status: 200,
			headers: {"Content-Type":"text/plain"},
			body: ["Sum is " + sum]
		};
	} catch (e) {
		return {
			status: 500,
			headers: {"Content-Type":"text/plain"},
			body: [e.message]
		};
	}
}

```
