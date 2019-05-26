---
title: i.MX setup TFTP and NFS
tags:
  - Linux
date: 2019-05-26 16:03:24
categories: 随便谢谢
---
Using TFTP(Trivial File Transfer Protocol) and NFS(Network File System) to load kernel and rootfs can help to reduce operations of flash write efficiently, which can make you EVK board live longer...

This summary is based on [Alexey](https://github.com/Alexey-Abdulov-Tymphany)'s version, with some modifications according to my experiment.
<!--more-->

## TFTP

### Install necessary tools

```bash
sudo apt-get install xinetd tftpd tftp
```

### Setup TFTP

```bash
mkdir -p /etc/xinetd.d/
nano /etc/xinetd.d/tftp
service tftp
{
    protocol        = udp
    port            = 69
    socket_type     = dgram
    wait            = yes
    user            = nobody
    server          = /usr/sbin/in.tftpd
    server_args     = /srv/tftp
    disable         = no
}
```

create folder to store tftp files:

```bash
sudo mkdir /srv/tftp
sudo chmod -R 777 /srv/tftp
sudo chown -R nobody /srv/tftp
```

restart tftpd by xinetd:

```bash
sudo /etc/init.d/xinetd restart
```

copy device trees/kernel image to tftp folder:

```bash
cp Image /srv/tftp
cp Image-fsl-imx8mq-evk.dtb /srv/tftp/fsl-imx8mq-evk.dtb
```

## NFS

### Install necessary tools

```bash
sudo apt-get install nfs-kernel-server nfs-common portmap
```

### Setup NFS

Add below line at end of */etc/exports*
```
/home/ *(rw,insecure,no_root_squash,no_subtree_check)
```

restart nfs server:
```bash
sudo /etc/init.d/nfs-kernel-server restart
```
create copy of your rootfs:
```bash
cd ~
mkdir imx8-evk-dummy
# goto your yocto image build dir, i.e. imx-yocto-bsp/imx8mmevk_build/tmp/work/imx8mmevk-poky-linux/fsl-image-validation-imx/1.0-r0
cd <your_yocto_image_build_folder>
cp -r rootfs ~/imx8-evk-dummy
```

<span style="color:red">Notice:</span> Seems long path of rootfs will cause rootfs mounting error, suggest copy your rootfs to a short path

## Target
Interrupt board booting up then type into u-boot terminal:


```
setenv nfsroot <path-to-your-rootfs>
setenv image <kernel-image-name-in-tftp-folder>
setenv fdt_file <devid-tree-file-name-in-tftp-folder>
setenv serverip <pc-ip-address>
setenv bootcmd 'run netboot'
sav
reset
```

i.e.:

```
setenv nfsroot /home/alex/imx8-evk-dummy/rootfs
setenv image Image
setenv fdt_file fsl-imx8mm-evk.dtb
setenv serverip 10.0.1.17
setenv bootcmd 'run netboot'
sav
reset
```
