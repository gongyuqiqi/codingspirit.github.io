---
title: 'Jenkins+Gerrit: 自动commit//code review//submit'
tags:
  - shell
  - Continuous integration
date: 2018-03-20 13:08:29
categories: CI
---
  Jenkins+Gerrit的一般工作模式：user commit code to Gerrit->Jenkins test build success->other user code review +2->user submit->Jenkins release build->release SW. 我之前写了个release notes generator, 在Jenasdkins server上release build的时候， 可以自动生成release notes并打包并发给开发者。但是这个release notes在下一次build的时候会因为workspace的清空而被删除，因此希望Jenkins能够将release notes commit到Gerrit并保留下来，最后再自动上传到sharepoint上。实现上述过程后，自动化构建的自动化程度会更高一点，开发者只需在Jenkins上press a button, release就自动完成了。
<!--more-->

## 新建branch
  通常Gerrit trigger jenkins build的时候, jenkins 只会抓取某一次commit，这会导致抓取的code不在任何一个branch上。此时需要新建一个临时的branch，才能在后面进行push:
```sh
git branch "jenkins_temp"
git checkout jenkins_temp
```
## Jenkins检测改动并提交
  首先需要检测文件改动,以一个名为test.txt的文件为例：
```sh
if [ "$(git diff test.txt)" != "" ]; then
#if file has been modfied, do something
echo "Release_Notes.xlsx has been modfied"
else
echo "Release_Notes.xlsx hasn't been modfied"
fi
```
  Staged changes并commit:
```sh
git add test.txt
#if have two files: git add test1.txt text2.txt
git commit -m "jenkins update test.txt
```
另：如果提交时没有生成commit id, 可以通过git hooks实现自动添加commit id。
## Push changes
  然后需要把改动Push到git远端。之前在Jenkins server上配置过git ssh key，因此我可以在server上直接push changes而不会报错。但是如果在Jenkins execute shell中执行脚本会遇到Permission denied的问题，因为execute shell的运行环境是独立的，并没有配置过ssh key。这时可以通过临时添加key的方式进行push：
```sh
  ssh-agent sh -c 'ssh-add C:/Users/jenkins1/.ssh/id_rsa; git push origin
  jenkins_temp:refs/for/master'
```
## verified,code review,submit
  通常来讲，Push到git remote的commit都需要通过test build,如果成功，将会由jenkins verified +1。只后再通过其他人code review, 在code review +2后才能submit，也就是真正合并到remote branch上。由于jenkins只更改了relase notes这种非代码文件，我们希望jenkins能够自动将changes合并到remote branch上。这里就需要通过shell操作Gerrit。从[Gerrit官方文档](https://gerrit-documentation.storage.googleapis.com/Documentation/2.5.1/cmd-review.html)上，我们可以找到一些可以通过ssh连接完成的操作，包括verified,code review,submit等等。注意，这里同样需要指定ssh key，否则Permission denied。
```sh
ssh -i C:/Users/jenkins1/.ssh/id_rsa -p 29418 jenkins1@sw.tymphany.com gerrit review --verified +1 "$(git rev-parse --short HEAD)"
ssh -i C:/Users/jenkins1/.ssh/id_rsa -p 29418 jenkins1@sw.tymphany.com gerrit review --code-review +2 "$(git rev-parse --short HEAD)"
ssh -i C:/Users/jenkins1/.ssh/id_rsa -p 29418 jenkins1@sw.tymphany.com gerrit review -s "$(git rev-parse --short HEAD)"
```
至此，jenkins完成了自动构建。
其他可能有用的git command:
git 获取当前branch name
```sh
git symbolic-ref --short -q HEAD
```
git 获取上一次提交的commit id
```sh
#short
git rev-parse --short HEAD
#long
git rev-parse HEAD
```
