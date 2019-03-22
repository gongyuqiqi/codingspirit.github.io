---
title: 'i.MX 8 getting started: create your general layer'
tags:
  - Linux
  - Yocto
date: 2019-03-22 14:21:37
categories: 编程相关
---
This post will tell you how to create your own general layer with a "hello world" app to be built into your EVK.
<!--more-->

## Create layer

Use **bitbake-layers create-layer <layer name\>** to create a general layer.
```bash
$ cd imx-yocto-bsp/source
$ bitbake-layers create-layer meta-alexlayer
```
Notice: 

[Super_Link](http://lzqblog.top)

{% asset_img 1.jpg %}