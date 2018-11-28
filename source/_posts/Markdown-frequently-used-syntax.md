---
title: Markdown frequently used syntax
tags:
  - null
  - null
date: 2018-11-24 10:55:05
categories:
---
Markdown 常用语法小结

写了这么久的md, 偶尔还是会忘记一些细节，干脆写篇日志总结一下，以备不时之需
<!--more-->

## Highlight(突出显示)
| Item                   | How to use                                | Preview                                 |
| :--------------------: | :---------------------------------------: | :-------------------------------------: |
| Bold(加粗)             | \*\*Bold Text\*\*                         | **Bold Text**                           |
| Italic(斜体)           | \*Italic Text\*                           | *Italic Text*                           |
| Strike Through(删除线) | \~\~Strike Through Text\~\~               | ~~Strike Through Text~~                 |
| Font Color(字体颜色)   | \<span style="color:red">Red Text\</span> | <span style="color:red">Red Text</span> |

Markdown本身不支持更改字体颜色，但是支持插入HTML, 上面的\<span>其实是HTML的标签。 如果还有其他奇奇怪怪的要求(如更改字体，更改大小，设置指针样式)，也可以使用\<span>实现:

\<span style="color:blue;font-family:Impact;font-style:italic;cursor:crosshair;font-size:30px">Impact font blue italic 30px with crosshair pointer\</span>

<span style="color:blue;font-family:Impact;font-style:italic;cursor:crosshair;font-size:30px">Impact font blue italic 30px with crosshair pointer</span>

## Table(表格)

Markdown 支持插入简单的表格:

```md
| Item1  | Item2  | Item3  |
| ------ | ------ | ------ |
| Value1 | Value2 | Value3 |
```
效果如下：
| Item1  | Item2  | Item3  |
| ------ | ------ | ------ |
| Value1 | Value2 | Value3 |

## Flow(流程图)

Markdown 甚至支持直接画流程图

![](Markdown-frequently-used-syntax/006HJgYYgy1fex00ntxymg308c08c74b.png)
![]()

```flow
flow
st=>start: Start
op=>operation: Your Operation
cond=>condition: Yes or No?
e=>end
st->op->cond
cond(yes)->e
cond(no)->op
```

![](006HJgYYgy1fex00ntxymg308c08c74b.png)

注： hexo默认不支持Markdown流程图，要在hexo上显示流程图需要安装hexo-filter-flowchart

```bash
npm install --save hexo-filter-flowchart
```

[Suerp_Link](http://lzqblog.top)


![](1.jpg)