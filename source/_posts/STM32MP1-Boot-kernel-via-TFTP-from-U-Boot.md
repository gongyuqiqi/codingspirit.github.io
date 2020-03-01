---
title: 'STM32MP1: Boot kernel via TFTP from U-Boot'
top: false
tags:
  - Linux
  - U-Boot
date: 2020-02-16 13:52:30
categories: 系统构建
---
Today I just managed to boot kernel via TFTP on STM32MP1 board but steps I go through are quite different with i.MX8. Thus, I think there is a necessity to have a short note about this 🖋
<!--more-->

## Pre-requirements
- TFTP server on PC is up and running([Check here](https://lzqblog.top/2019-05-26/i-MX-setup-TFTP-and-NFS/))
- Board and PC are in same LAN

## TFTP folder
```bash
~/data/srv/tftp$ tree
.
├── pxelinux.cfg
│   └── 01-e2-a4-06-a5-8f-7f
├── stm32mp157a-cp.dtb
└── uImage

1 directory, 3 files

```
U-Boot will use `pxe` command to load PXE configuration file from TFTP server(PC in my scenario). PXE configuration file has the same format with *extlinux.conf*, and the file name is related to hardware MAC address. In my case <span style="color:red">*01-e2-a4-06-a5-8f-7f*</span>:
- 01: ARP type 1 for ethernet
- e2-a4-06-a5-8f-7f: MAC address

Inside my PXE configuration file(01-e2-a4-06-a5-8f-7f):
```
menu title Select the boot mode
 DEFAULT eMMC
 TIMEOUT 20
 LABEL initramfs
 	KERNEL uImage
 	FDT stm32mp157a-cp.dtb
 	INITRD uInitrd
 	APPEND rootwait rw earlyprintk console=ttySTM0,115200
 LABEL nfs
 	KERNEL uImage
 	FDT stm32mp157a-cp.dtb
 	APPEND root=/dev/nfs nfsroot=192.168.0.106:/nfsroot ip=dhcp rootwait rw earlyprintk console=ttySTM0,115200
 LABEL sdcard
 	KERNEL uImage
 	FDT stm32mp157a-cp.dtb
 	APPEND root=/dev/mmcblk0p6 rootwait rw earlyprintk console=ttySTM0,115200
 LABEL eMMC
 	KERNEL uImage
 	FDT stm32mp157a-cp.dtb
 	APPEND root=/dev/mmcblk1p6 rootwait rw earlyprintk console=ttySTM0,115200
```
With this configuration file we could choose in U-Boot where to load rootfs when booting.

## U-Boot
After TFTP server and folder are ready, we can proceed on U-Boot. If `CONFIG_NET_RANDOM_ETHADDR` has not been set in uboot defconfig or MAC address haven't been configured before, we might need to setup MAC address(<span style="color:red">*ethaddr*</span>) manually. Meanwhile <span style="color:red">*serverip*</span> need to be set as well:
```
env set ethaddr e2:a4:06:a5:8f:7f
env set serverip 192.168.0.106
saveenv
```
After that we only need to `run bootcmd_pxe` if we want to load kernel from TFTP:

```
Hit any key to stop autoboot:  0 
STM32MP> run bootcmd_pxe
ethernet@5800a000 Waiting for PHY auto negotiation to complete. done
BOOTP broadcast 1
DHCP client bound to address 192.168.0.101 (2 ms)
missing environment variable: pxeuuid
missing environment variable: bootfile
Retrieving file: pxelinux.cfg/01-e2-a4-06-a5-8f-7f
Using ethernet@5800a000 device
TFTP from server 192.168.0.106; our IP address is 192.168.0.101
Filename 'pxelinux.cfg/01-e2-a4-06-a5-8f-7f'.
Load address: 0xc4200000
Loading: #
         8.8 KiB/s
done
Bytes transferred = 608 (260 hex)
Config file found
Select the boot mode
1:      initramfs
2:      nfs
3:      sdcard
4:      eMMC
Enter choice: 4:        eMMC
missing environment variable: bootfile
Retrieving file: uImage
Using ethernet@5800a000 device
TFTP from server 192.168.0.106; our IP address is 192.168.0.101
Filename 'uImage'.
Load address: 0xc2000000
Loading: #################################################################
         #################################################################
         #################################################################
         ##################T ###############################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         ##############################################################
         265.6 KiB/s
done
Bytes transferred = 6640192 (655240 hex)
append: root=/dev/mmcblk1p6 rootwait rw earlyprintk console=ttySTM0,115200
missing environment variable: bootfile
Retrieving file: stm32mp157a-cp.dtb
Using ethernet@5800a000 device
TFTP from server 192.168.0.106; our IP address is 192.168.0.101
Filename 'stm32mp157a-cp.dtb'.
Load address: 0xc4000000
Loading: #############
         188.5 KiB/s
done
Bytes transferred = 62891 (f5ab hex)
## Booting kernel from Legacy Image at c2000000 ...
   Image Name:   Linux-4.19.49
   Created:      2019-06-09   7:17:25 UTC
   Image Type:   ARM Linux Kernel Image (uncompressed)
   Data Size:    6640128 Bytes = 6.3 MiB
   Load Address: c2000040
   Entry Point:  c2000040
   Verifying Checksum ... OK
## Flattened Device Tree blob at c4000000
   Booting using the fdt blob at 0xc4000000
   XIP Kernel Image ... OK
   Using Device Tree in place at c4000000, end c40125aa

Starting kernel ...

[    0.000000] Booting Linux on physical CPU 0x0
[    0.000000] Linux version 4.19.49 (oe-user@oe-host) (gcc version 8.2.0 (GCC)) #1 SMP PREEMPT Sun Jun 9
[    0.000000] CPU: ARMv7 Processor [410fc075] revision 5 (ARMv7), cr=10c5387d
```
