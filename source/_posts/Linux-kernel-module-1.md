---
title: Linux kernel module(1)
tags:
  - Linux
date: 2018-12-09 11:01:48
categories: 编程相关
---
This post will give a simple introduction to Linux kernel module(Part I.).

Linux kernel module简介(一)
<!--more-->
When your system has a new external chip connected(I2C,SPI,GPIO etc.), you might need to write a driver for it by yourself. Normally this driver will be implemented as a kernel module. 

Kernel module development is a complex task and it's hard to make it clear in one simple post. If you want to learn more, a good choice is taking a look at Linux kernel source code.

## The simplest example of kernel module
### Source code
```c
// file:simple_module.c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/printk.h>

static int __init sample_module_init(void)
{
	printk(KERN_INFO "Hello world!\n");

	return 0;
}

static void __exit sample_module_exit(void)
{
	printk(KERN_INFO "Bye!\n");
}

module_init(sample_module_init);

module_exit(sample_module_exit);

MODULE_AUTHOR("Coding Spirit <coding@spirit.com>");
MODULE_LICENSE("GPL v2");
```

This simple example shows basic structure of kernel module. A **init** function and a **exit** function must be declared, to avoid warnings, **MODULE_AUTHOR** and **MODULE_LICENSE** is needed as well.

### Makefile
To compile it to kernel module(.ko) file, we need to write a Makefile for it.
```mk
simple-module-objs := simple_module.o

obj-m := simple-module.o
```
In this Makefile **$(<executable>-objs)** lists all objects used to link the final executable, **obj-m** means loadable module goals, it will generate a standalone .ko file, then we can use **insmod** to install it. If change it to **obj-y**, it will be compiled into kernel.

### Test this module

```bash
# clear debug message first
dmesg -c
# see modules already installed
lsmod
# install simple module
insmod simple-module.ko
# check debug message
dmesg
# remove simple module
rmmod simple-module.ko
dmesg
```

### What are module_init/exit and __init/exit

module_init and module_exit are macros to help register module init and exit functions. Use your F12, go to definition:
```c
#define __define_initcall(fn, id) \
	static initcall_t __initcall_##fn##id __used \
	__attribute__((__section__(".initcall" #id ".init"))) = fn;
```

*fn* is your function name, *id* stand for priority, for module_init, this level will be set as 6.

After using this marco, your init function will be called when **do_initcalls** was called(*init/main.c*)
```c
static void __init do_initcalls(void)
{
	int level;

	for (level = 0; level < ARRAY_SIZE(initcall_levels) - 1; level++)
		do_initcall_level(level);
}
```
as for marco **__init** , It tells the compiler to put this function in a special section, which is declared in vmlinux.lds. **__init** puts the function in the ".init.text" section.

Take a look at where it defined(/linux-4.9/include/linux/init.h):
```c
/* These macros are used to mark some functions or
 * initialized data (doesn't apply to uninitialized data)
 * as `initialization' functions. The kernel can take this
 * as hint that the function is used only during the initialization
 * phase and free up used memory resources after*/
 
/* These are for everybody (although not all archs will actually
   discard it in modules) */
#define __init		__section(.init.text)
#define __initdata	__section(.init.data)
#define __exitdata	__section(.exit.data)
#define __exit_call	__used __section(.exitcall.exit)

#ifdef MODULE
#define __exit		__section(.exit.text)
#else
#define __exit		__used __section(.exit.text)
#endif
```
As we can see in comment, if you use **__init** to mark it, memory will be released after initialization.

## A I2C module

This simple module is useless, let's take a look at a more useful one: [*linux/drivers/iio/light/st_uvis25_i2c.c*](https://github.com/torvalds/linux/blob/6f0d349d922ba44e4348a17a78ea51b7135965b1/drivers/iio/light/st_uvis25_i2c.c)

```c
/*
 * STMicroelectronics uvis25 i2c driver
 *
 * Copyright 2017 STMicroelectronics Inc.
 *
 * Lorenzo Bianconi <lorenzo.bianconi83@gmail.com>
 *
 * Licensed under the GPL-2.
 */

#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/acpi.h>
#include <linux/i2c.h>
#include <linux/slab.h>
#include <linux/regmap.h>

#include "st_uvis25.h"

#define UVIS25_I2C_AUTO_INCREMENT	BIT(7)

static const struct regmap_config st_uvis25_i2c_regmap_config = {
	.reg_bits = 8,
	.val_bits = 8,
	.write_flag_mask = UVIS25_I2C_AUTO_INCREMENT,
	.read_flag_mask = UVIS25_I2C_AUTO_INCREMENT,
};

static int st_uvis25_i2c_probe(struct i2c_client *client,
			       const struct i2c_device_id *id)
{
	struct regmap *regmap;

	regmap = devm_regmap_init_i2c(client, &st_uvis25_i2c_regmap_config);
	if (IS_ERR(regmap)) {
		dev_err(&client->dev, "Failed to register i2c regmap %d\n",
			(int)PTR_ERR(regmap));
		return PTR_ERR(regmap);
	}

	return st_uvis25_probe(&client->dev, client->irq, regmap);
}

static const struct of_device_id st_uvis25_i2c_of_match[] = {
	{ .compatible = "st,uvis25", },
	{},
};
MODULE_DEVICE_TABLE(of, st_uvis25_i2c_of_match);

static const struct i2c_device_id st_uvis25_i2c_id_table[] = {
	{ ST_UVIS25_DEV_NAME },
	{},
};
MODULE_DEVICE_TABLE(i2c, st_uvis25_i2c_id_table);

static struct i2c_driver st_uvis25_driver = {
	.driver = {
		.name = "st_uvis25_i2c",
		.pm = &st_uvis25_pm_ops,
		.of_match_table = of_match_ptr(st_uvis25_i2c_of_match),
	},
	.probe = st_uvis25_i2c_probe,
	.id_table = st_uvis25_i2c_id_table,
};
module_i2c_driver(st_uvis25_driver);

MODULE_AUTHOR("Lorenzo Bianconi <lorenzo.bianconi83@gmail.com>");
MODULE_DESCRIPTION("STMicroelectronics uvis25 i2c driver");
MODULE_LICENSE("GPL v2");
```

### What are module_i2c_driver and MODULE_DEVICE_TABLE

Like module_init we mentioned, they are marcos as well. Use your holy F12:
```c
/**
 * module_i2c_driver() - Helper macro for registering a modular I2C driver
 * @__i2c_driver: i2c_driver struct
 *
 * Helper macro for I2C drivers which do not do anything special in module
 * init/exit. This eliminates a lot of boilerplate. Each module may only
 * use this macro once, and calling it replaces module_init() and module_exit()
 */
#define module_i2c_driver(__i2c_driver) \
	module_driver(__i2c_driver, i2c_add_driver, \
			i2c_del_driver)
```
As for **module_driver**, marco AGAIN:
```c
/**
 * module_driver() - Helper macro for drivers that don't do anything
 * special in module init/exit. This eliminates a lot of boilerplate.
 * Each module may only use this macro once, and calling it replaces
 * module_init() and module_exit().
 *
 * @__driver: driver name
 * @__register: register function for this driver type
 * @__unregister: unregister function for this driver type
 * @...: Additional arguments to be passed to __register and __unregister.
 *
 * Use this macro to construct bus specific macros for registering
 * drivers, and do not use it on its own.
 */
#define module_driver(__driver, __register, __unregister, ...) \
static int __init __driver##_init(void) \
{ \
	return __register(&(__driver) , ##__VA_ARGS__); \
} \
module_init(__driver##_init); \
static void __exit __driver##_exit(void) \
{ \
	__unregister(&(__driver) , ##__VA_ARGS__); \
} \
module_exit(__driver##_exit);
```

As you can see, those marcos actually are encapsulations of module_init/exit.

And for **MODULE_DEVICE_TABLE**, it's just help to create an alias, if there is any nodes in **dts** has the same **compatible** with your drivers, **probe** function will be called.
As a driver writer, you have no idea how will user enumerate it(By of or i2c), so provide both of them is necessary.

```c
#ifdef MODULE
/* Creates an alias so file2alias.c can find device table. */
#define MODULE_DEVICE_TABLE(type, name)					\
extern typeof(name) __mod_##type##__##name##_device_table		\
  __attribute__ ((unused, alias(__stringify(name))))
#else  /* !MODULE */
#define MODULE_DEVICE_TABLE(type, name)
#endif
```
**regmap** etc. will be discussed in Part II. 

To be continued...
