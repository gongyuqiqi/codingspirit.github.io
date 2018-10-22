---
title: git command备忘录
tags:
  - 日志 
date: 2018-10-22 16:20:36
categories: 随便写写
---
...
<!--more-->

全局配置用户名和邮箱:
```bash
git config --global user.name "Alex.Li"
git config --global user.email "Alex.Li@xxxx.com"
```

ssh密钥生成:
```bash
ssh-keygen -t rsa -C "Alex.Li@xxxx.com"
```

储存https/http方式用户名密码:
```bash
git config --global credential.helper store
```