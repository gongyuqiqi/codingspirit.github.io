---
title: Yocto debugging commands
top: false
tags:
  - Yocto
date: 2020-03-07 18:58:58
categories: 系统构建
---
Notes about some useful Yocto debugging commands

<!--more-->

## Checking owner of installed files
Assuming that build environments is ready(which means you can run `bitbake` normally), using `oe-pkgdata-util` can help to find the recipe who populated it. i.e:

```bash
oe-pkgdata-util find-path /lib/ld-2.28.so
glibc: /lib/ld-2.28.so
```
*/lib/ld-2.28.so* was installed by **glibc**

## Checking packages are going to install

```bash
bitbake -g <image> && cat pn-buildlist | grep -ve "native" | sort | uniq
```

## Checking packages installed

There are several *.manifest* files under the path of built images, which contained packages has been installed.

## Checking variables inside recipes

`bb.utils.contains` can help to check variables inside recipes. i.e. we'd like to install some files base on **MACHINE_FEATURES** :

```bb
do_install() {
    if ${@bb.utils.contains('MACHINE_FEATURES','ethernet','true','false',d)}; then
        install -d ${D}${systemd_unitdir}/network/
        install -m 0644 ${WORKDIR}/10-eth.network ${D}${systemd_unitdir}/network/
    fi

    if ${@bb.utils.contains('MACHINE_FEATURES','wifi','true','false',d)}; then
        install -d ${D}${systemd_unitdir}/network/
        install -m 0644 ${WORKDIR}/51-wlan.network ${D}${systemd_unitdir}/network/
    fi
}
```
Below is the python code from openembedded, which explains usage of this function:

```py
 def contains(variable, checkvalues, truevalue, falsevalue, d):
    """Check if a variable contains all the values specified.
    Arguments:

    variable -- the variable name. This will be fetched and expanded (using
    d.getVar(variable)) and then split into a set().
 
    checkvalues -- if this is a string it is split on whitespace into a set(),
    otherwise coerced directly into a set().
 
    truevalue -- the value to return if checkvalues is a subset of variable.
 
    falsevalue -- the value to return if variable is empty or if checkvalues is
    not a subset of variable.
 
    d -- the data store.
    """
```
