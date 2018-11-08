---
title: Cross compile gRPC for ARM
tags:
  - Linux
  - C++
  - gPRC
date: 2018-11-08 13:04:12
categories: 编程相关
---
 This post will tell you how to cross compile gPRC static lib for ARM.
 前段时间尝试交叉编译gRPC遇到了不少的麻烦，写篇post记录一下。
<!--more-->
gRPC
## Preparation
First of all, you should have gRPC source code. git clone it from github. Then update submodules:
```bash
cd grpc
git submodule update --init
```
## Install zlib for your arm compiler[Optional]
libz is one of gRPC dependencies. If you haven't installed it for your arm compiler yet, you may need to install it. You can get zlib at [zlib Home Site](http://www.zlib.net/). After download and unzip it, set cross compiler and build it:
```bash
export CC=arm-linux-gnueabihf-gcc
export AR=arm-linux-gnueabihf-ar
./configure
make -j4
```
then install it if build succeed:
```bash
make install prefix=/usr/arm-linux-gnueabihf
```

## Compile and install protobuf & gRPC for HOST
protobuf:
```bash
cd grpc/third_party/protobuf
./autogen.sh && ./configure && make -j4
sudo make install -j4
sudo ldconfig
```
gRPC:
```bash
cd ..
make -j4 && sudo make install -j4 && sudo ldconfig
```

## Cross compile static lib for ARM
make plugins first:
```bash
make clean
make plugins CC=arm-linux-gnueabihf-gcc -j4
```
Cross compile gRPC:
```bash
export GRPC_CROSS_COMPILE=true
export GRPC_CROSS_AROPTS="cr --target=elf32-little"
make -j4 HAS_PKG_CONFIG=false \
    CC=arm-linux-gnueabihf-gcc \
    CXX=arm-linux-gnueabihf-g++ \
    RANLIB=arm-linux-gnueabihf-ranlib \
    LD=arm-linux-gnueabihf-ld \
    LDXX=arm-linux-gnueabihf-g++ \
    AR=arm-linux-gnueabihf-ar \
    PROTOBUF_CONFIG_OPTS="--host=arm-linux-gnueabihf --with-protoc=/usr/local/bin/protoc" static
```
**static** is important. I tried to build shared lib but there will be a lot of errors because arm-linux-gnueabihf-ld doesn't take "-Wl" as a parameter. If build succeed, you can find your static lib at "grpc/libs/opt".

reference: https://github.com/grpc/grpc/issues/9719
