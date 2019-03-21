---
title: 'C/C++ mixed programming error: undefined reference'
tags:
  - C++
  - C
date: 2019-03-18 20:37:06
categories: 编程相关
---
The solution for this issue is very sample, add <span style="color:red">#ifdef __cplusplus extern "C"</span> in your C header files. I have seen a lots of C header files with this code, I also know that those codes will help C code compatible with C++ code, but I had never try to dig in to find out why those codes works until few weeks ago I was trying to call a lib written by C but lib headers didn't surround with <span style="color:red">#ifdef __cplusplus extern "C"</span>.(Shame on me) This post will tell you why.
<!--more-->

## Why "undefined reference"?

Normally, You can see this "undefined reference" error when compiler can't find your functions' definition. But if you click into this post, I'm pretty sure that you have checked your code more than once. The reason why you meet this error while mixing programming is C and C++ compilers have different name mangling rules while compiling. In C, one function only can have one definition, but in C++ polymorphism was added so method can have same name but different version definitions with different parameter lists.
i.e. you have a function named foo in C:
```C
void foo(int a){};
```
Meanwhile you have 2 method in C++:
```C++
void foo(int a){};
void foo(char a){};
```

C compiler might rename it as **__foo** in assembly. But C++ have to do some changes to make sure method name is unique in assembly, normally in C++ compiler it might be renamed with parameter list like **__Z1_foo_int** and **__Z1_foo_char**. There will be linking error like "undefined reference" when your trying to link a C lib which was compiled by C compiler and your C header files didn't add <span style="color:red">#ifdef __cplusplus extern "C"</span>, because C++ compiler trying to find a symbol named **__Z1_foo_int** but it can't because it was renamed as **__foo** by C compiler.

## Why extern "C" can solve this?
```C
#ifdef __cplusplus

extern "C" {

#endif

/**** your declarations *****/

#ifdef __cplusplus

  }

#endif
```
C compiler will ignore those codes because of marco **#ifdef __cplusplus**, it's easy to understand. But if you are using a C++ compiler, this **extern "C"** will be active and tell C++ compiler "you should link those functions with C name mangling rules". In this case, C++ can find function definitions correctly in your C lib.
