---
title: Linux USB gadget configfs
top: false
tags:
  - Linux
date: 2019-12-07 11:56:39
categories: 编程相关
---
Using configs we can easily set up usb gadget in user space. You even can make your board as a compound USB device, just by few commands.
<!--more-->

## Enable and mount configfs
```bash
modprobe libcomposite
mount -t configfs configfs /sys/kernel/config
```

## Create gadget(s)
```bash
mkdir /sys/kernel/config/usb_gadget/g1
```

## Create English strings and write to common attributes
```bash
mkdir -p /sys/kernel/config/usb_gadget/g1/strings/0x409
echo ${SERIALNUMBER} > /sys/kernel/config/usb_gadget/g1/strings/0x409/serialnumber
echo ${MANUFACTURER} > /sys/kernel/config/usb_gadget/g1/strings/0x409/manufacturer
echo ${PRODUCT_NAME} > /sys/kernel/config/usb_gadget/g1/strings/0x409/product
```
## Create gadget configuration(s)
```bash
mkdir -p /sys/kernel/config/usb_gadget/g1/configs/c1
mkdir -p /sys/kernel/config/usb_gadget/g1/configs/c1/strings/0x409
echo "Config 1: ADB" > /sys/kernel/config/usb_gadget/g1/configs/c1/strings/0x409/configuration
echo 250 > /sys/kernel/config/usb_gadget/g1/configs/c1/MaxPower
```

## Create gadget function(s)
```bash
# Here we use ffs adb as an example
mkdir -p /sys/kernel/config/usb_gadget/g1/functions/ffs.adb
```

## Associate gadget functions with configuration(s)
```bash
ln -s /sys/kernel/config/usb_gadget/g1/functions/ffs.adb /sys/kernel/config/usb_gadget/g1/configs/c1
```

## Extra setup for gadget functions
Sometime there is some steps need to be done before enabling gadget(i.e. ffs need to be mounted before active)
```bash
  # Create mount point for ffs and start adbd
  mkdir -p "${mount_point}"
  mount -t functionfs adb "${mount_point}" -o uid=0,gid=0
  adbd &
```
If no extra step is needed, we can directly enable gadget

## Enable the gadget
```bash
# Find the available udc
udc=$(ls -1 /sys/class/udc/)
if [ -z $udc ]; then
    echo "No UDC driver registered"
    exit 1
fi
echo "${udc}" > /sys/kernel/config/usb_gadget/g1/UDC
```
## Compound USB Device
To setup a compound USB device, we just need to create several gadget functions and binding then with configuration(s) before enabling the gadget
