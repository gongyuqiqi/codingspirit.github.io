---
title: 'Yocto recipe: Git'
tags:
  - Linux
  - Yocto
date: 2019-05-27 19:22:59
categories: 编程相关
---
This is a short post give a sample of Yocto recipe which fetches source codes from git server.
<!--more-->


```bb
SUMMARY = "Example"
DESCRIPTION = "Recipes for Example"
LICENSE = "GPL-2.0"
AUTHOR = "Alex Li(Alex.Li@xxxx.com)"
#Path of your LICENSE file and checksum
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/GPL-2.0;md5=801f80980d171dd6425610833a22dbe6"

#Build dependencies
DEPENDS += "boost ark-base ark-log"
#Run time dependencies
RDEPENDS_${PN} = "ark-base ark-log boost-program-options"

#Your git repo address, will be usedby ${SRC_URI}
${PN}_REPO = "github.com/codingspirit/example.git"
#Set to ${AUTOREV} to automatically fetch the newest commit, you can set specific commit id as well
SRCREV_${PN} = "${AUTOREV}"

#Files need to be installed into target need to declare in recipe
FILES_${PN} += "/example/*"

#Set git source, name, protocol, branch, git clone destination. You can use "branch=branchname" to  specify branch to require bitbake check after fetching
#"nobranch=1" will skip branch check
SRC_URI = " \
  git://${${PN}_REPO};name=${PN};protocol=https;nobranch=1;destsuffix=git/${PN} \ 
  "
# Path of source code. We set it to "git/${PN}" in SRC_URI
S = "${WORKDIR}/git/${PN}"
# Build path, ${BPN} means "The bare name of the recipe"
B = "${WORKDIR}/${BPN}"

inherit cmake
```
