---
title: 'i.MX 8 getting started: create your kernel module'
tags:
  - Yocto
  - Linux
date: 2019-03-26 20:34:32
categories: 系统构建
---
The normal way that using yocto to do kernel development is really painful... Maybe try out-of-tree build is a better choice.

<!--more-->

## Create and add your layer
```bash
$ bitbake-layers create-layer --example-recipe-name alexkernel meta-alexkernel
```

```bash
$ bitbake-layers add-layer ../sources/meta-alexkernel/
```
Or you can use exist layer instead, just create recipe files under your layer.

## Add your source code and Makefile

**alex_module.c**:
```c
#include <linux/module.h>
#include <linux/printk.h>
#include <linux/init.h>

static int __init alex_module_init(void)
{
    printk(KERN_INFO "Hello from alex module!\n");
    return 0;
}

static void __exit alex_module_exit(void)
{
    printk(KERN_INFO "Bye from alex module!\n");
    return 0;
}

module_init(alex_module_init);

module_exit(alex_module_exit);

MODULE_AUTHOR("Coding Spirit <coding@spirit.com>");
MODULE_LICENSE("GPL v2");

```

**Makefile**:
```mk
obj-m := alex_module.o

SRC := $(shell pwd)

all:
	$(MAKE) -C $(KERNEL_SRC) M=$(SRC)

modules_install:
	$(MAKE) -C $(KERNEL_SRC) M=$(SRC) modules_install

clean:
	rm -f *.o *~ core .depend .*.cmd *.ko *.mod.c
	rm -f Module.markers Module.symvers modules.order
	rm -rf .tmp_versions Modules.symvers

```

## Modify recipe files and conf file

**alexkernel_0.1.bb**:

```bb
SUMMARY = "kernel module example"
DESCRIPTION = "Recipe created by bitbake-layers"
LICENSE = "GPL-2.0"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/GPL-2.0;md5=801f80980d171dd6425610833a22dbe6"

inherit module

SRC_URI = "file://Makefile \
            file://alex_module.c"

S = "${WORKDIR}"

```

Notice: bitbake support inheritance. Inherit from a exist bbclass will be much easier than rewrite one all by yourself. Take a look at [openembedded github](https://github.com/openembedded/openembedded-core/tree/master/meta/classes) to check how did they implement a base bbclass. BTW **cmake.bbclass** might be useful if you trying to support cmake. 

**layer.conf**:

```conf
# We have a conf and classes directory, add to BBPATH
BBPATH .= ":${LAYERDIR}"

# We have recipes-* directories, add to BBFILES
BBFILES += "${LAYERDIR}/recipes-*/*/*.bb \
            ${LAYERDIR}/recipes-*/*/*.bbappend"


IMAGE_INSTALL_append += "alexkernel"
KERNEL_MODULE_AUTOLOAD += "alex_module"

BBFILE_COLLECTIONS += "meta-alexkernel"
BBFILE_PATTERN_meta-alexkernel = "^${LAYERDIR}/"
BBFILE_PRIORITY_meta-alexkernel = "6"
LAYERSERIES_COMPAT_meta-alexkernel = "sumo"

```

Notice: Module will automatically get loaded when system booting up if **KERNEL_MODULE_AUTOLOAD** was set.

We should have a folder tree as below:
```bash
.
├── conf
│   └── layer.conf
├── COPYING.MIT
├── README
└── recipes-alexkernel
    └── alexkernel
        ├── alexkernel-0.1
        │   ├── alex_module.c
        │   └── Makefile
        └── alexkernel_0.1.bb
```

## rebuild your rootfs and image
```bash
bitbake fsl-image-qt5-validation-imx
```

## Check your environment variables by **bitbake -e**

**bitbake -e** is a very useful command when you trying to debug build problem.

i.e. Check the rootfs folder of your image:
```bash
bitbake -e <image> | grep ^IMAGE_ROOTFS=
```
Check the ${WORKDIR} of your recipe:
```bash
bitbake -e <recipe> | grep ^WORKDIR=
```
