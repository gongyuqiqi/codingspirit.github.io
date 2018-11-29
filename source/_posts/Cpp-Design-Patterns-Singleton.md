---
title: 'C++ Design Patterns: Singleton'
tags:
  - C++
date: 2018-09-12 16:46:08
categories: 编程相关
---

Singleton is a widely used design patterns in software engineering. This post will tell you when should we use Singleton and how to design a universal,template based Singleton base class.

<!--more-->

## Why Singleton

For some special cases, we want one class only can be instantiated only once to avoid unexpected behavior, for example threadpool and logger. Threadpool and logger normally should be instantiated when we start the program and it should have the same lifetime as program. So we need to make sure those class will not be instantiated more than once and also should not be destroyed until program end.

## Differences Between Static Class And Singleton

Static class basically is a bunch of static functions, it's not an OOP design. Singleton can implement interfaces and it's more OOP like.

## How To Design A Singleton Base Class

One of the most important feature of singleton class is non-copyable. To make it non-copyable, delete copy constructor and override operator "=":
```cpp
protected:
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
```
Another part is singleton's constructor and destructor should be private or protected to avoid user call constructor and destructor accidentally. :
```cpp
protected:
    Singleton() = default;
    virtual ~Singleton() = default;
```
set destructor as virtual because it's base class.The only public method is getInstance() which will return static instance of singleton class.

## An example

Full source code [**Singleton.h**](https://github.com/codingspirit/VoiceSpirit/blob/develop/include/Singleton.h):
```cpp
#pragma once

#include <memory>

namespace BaseClass {
template <typename T>
class Singleton {
  public:
    template <typename... Args>
    static T& getInstance(Args&&... args) noexcept {
        static T instance{std::forward<Args>(args)...};
        return instance;
    }

  protected:
    Singleton() = default;
    virtual ~Singleton() = default;
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;
};  // class Singleton

}  // namespace BaseClass

```

In this design, return value of getInstance() is a reference and use template to make it universal. When inherit this class, need to define subclass like this:
```cpp
class MySingleton : public BaseClass::Singleton<MySingleton> {
    friend class BaseClass::Singleton<MySingleton>;
    //declare as friend class of Singleton to give authority to base class can access private method

  public:
    void foo();

  private:
    MySingleton();
    ~MySingleton();
};
```
[**BasicLogger.h**](https://github.com/codingspirit/VoiceSpirit/blob/develop/include/Singleton.h): is also a good example for this.