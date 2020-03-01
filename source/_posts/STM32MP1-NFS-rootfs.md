---
title: 'STM32MP1: NFS rootfs'
top: false
tags:
  - Linux
date: 2020-03-01 09:36:40
categories: 系统构建
---
Last and this weekend I spend some time on mounting NFS rootfs on STM32MP1... There are some PHY driver issues and permission issues troubled me a lot...
<!--more-->

## Pre-requirements
- <span style="color:red">nfs-kernel-server</span> has been installed on server side
- Board and PC are in same LAN

## Exports settings
Assuming that we will put board rootfs under */home/alex/data/srv/nfs*:

```bash
cat /etc/exports
# /etc/exports: the access control list for filesystems which may be exported
#		to NFS clients.  See exports(5).
#
# Example for NFSv2 and NFSv3:
# /srv/homes       hostname1(rw,sync,no_subtree_check) hostname2(ro,sync,no_subtree_check)
#
# Example for NFSv4:
# /srv/nfs4        gss/krb5i(rw,sync,fsid=0,crossmnt,no_subtree_check)
# /srv/nfs4/homes  gss/krb5i(rw,sync,no_subtree_check)
#
/home/alex/data/srv/nfs 192.168.0.*(rw,sync,no_subtree_check,no_root_squash)
```

- Wildcard in ip address(192.168.0.\*) is supported, which is helpful for multiple boards
- <span style="color:red">no_root_squash</span> will map NFS client root user as NFS server root user

After modifying */etc/exports*, we can restart nfs server and check server exports:

```bash
sudo systemctl restart nfs-kernel-server
sudo exportfs

/home/alex/data/srv/nfs
		192.168.0.*
```

## PXE configuration file
Create PXE configuration file for nfs booting. U-boot will pass chosen parameters to kernel.

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
 	APPEND root=/dev/nfs ip=192.168.0.102 nfsroot=192.168.0.101:/home/alex/data/srv/nfs,nfsvers=3 rootwait rw earlyprintk console=ttySTM0,115200
 LABEL sdcard
 	KERNEL uImage
 	FDT stm32mp157a-cp.dtb
 	APPEND root=/dev/mmcblk0p6 rootwait rw earlyprintk console=ttySTM0,115200
 LABEL eMMC
 	KERNEL uImage
 	FDT stm32mp157a-cp.dtb 
 	APPEND root=/dev/mmcblk1p6 rootwait rw earlyprintk console=ttySTM0,115200
```

**LABEL nfs** was set for nfs rootfs:
- **root=/dev/nfs** Set nfs as rootfs
- **ip=192.168.0.102** Set board ip address, also can be **dhcp**
- **nfsroot=192.168.0.101:/home/alex/data/srv/nfs,nfsvers=3** Specify nfs server ip, rootfs dir and nfs version

## Unpack boards rootfs and modify permissions
Unpack board rootfs under the path we set at exports setting, then we need to modify permissions for some folders and files:

```bash
#!/bin/sh

TARGET_RFS_PATH="/home/alex/data/srv/nfs"

sudo chown -R ${USER} "${TARGET_RFS_PATH}/var/lib/systemd"
sudo chown -R ${USER} "${TARGET_RFS_PATH}/var/lib/machines"
suidfiles=$(sudo find ${TARGET_RFS_PATH} -perm /u=s)
if [ -n "$suidfiles" ] ; then
    sudo chown root:root ${suidfiles}
    sudo chmod u+s ${suidfiles}
fi

```
> Reference: [kontron-electronics](https://git.kontron-electronics.de/yocto-ktn/yocto-ktn/blob/master/scripts/init-remote2)


## Booting the board

```
U-Boot 2018.11-stm32mp-r3 (Nov 14 2018 - 16:10:06 +0000)

CPU: STM32MP157AAA Rev.B
Model: CP STM32MP157A Dev Board V1
Board: stm32mp1 in basic mode (cp,stm32mp157a-cp)
DRAM:  512 MiB
Clocks:
- MPU : 650 MHz
- MCU : 208.878 MHz
- AXI : 266.500 MHz
- PER : 24 MHz
- DDR : 533 MHz
NAND:  0 MiB
MMC:   STM32 SDMMC2: 0, STM32 SDMMC2: 1
Loading Environment from EXT4... OK
In:    serial
Out:   serial
Err:   serial
invalid MAC address in OTP 00:00:00:00:00:00Net:   eth0: ethernet@5800a000
Hit any key to stop autoboot:  0 
STM32MP> 
STM32MP> 
STM32MP> run bootcmd_pxe
ethernet@5800a000 Waiting for PHY auto negotiation to complete. done
BOOTP broadcast 1
BOOTP broadcast 2
DHCP client bound to address 192.168.0.102 (990 ms)
missing environment variable: pxeuuid
missing environment variable: bootfile
Retrieving file: pxelinux.cfg/01-e2-a4-06-a5-8f-7f
Using ethernet@5800a000 device
TFTP from server 192.168.0.101; our IP address is 192.168.0.102
Filename 'pxelinux.cfg/01-e2-a4-06-a5-8f-7f'.
Load address: 0xc4200000
Loading: #
         11.7 KiB/s
done
Bytes transferred = 658 (292 hex)
Config file found
Select the boot mode
1:      initramfs
2:      nfs
3:      sdcard
4:      eMMC
Enter choice: 2
2:      nfs
missing environment variable: bootfile
Retrieving file: uImage
Using ethernet@5800a000 device
TFTP from server 192.168.0.101; our IP address is 192.168.0.102
Filename 'uImage'.
Load address: 0xc2000000
Loading: #################################################################
         ################################################################T #
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #####################################################T ############
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         #################################################################
         ###################T ##############################################
         #################################################################
         #################################################################
         #################################################################
         ########
         76.2 KiB/s
done
Bytes transferred = 6693440 (662240 hex)
append: root=/dev/nfs ip=192.168.0.102 nfsrootdebug nfsroot=192.168.0.101:/home/alex/data/srv/nfs,nfsver0
missing environment variable: bootfile
Retrieving file: stm32mp157a-cp.dtb
Using ethernet@5800a000 device
TFTP from server 192.168.0.101; our IP address is 192.168.0.102
Filename 'stm32mp157a-cp.dtb'.
Load address: 0xc4000000
Loading: #############
         86.9 KiB/s
done
Bytes transferred = 62891 (f5ab hex)
## Booting kernel from Legacy Image at c2000000 ...
   Image Name:   Linux-4.19.49
   Created:      2019-06-09   7:17:25 UTC
   Image Type:   ARM Linux Kernel Image (uncompressed)
   Data Size:    6693376 Bytes = 6.4 MiB
   Load Address: c2000040
   Entry Point:  c2000040
   Verifying Checksum ... OK
## Flattened Device Tree blob at c4000000
   Booting using the fdt blob at 0xc4000000
   XIP Kernel Image ... OK
   Using Device Tree in place at c4000000, end c40125aa

Starting kernel ...

......

[    2.174568] stm32_rtc 5c004000.rtc: setting system clock to 2000-01-01 00:01:41 UTC (946684901)
[    2.183611] Generic PHY stmmac-0:00: attached PHY driver [Generic PHY] (mii_bus:phy_addr=stmmac-0:00,)
[    2.197201] usb 1-1: new high-speed USB device number 2 using ehci-platform
[    2.214199] dwmac4: Master AXI performs any burst length
[    2.218189] stm32-dwmac 5800a000.ethernet eth0: No Safety Features support found
[    2.225501] stm32-dwmac 5800a000.ethernet eth0: IEEE 1588-2008 Advanced Timestamp supported
[    2.234275] stm32-dwmac 5800a000.ethernet eth0: registered PTP clock
[    2.398628] hub 1-1:1.0: USB hub found
[    2.401140] hub 1-1:1.0: 4 ports detected
[    3.277927] stm32-dwmac 5800a000.ethernet eth0: Link is Up - 100Mbps/Full - flow control rx/tx
[    3.317195] IP-Config: Guessing netmask 255.255.255.0
[    3.320790] IP-Config: Complete:
[    3.324024]      device=eth0, hwaddr=e2:a4:06:a5:8f:7f, ipaddr=192.168.0.102, mask=255.255.255.0, gw=5
[    3.334612]      host=192.168.0.102, domain=, nis-domain=(none)
[    3.340520]      bootserver=255.255.255.255, rootserver=192.168.0.101, rootpath=
[    3.349127] ALSA device list:
[    3.350873]   No soundcards found.
[    3.519504] VFS: Mounted root (nfs filesystem) on device 0:15.
[    3.529231] devtmpfs: mounted
[    3.532594] Freeing unused kernel memory: 1024K
[    3.535990] Run /sbin/init as init process
[    5.499422] systemd[1]: System time before build time, advancing clock.
[    6.079843] NET: Registered protocol family 10
[    9.012545] Segment Routing with IPv6
[    9.200958] systemd[1]: systemd 239 running in system mode. (+PAM -AUDIT -SELINUX +IMA -APPARMOR +SMA)
[    9.222756] systemd[1]: Detected architecture arm.

Welcome to ST OpenSTLinux - EGLfs - (A Yocto Project Based Distro) 2.6-snapshot-20191124 (thud)!

[    9.371860] systemd[1]: Set hostname to <stm32mp1-cp>.
[    9.476160] systemd[1]: Hardware watchdog 'STM32 Independent Watchdog', version 0
[    9.483357] systemd[1]: Set hardware watchdog to 30s.
[   15.306868] systemd[1]: Unnecessary job for dev-ttySTM0.device was removed.
[   15.315395] systemd[1]: Started Dispatch Password Requests to Console Directory Watch.
[  OK  ] Started Dispatch Password Requests to Console Directory Watch.
[   15.374193] systemd[1]: Listening on Journal Socket (/dev/log).
[  OK  ] Listening on Journal Socket (/dev/log).
[   15.407969] systemd[1]: Listening on initctl Compatibility Named Pipe.
[  OK  ] Listening on initctl Compatibility Named Pipe.
[   15.479167] systemd[1]: Listening on udev Control Socket.
[  OK  ] Listening on udev Control Socket.
[   15.653309] systemd[1]: Reached target Remote File Systems.
[  OK  ] Reached target Remote File Systems.
[   15.696091] systemd[1]: Listening on Network Service Netlink Socket.
[  OK  ] Listening on Network Service Netlink Socket.
[   15.764924] systemd[1]: Listening on Syslog Socket.
[  OK  ] Listening on Syslog Socket.
[   15.802155] systemd[1]: Created slice system-getty.slice.
[  OK  ] Created slice system-getty.slice.
[   15.837597] systemd[1]: Reached target Swap.
[  OK  ] Reached target Swap.
[  OK  ] Started Forward Password Requests to Wall Directory Watch.
[  OK  ] Reached target Paths.
[  OK  ] Listening on udev Kernel Socket.
[  OK  ] Created slice User and Session Slice.
[  OK  ] Reached target Slices.
[  OK  ] Listening on Journal Socket.
         Mounting Kernel Debug File System...
         Starting Journal Service...
         Mounting POSIX Message Queue File System...
         Starting Mount partitions...
         Starting Create list of required st��…ce nodes for the current kernel...
         Starting udev Coldplug all Devices...
         Starting Apply Kernel Variables...
         Mounting FUSE Control File System...
         Mounting Kernel Configuration File System...
         Starting Remount Root and Kernel File Systems...
         Mounting Temporary Directory (/tmp)...
[  OK  ] Listening on Process Core Dump Socket.
[  OK  ] Created slice system-serial\x2dgetty.slice.
[  OK  ] Started Journal Service.
[  OK  ] Mounted Kernel Debug File System.
[  OK  ] Mounted POSIX Message Queue File System.
[  OK  ] Started Mount partitions.
[  OK  ] Started Create list of required sta��…vice nodes for the current kernel.
[  OK  ] Started Apply Kernel Variables.
[  OK  ] Mounted FUSE Control File System.
[  OK  ] Mounted Kernel Configuration File System.
[  OK  ] Started Remount Root and Kernel File Systems.
[  OK  ] Mounted Temporary Directory (/tmp).
         Starting Create Static Device Nodes in /dev...
         Starting Flush Journal to Persistent Storage...
[   18.106096] systemd-journald[130]: Received request to flush runtime journal from PID 1
[  OK  ] Started Flush Journal to Persistent Storage.
[  OK  ] Started udev Coldplug all Devices.
[  OK  ] Started Create Static Device Nodes in /dev.
         Starting udev Kernel Device Manager...
[  OK  ] Reached target Local File Systems (Pre).
[  OK  ] Reached target Containers.
         Mounting /var/volatile...
[  OK  ] Mounted /var/volatile.
         Starting Load/Save Random Seed...
[  OK  ] Reached target Local File Systems.
         Starting Create Volatile Files and Directories...
[  OK  ] Started Load/Save Random Seed.
[  OK  ] Started udev Kernel Device Manager.
[  OK  ] Started Create Volatile Files and Directories.

ST OpenSTLinux - EGLfs - (A Yocto Project Based Distro) 2.6-snapshot stm32mp1-cp ttySTM0

stm32mp1-cp login: root (automatic login)

root@stm32mp1-cp:~# 
```
