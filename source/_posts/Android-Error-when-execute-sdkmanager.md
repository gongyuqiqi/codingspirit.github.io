---
title: 'Android: Error when execute sdkmanager'
tags:
  - Android
date: 2019-05-28 20:51:25
categories: 问题记录
---
Quick fix for error that **sdkmanager** throw exception when trying to call **sdkmanager --license** and **sdkmanager --list**.
<!--more-->

## Error messages

```
Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema
    at com.android.repository.api.SchemaModule$SchemaModuleVersion.<init>(SchemaModule.java:156)
    at com.android.repository.api.SchemaModule.<init>(SchemaModule.java:75)
    at com.android.sdklib.repository.AndroidSdkHandler.<clinit>(AndroidSdkHandler.java:81)
    at com.android.sdklib.tool.sdkmanager.SdkManagerCli.main(SdkManagerCli.java:73)
    at com.android.sdklib.tool.sdkmanager.SdkManagerCli.main(SdkManagerCli.java:48)
    Caused by: java.lang.ClassNotFoundException: javax.xml.bind.annotation.XmlSchema
    at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:582)
    at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:185)
    at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:496)
    ... 5 more
```

## Quick fix

In Windows:
1. Go to C:\Users\Alex.Li\AppData\Local\Android\Sdk\tools\bin
2. Open sdkmanager.bat with editor
3. Add <span style="color:blue">  -XX:+IgnoreUnrecognizedVMOptions --add-modules java.se.ee</span> after <span style="color:red">set DEFAULT_JVM_OPTS="-Dcom.android.sdklib.toolsdir=%~dp0\.."</span>:
```bat
set DEFAULT_JVM_OPTS="-Dcom.android.sdklib.toolsdir=%~dp0\.." -XX:+IgnoreUnrecognizedVMOptions --add-modules java.se.ee
```

In Linux:
1. Go to **<android_sdk_path>/tools/bin**, **<android_sdk_path>** is the path where you unzip your Android SDK.
2. Open sdkmanger with editor
3. Add <span style="color:blue">  -XX:+IgnoreUnrecognizedVMOptions --add-modules java.se.ee</span> after <span style="color:red">DEFAULT_JVM_OPTS='"-Dcom.android.sdklib.toolsdir=$APP_HOME"'"</span>:
```bat
DEFAULT_JVM_OPTS='"-Dcom.android.sdklib.toolsdir=$APP_HOME" -XX:+IgnoreUnrecognizedVMOptions --add-modules java.se.ee'
```
