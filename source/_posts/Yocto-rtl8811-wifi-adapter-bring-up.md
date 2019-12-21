---
title: Yocto rtl8811 wifi adapter bring up
top: false
tags:
  - Linux
  - Yocto
date: 2019-12-21 14:36:59
categories: 编程相关
---
Brief notes about bring up rtl8811 and wlan0 on STM32MP1
<!--more-->

## rtl8811 driver
There is an open source driver on [Github](https://github.com/abperiasamy/rtl8812AU_8821AU_linux) and I have verified *4235b0ec7d7220a6364586d8e25b1e8cb99c36f1* works well on my ubuntu PC. But to make it work in yocto, we need a patch to its makefile since it's not designed as a yocto kernel module:

*0001-modify-makefile-to-support-yocto.patch*
```git
From 0bc225d55b3e4e2269519b699f972401c227bc0c Mon Sep 17 00:00:00 2001
From: "Alex.Don.Scofield" <lizhiqin46783937@live.com>
Date: Sun, 15 Dec 2019 22:08:04 +0800
Subject: [PATCH] modify makefile to support yocto

---
 Makefile | 9 +++++++--
 1 file changed, 7 insertions(+), 2 deletions(-)

diff --git a/Makefile b/Makefile
index dc027f3..8de8dfd 100644
--- a/Makefile
+++ b/Makefile
@@ -893,10 +893,12 @@ ifndef KVER
 KVER ?= $(shell uname -r)
 endif
 ifndef KSRC
-KSRC := /lib/modules/$(KVER)/build
+# KSRC := /lib/modules/$(KVER)/build
+KSRC := $(KERNEL_SRC)
 endif
 ifndef MODDESTDIR
-MODDESTDIR := /lib/modules/$(KVER)/kernel/drivers/net/wireless/
+# MODDESTDIR := /lib/modules/$(KVER)/kernel/drivers/net/wireless/
+MODDESTDIR := $(O)
 endif
 INSTALL_PREFIX :=
 endif
@@ -1621,6 +1623,9 @@ all: modules
 modules:
 	$(MAKE) ARCH=$(ARCH) CROSS_COMPILE=$(CROSS_COMPILE) -C $(KSRC) M=$(shell pwd)  modules
 
+modules_install:
+	$(MAKE) ARCH=$(ARCH) CROSS_COMPILE=$(CROSS_COMPILE) -C $(KSRC) M=$(shell pwd)  modules_install
+
 strip:
 	$(CROSS_COMPILE)strip $(MODULE_NAME).ko --strip-unneeded
 
-- 
2.17.1


```
Then we create recipes for it(*kernel-module-rtl8812au_0.1.bb*):
```bb
SUMMARY = "Driver for rtl8811au/8812au/8821au"
LICENSE = "GPL-2.0"
PV = "0.1"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/GPL-2.0;md5=801f80980d171dd6425610833a22dbe6"

inherit module

${PN}_REPO = "github.com/abperiasamy/rtl8812AU_8821AU_linux.git"
SRCREV_${PN} = "4235b0ec7d7220a6364586d8e25b1e8cb99c36f1"

SRC_URI = " \
  git://${${PN}_REPO};name=${PN};protocol=https;nobranch=1;destsuffix=git/${PN} \
  file://0001-modify-makefile-to-support-yocto.patch \
  "

S = "${WORKDIR}/git/${PN}"

RPROVIDES_${PN} += "kernel-module-rtl8812au"

```

Add it to image recipe and flash built image into target, kernel module will be installed at */lib/modules/${KERNEL_VERSION}/extra/rtl8812au.ko*. If it has been proper init, you can see those logs in **dmesg**:
```
[    8.321575] RTL871X: module init start
[    8.354748] RTL871X: rtl8812au v4.3.14_13455.20150212_BTCOEX20150128-51
[    8.359924] RTL871X: rtl8812au BT-Coex version = BTCOEX20150128-51
[    8.586779] RTL871X: rtw_ndev_init(wlan0)
[    8.607811] usbcore: registered new interface driver rtl8812au
[    8.612202] RTL871X: module init ret=0
```
## wpa-supplicant
If we use **wpa-supplicant** to manage and config wifi, we need to have a **\*.network** file under **/lib/systemd/network/**:

```
[Match]
Name=wlan0

[Network]
DHCP=ipv4
```

and a we also need a config file for wpa-supplicant:

*/etc/wpa_supplicant/wpa_supplicant-wlan0.conf*
```conf
ctrl_interface=/var/run/wpa_supplicant
eapol_version=1
ap_scan=1
fast_reauth=1

network={
    ssid="WIFI SSID"
    psk="WIFI PASSWD"
    priority=5
}
```
If we want wlan be ready after system booting, we need to append wpa-supplicant. Create *wpa-supplicant_%.bbappend*:
```
FILESEXTRAPATHS_prepend := "${THISDIR}/${PN}:"

SRC_URI += " \
    file://51-wlan.network \
    file://wpa_supplicant-wlan0.conf \
    "
FILES_${PN} += " \
    ${systemd_unitdir}/network/51-wlan.network \
    ${sysconfdir}/wpa_supplicant/wpa_supplicant-wlan0.conf \
"

SYSTEMD_AUTO_ENABLE = "enable"
SYSTEMD_SERVICE_${PN}_append = " wpa_supplicant@wlan0.service"

do_install_append() {
    install -d ${D}${sysconfdir}/wpa_supplicant/
    install -m 0600 ${WORKDIR}/wpa_supplicant-wlan0.conf ${D}${sysconfdir}/wpa_supplicant/

    if ${@bb.utils.contains('DISTRO_FEATURES','systemd','true','false',d)}; then
        install -d ${D}${systemd_unitdir}/network/
        install -m 0644 ${WORKDIR}/51-wlan.network ${D}${systemd_unitdir}/network/

        install -d ${D}${sysconfdir}/systemd/system/multi-user.target.wants/
        ln -s ${systemd_unitdir}/system/wpa_supplicant@.service \
        ${D}${sysconfdir}/systemd/system/multi-user.target.wants/wpa_supplicant@wlan0.service
    fi
}

```
