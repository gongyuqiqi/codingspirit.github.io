---
title: 'Python: Use mmap to create shared memory for IPC'
top: false
tags:
  - python
date: 2020-06-13 14:35:11
categories: 编程相关
---

There are several ways to achieve IPC, shared memory is one of those. In this post, we will try to create shared memory via **mmap** module in python.

<!--more-->

## Write to shared memory

```py
#!/usr/bin/python3
import mmap
import contextlib


def write_to_mem(file, share_data):
    with contextlib.closing(mmap.mmap(file.fileno(), 1024, access=mmap.ACCESS_WRITE)) as mem:
        mem.seek(0)
        mem.write(share_data.encode())
        mem.write('\x00'.encode() * (1024 - len(share_data.encode())))
        mem.flush()


with open('data.dat', 'w') as f:
    f.write('\x00' * 1024)

file = open('data.dat', 'r+')
write_to_mem(file, 'hello')

```

Here we created a 1026 bytes file, which will be mapped to memory. 

## Read from shared memory

```py
#!/usr/bin/python3
import mmap
import contextlib
import time

with open('data.dat', 'r') as f:
    with contextlib.closing(mmap.mmap(f.fileno(), 1024, access=mmap.ACCESS_READ)) as mem:
        s = mem.read(1024)
        print(s)

```

Here we mapped *data.dat* file to memory and read from it.
