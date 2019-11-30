---
title: git command备忘录
tags:
  - 日志 
date: 2018-10-21 16:20:36
categories: 随便写写
---
...
<!--more-->

## 全局配置用户名和邮箱:
```bash
git config --global user.name "Alex.Li"
git config --global user.email "Alex.Li@xxxx.com"
```

## ssh密钥生成:
```bash
ssh-keygen -t rsa -C "Alex.Li@xxxx.com"
```

## 储存https/http方式用户名密码:
```bash
git config --global credential.helper store
```

## 添加tag并推送到远端:
```bash
git tag -a 1.0.0 -m 'add version 1.0.0'
git push origin master --tags
```

## 更改一个https仓库为ssh仓库：

*.git/config*中
```
url = https://xxxx.com/somebody/abcdef.git
```
改为
```
url = git@gxxxx.com:somebody/abcdef.git
```
反之则反

## 删除remotes/origin/{branch}
远端分支已经删除， 但本地仍可见remotes/origin/{branch}
```bash
git remote prune origin
```

## repo 操作
对每个子repo进行操作
```bash
repo forall -vc "git cmd"
```
i.e.
```bash
repo forall -vc "git reset --hard"
```
