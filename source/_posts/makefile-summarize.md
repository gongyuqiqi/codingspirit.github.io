---
title: makefile summarize
tags:
  - makefile
date: 2018-06-05 11:02:55
categories: 编程相关
---
  ...
<!--more-->

## Variable Assignment(变量赋值)
### comparison of "**=**", "**:=**" , "**?=**" and "**+=**"
#### "**=**"

Variables defined with '=' are recursively expanded variables. It means that value of this variable will be the last value gived by '=' in makefile. For example:
```makefile
a = foo
b = $(a) abc
a = oof
```
In this case, the value of **b** will be **oof abc**.

#### "**:=**"

Variables defined with ':=' are simply expanded variables. Just like "**=**" in other language(C/C++/C#/Java). For example:
```makefile
a := foo
b := $(a) abc
a := oof
```
In this case, the value of **b** will be **foo abc**.

#### "**?=**"

We can use '?=' to set a value to a variable only if this variable is not set yet. For example:
```makefile
a ?= foo
```
It is similar to:
```makefile
ifeq ($(origin a), undefined)
a = bar
endif
```

#### "**+=**"

'+=' is using for appending text. It will appending a **space** between two text.For example:
```makefile
a = first
a += second
```
In this case, the value of **a** will be **first second**.

## Useful Makefile Functions
  In makefile, functions should be called like this:
```makefile
var = $(functionname arg1,arg2,arg3...)
```

### wildcard
**wildcard** will help you get specific file name list in a dir.For example:
```makefile
SRC_DIR := src
SOURCES := $(wildcard $(SRC_DIR)/*.cpp)
```
In this case, SUORCES will be set like this(if *.cpp exists in SRC_DIR):
```makefile
src/a.cpp src/b.cpp src/c.cpp 
```
### addprefix
**addprefix** is using for add one value to the front of another value. For example:
```makefile
a = $(addsuffix .o,foo bar)
```
**a** will be set as '**foo.o bar.o**'
### patsubst
**$(patsubst pattern,replacement,text)**:Finds whitespace-separated words in text that match pattern and replaces them with replacement([gnu.org](https://www.gnu.org/software/make/manual/html_node/Text-Functions.html#index-_0025_002c-quoting-in-patsubst))
For example:
```makefile
a = $(patsubst %.cpp,%.o,a.cpp b.h c.cpp)
```
**a** will be set as '**a.o b.h c.o**'
### notdir
**$(notdir names…)**:remove dir in names.For example:
```makefile
a = $(notdir src/foo.c src/bar.c)
```
**a** will be set as '**foo.c bar.c**'

### Using those functions to genreate *.o file and exec files in specific dir
```makefile
SRC_DIR:=src
OBJ_DIR:=obj
OUT_DIR:=out
SOURCES:=$(wildcard $(SRC_DIR)/*.cpp)
OBJECTS:=$(addprefix $(OBJ_DIR)/,$(patsubst %.cpp,%.o,$(notdir $(SOURCES))))
```

## Phony Targets(伪目标)
If we have a recipe :
```makefile
clean:
	rm -rf $(OBJ_DIR) $(OUT_DIR)
```
It will works well until one day you add one file called **clean**. In this case, you need add .PHONY:
```makefile
.PHONY:clean
clean:
	rm -rf $(OBJ_DIR) $(OUT_DIR)
```
If we do this, ‘make clean’ will run the recipe regardless of whether there is a file named clean.
