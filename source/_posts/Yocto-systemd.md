---
title: 'Yocto: systemd'
top: false
tags:
  - Yocto
  - Linux
date: 2019-06-07 18:38:38
categories: 随便写写
---
As a replacement of System V init, systemd has been supported by Yocto long time ago. Let's take a look at how to implement a Yocto recipe for systemd services.
<!--more-->

## Prepare .service file

An example of service config file **mydaemon.service**:

```
[Unit]
Description=My Daemon

[Service]
User=root
Group=root
Type=simple
ExecStart=/my_daemon/my_daemon_start.sh
StandardOutput=null
```

## Write a systemd recipe

First of all, don't forget add your service file into source files:

```bb
SRC_URI = " \
  git://${${PN}_REPO};name=${PN};protocol=http;nobranch=1;destsuffix=git/${PN} \
  file://mydaemon.service \
  "
```

As you can see I put service file and application source code separately. You can put service file into your source code git repo as well.

Then to add systemd into Yocto recipe, you need to inherit your recipe from **systemd** class:

```bb
inherit systemd
```

BTW Yocto support multiple inheritance, in my case I was trying to setup a cmake based application as a startup application when system booting up, so :

```bb
inherit cmake systemd
```

Notice: Here is a short introduction from [Yocto reference manual](https://www.yoctoproject.org/docs/2.2/ref-manual/ref-manual.html)
> The systemd class provides support for recipes that install systemd unit files.
> The functionality for this class is disabled unless you have "systemd" in DISTRO_FEATURES.
> Under this class, the recipe or Makefile (i.e. whatever the recipe is calling during the do_install task) installs unit files into ${D}${systemd_unitdir}/system. If the unit files being installed go into packages other than the main package, you need to set SYSTEMD_PACKAGES in your recipe to identify the packages in which the files will be installed.
> You should set SYSTEMD_SERVICE to the name of the service file. You should also use a package name override to indicate the package to which the value applies. If the value applies to the recipe's main package, use ${PN}. Here is an example from the connman recipe:

>     SYSTEMD_SERVICE_${PN} = "connman.service"
        
> Services are set up to start on boot automatically unless you have set SYSTEMD_AUTO_ENABLE to "disable".

> For more information on systemd, see the "Selecting an Initialization Manager" section in the Yocto Project Development Manual.


As you can see, we *should set SYSTEMD_SERVICE to the name of the service file*. 

```bb
SYSTEMD_SERVICE_${PN} = "mydaemon.service"
```

The last step is write a **do_install** task to install our services into target. The problem is in my scenario, cmake class already provided a **do_install** task, if we just override **do_install** task as below:

```bb
do_install() {
  install -D -p -m0644 ${WORKDIR}/mydaemon.service \
    ${D}${systemd_unitdir}/system/mydaemon.service
}
```

cmake install task will not be executed. To fix this, we need to add **cmake_do_install** into overridden **do_install** task:

```bb
do_install() {
  cmake_do_install
  install -D -p -m0644 ${WORKDIR}/mydaemon.service \
    ${D}${systemd_unitdir}/system/mydaemon.service
}
```

Then cmake install task will be executed, mydaemon.service will be installed and setup as well.
