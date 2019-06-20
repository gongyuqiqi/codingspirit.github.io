---
title: 'Webserver bring up (I): Install lighttpd and fastcgi++'
top: false
tags:
  - Linux
  - Web
date: 2019-06-20 18:55:08
categories: 编程相关
---

Webserver bring up(I): Install lighttpd and fastcgi++

<!--more-->

# Install Lighttpd

[Lighttpd](https://www.lighttpd.net/) is a popular high performance webserver.

If you are using Debian based distributions, you can directly install it by apt install:

```bash
sudo apt install lighttpd
```

If you are using Yocto, you also can install it easily because poky already provided recipe for it. you can find it at *poky/meta/recipes-extended/lighttpd/*. 

The default installed version(no matter PC or Yocto) only provides basic functions, fastcgi is not included. To enable support for fastcgi you need to :
1. Modify file **lighttpd.conf**(On PC path is /etc/lighttpd/lighttpd.conf) to add **mod_fcgi** into **server.modules**. 
2. If you are using Yocto, you also need to add **lighttpd-module-fastcgi** to **IMAGE_INSTALL_append** or declare dependencies of module fastcgi in your recipes:
```bb
IMAGE_INSTALL_append += "lighttpd-module-fastcgi"
```

# Install fastcgi++

[fastcgi++(fastcgipp)](https://fastcgipp.isatec.ca) is a C++ FastCGI and Web development platform. I choose this library because it provides support for C++14 and the official site of [fastcgi](http://www.fastcgi.com/) which provides C/C++ libraries before has been closed for several years.  

Seems there is no yocto recipe for fastcgi++ on internet, but it's easy to write a recipe by myself because it supports built by cmake. Here comes my recipe for fastcgi++:

```bb
SUMMARY = "fastcgi++"
DESCRIPTION = "C++ FastCGI and Web development platform"
SECTION = "libs"
LICENSE = "GPL-2.0"
AUTHOR = "Alex.Don.Scofield(codingspirit)"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/GPL-2.0;md5=801f80980d171dd6425610833a22dbe6"

${PN}_REPO = "github.com/eddic/fastcgipp.git"
SRCREV_${PN} = "5a5c3a263595a1792b2867188770bcf4f4df8b83"

TARGET_CC_ARCH += "${LDFLAGS}"

SRC_URI = " \
  git://${${PN}_REPO};name=${PN};protocol=https;nobranch=1;destsuffix=git/${PN} \
  "

S = "${WORKDIR}/git/${PN}"
B = "${WORKDIR}/${BPN}"


EXTRA_OECMAKE = "-DCMAKE_BUILD_TYPE=RELEASE"
inherit cmake

```

BTW to pass cmake runtime parameters in Yocto, we can use **EXTRA_OECMAKE** :

```bb
EXTRA_OECMAKE += "-DBUILD_SAMPLE=ON"
inherit cmake
```
