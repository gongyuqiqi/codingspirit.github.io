---
title: 使用qemu运行Linux-kernel
date: 2017-11-12 08:40:54
tags:
  - Linux
categories: 编程相关
---
之前想买块MTK的开发板，结果根本没有卖。。。 树莓派今年又不会出4，于是想用qemu边学边玩。
<!--more-->
宿主OS：Ubuntu 17.04
## 准备工作
由于某些众所周知的原因，访问一些国外的服务器非常慢，因此推荐使用国内的镜像，我这里用的是阿里的：
{% asset_img 1.png %}
换完更新源后，个人习惯装一个vim：
```bash
sudo apt-get install vim
```
## 安装arm交叉编译链
```bash
sudo apt-get install gcc-arm-linux-gnueabi
```
也可以装一个arm-linux-gnueabihf，如果硬件带fpu，可以使用该工具。
## 安装qemu
```bash
sudo apt-get install qemu
```
## 下载Linux kernal并编译
从[kernel.org](https://www.kernel.org/)下载源码包。下载完成后解包到任意目录。cd过去后，使用vim新建一个build脚本build.sh,内容如下：
```bash
export  ARCH=arm 
export CROSS_COMPILE=arm-linux-gnueabi- 
make vexpress_defconfig
make zImage -j8
make modules -j8
make dtbs
mkdir extra_folder
cp arch/arm/boot/zImage extra_folder/
cp arch/arm/boot/dts/*ca9.dtb extra_folder/
cp .config extra_folder/
```
运行脚本会使用arm-linux-gnueabi进行编译，并把生成的zImage和dtb文件copy到extra_folder（不然的话每次都手动copy好累。。）
## 下载busybox
busybox能够提供一些基本的指令，如umount,sh,vi等等。在[busybox.net](https://busybox.net/)下载源代码包，当然使用wget或者git clone也是可以的。解包后，cd到代码目录，再写一个build.sh：
```bash
make defconfig
make CROSS_COMPILE=arm-linux-gnueabi-
make install CROSS_COMPILE=arm-linux-gnueabi-
```
运行脚本将在该目录下生成一个_install文件夹。
## 制作根文件系统和镜像
### 创建rootfs
```bash
sudo mkdir rootfs
sudo mkdir rootfs/lib
```
### 复制busybox命令
```bash
sudo cp _install/* -r rootfs/
```
### 复制运行库
```bash
sudo cp -P /usr/arm-linux-gnueabi/lib/* rootfs/lib/
```
### 创建字符设备用于测试
```bash
sudo mkdir -p rootfs/dev
sudo mknod rootfs/dev/tty1 c 4 1
sudo mknod rootfs/dev/tty2 c 4 2
sudo mknod rootfs/dev/tty2 c 4 3
sudo mknod rootfs/dev/tty2 c 4 4
```
c：字符型
4：主设备号
1，2：次设备号
### 生成镜像并格式化生成ext3文件系统
```bash
dd if=/dev/zero of=a9rootfs.ext3 bs=1M count=32
mkfs.ext3 a9rootfs.ext3
```
### 复制文件到镜像中
```bash
sudo mkdir tmpfs
sudo mount -t ext3 a9rootfs.ext3 tmpfs/ -o loop
sudo cp -r rootfs/*  tmpfs/
sudo umount tmpfs
```
## 启动qemu并运行系统
写一个runOS.sh并运行：
```bash
qemu-system-arm -M vexpress-a9 -m 256M -dtb extra_folder/vexpress-v2p-ca9.dtb -kernel extra_folder/zImage -append "root=/dev/mmcblk0 rw" -sd a9rootfs.ext3
```
{% asset_img 2.png %}
然后熟悉的企鹅出现了!
{% asset_img 3.png %}
拷个hello world试一下:
{% asset_img 4.png %}