---
title: 'GCC: __attribute__ ((__packed__))'
top: false
tags:
  - C
  - C++
date: 2020-02-11 21:28:07
categories: 编程相关
---
> It specifies that a member field has the smallest possible alignment. That is, one byte for a variable field, and one bit for a bitfield, unless you specify a larger value with the aligned attribute.
<!--more-->

## Data alignment and data structure padding
GCC will enable structure padding by default, i.e. we have a structure like this:

```c
struct test_struct {
    char a;
    char b;
    int c;
};
struct test_struct test_data;
```

`sizeof(test_data)` will be <span style="color:red">8</span> due to structure padded to to 4-byte alignment: 1(char a) + 1(char b) + <span style="color:red">**2(added)**</span>  + 4(int c).

## __attribute__ ((__packed__))
GCC provides us a way to disable structure padding, i.e. we have a structure like this:

```c
struct test_struct {
    char a;
    char b;
    int c;
} __attribute__((__packed__));
struct test_struct test_data;
```

`sizeof(test_data)` will be <span style="color:red">6</span>: 1(char a) + 1(char b) + 4(int c). With this some memory can be saved.

We also can use `__attribute__((packed, aligned(X)))` to specify padding size(X should be powers of 2):

```c
struct test_struct {
    char a;
    char b;
    int c;
    char d;
} __attribute__((packed, aligned(2)));
struct test_struct test_data;
```

`sizeof(test_data)` will be <span style="color:red">8</span>: 1(char a) + 1(char b) + 4(int c) + 1(char d) + <span style="color:red">**1(added)**</span>
