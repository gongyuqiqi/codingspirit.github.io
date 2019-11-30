---
title: Yocto devtool
top: false
tags:
  - Yocto
date: 2019-11-30 22:11:19
categories: 随便写写
---
I have got used to create patch and **bbappend** files manually, now I'm switching to use **devtool** - To be honest it's quite easy to use.
<!--more-->

## Export source code to external patch
```bash
devtool modify <recipe_name> <dst_path_to_export>
```
Then we can do changes based on exported source code.
## Upgrade changes to bbappend
When changes are verified and we need to add changes into bbapned file as a patch, just use git to commit changes, then:
```bash
devtool update-recipe <recipe_name> -m patch -a <dst_layer_path_to_generate_bbapned>
```
## Exit dev mode
```bash
devtool reset <recipe_name>
```
> Note: devtool will not delete exported source code.
