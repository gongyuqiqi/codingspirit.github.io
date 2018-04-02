---
title: Ubuntu切换python版本
tags:
  - Linux
  - python
date: 2018-04-02 11:38:48
categories: 编程相关
---
  Ubuntu17.10默认的python version是2.7，如果安装了3.6默认的执行版本仍是2.7。如果想要切换python version，可以通过选择alternatives的方式切换版本。
<!--more-->

## 检查当前安装的python版本
  之前遇到一个奇怪的现象，Ubuntu突然不能使用python --version检查版本:
```sh
The program 'python' can be found in the following packages:
 * python-minimal
 * python3
Try: apt install <selected package>
```
使用sudo apt install python3后依然出现上述问题。解决办法：
```sh
sudo apt install python-minimal
```
之后可以使用python --version得到目前系统默认的版本为2.7.14.

## 切换python版本
首先使用下面的命令检查当前是否为python设置了alternatives：
```sh
update-alternatives --list python
```
如果输出:
```sh
update-alternatives: error: no alternatives for python
```
则需要手动添加alternatives。如果我们要切换版本到python3.x，首先我们要使用whereis得到python3的安装位置：
```sh
whereis python3
```
从输出可以看到，当前安装了多个版本的python3，安装位置都在/usr/bin/python3.x：
```sh
python3: /usr/bin/python3.6m /usr/bin/python3 /usr/bin/python3.6 /usr/lib/python3.7 /usr/lib/python3 /usr/lib/python3.6 /etc/python3 /etc/python3.6 /usr/local/lib/python3.6 /usr/include/python3.6m /usr/share/python3 /usr/share/man/man1/python3.1.gz
```
在知道python安装位置后就可以添加alternatives,以python3.6为例：
```sh
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.6 2
#the last "2" stand for priority level
```
其中最后的"2"表示优先级为2。同理，我们也可以把其他版本的python加入alternatives:
```sh
sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1
```
现在使用update-alternatives --list python就可以看到当前python所有的alternatives：
```sh
There are 2 choices for the alternative python (providing /usr/bin/python).

  Selection    Path                Priority   Status
------------------------------------------------------------
  0            /usr/bin/python3.6   2         auto mode
* 1            /usr/bin/python2.7   1         manual mode
  2            /usr/bin/python3.6   2         manual mode

Press <enter> to keep the current choice[*], or type selection number:
```
输入Selection number就可以切换版本啦！
