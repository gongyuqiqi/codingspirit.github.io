---
title: 使用@IntDef替代Enum
tags:
  - Java
  - Android
date: 2017-11-27 11:38:18
categories: 编程相关
---
  [有篇Android官方文档](https://developer.android.com/topic/performance/memory.html#Overhead)提到："For example, enums often require more than twice as much memory as static constants. You should strictly avoid using enums on Android." 于是我们使用自定义annotation来代替Enum。
<!--more-->
```java
    @Retention(RetentionPolicy.SOURCE)
    @IntDef({RATE_120HZ, RATE_64HZ, RATE_32HZ, RATE_16HZ, RATE_8HZ, RATE_4HZ, RATE_2HZ, RATE_1HZ})
    public @interface SamplingRate {}
    
    public static final int RATE_120HZ = 0b0000;
    public static final int RATE_64HZ  = 0b0001;
    public static final int RATE_32HZ  = 0b0010;
    public static final int RATE_16HZ  = 0b0011;
    public static final int RATE_8HZ   = 0b0100;
    public static final int RATE_4HZ   = 0b0101;
    public static final int RATE_2HZ   = 0b0110;
    public static final int RATE_1HZ   = 0b0111;
```
@Retention 表示在什么级别保存该注解信息。可选的 RetentionPolicy 参数包括： 
    RetentionPolicy.SOURCE 注解将被编译器丢弃
    RetentionPolicy.CLASS 注解在class文件中可用，但会被VM丢弃
    RetentionPolicy.RUNTIME VM将在运行期也保留注释，因此可以通过反射机制读取注解的信息。
@IntDef内输入原来的枚举变量，最后使用@interface声明注解名称。当需要使用时：
```java
@SamplingRate int rate = RATE_64HZ;
```
真是不方便啊。。。