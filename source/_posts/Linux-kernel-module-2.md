---
title: Linux kernel module(2)
tags:
  - Linux
date: 2018-12-16 09:33:48
categories: 编程相关
---
This post will give a simple introduction to Linux kernel module(Part II.).

Linux kernel module简介(二)
<!--more-->
Let's continue the unfinished parts we left in [Part I.](https://lzqblog.top/2018-12-08/Linux-kernel-module-1/).
## A I2C module
### What is regmap

**regmap** is a new API added in kernel 3.1. It helps to provide a abstraction for I2C/SPI/IRQ etc. operations. If chips provide both I2C and SPI interfaces, using regmap also can help to reuse part of code. In this example(st_uvis25, a UVI sensor), it provides another SPI driver(st_uvis25_spi.c), and a interfaces-nonrelevant file(st_uvis25_core.c) as well. st_uvis25_core.c will not care which kind of interfaces you are using, every I2C/SPI read/write will be done through regmap. If you put your device on I2C bus in dts file, regmap will call I2C operate functions when you use **regmap_write**, if it's on SPI bus, regmap will call SPI operate functions instead.

Tos use regmap API, a **regmap_config** should be defined. **reg_bits** and **val_bits** defined the register address length and data length inside this device. write_flag_mask and read_flag_mask will do OR operation with the data you trying to send/read(they are optional):
```c
// linux-4.9/drivers/base/regmap/regmap.c, Line 2002
	u8 = buf;
	*u8 |= map->write_flag_mask;
```
Then use **devm_regmap_init_i2c** or **devm_regmap_init_spi** to initialize your regmap. It will help you to allocate memory for your regmap and release it when module remove.

### How to use regmap to control device
Let's take a look at **st_uvis25.h** and **st_uvis25_core.c**:
```c
// st_uvis25.h, Line 26
struct st_uvis25_hw {
	struct regmap *regmap;

	struct iio_trigger *trig;
	bool enabled;
	int irq;
};
```
```c
// st_uvis25_core.c Line 55
static int st_uvis25_check_whoami(struct st_uvis25_hw *hw)
{
	int err, data;

	err = regmap_read(hw->regmap, ST_UVIS25_REG_WHOAMI_ADDR, &data);
	if (err < 0) {
		dev_err(regmap_get_device(hw->regmap),
			"failed to read whoami register\n");
		return err;
	}

	if (data != ST_UVIS25_REG_WHOAMI_VAL) {
		dev_err(regmap_get_device(hw->regmap),
			"wrong whoami {%02x vs %02x}\n",
			data, ST_UVIS25_REG_WHOAMI_VAL);
		return -ENODEV;
	}

	return 0;
}
```
This **st_uvis25_check_whoami** uses regmap_read to read value from register **ST_UVIS25_REG_WHOAMI_ADDR** and compares it to **ST_UVIS25_REG_WHOAMI_VAL**.

### i2c_probe and probe

In last post we already know that **module_i2c_driver** actually are encapsulations of module_init/exit, so it's easy to understand that st_uvis25_i2c_probe will be called when install mod. But how about **st_uvis25_probe**, where does it come from?

### EXPORT_SYMBOL
As I mentioned in last section, there are two more files, this **st_uvis25_probe** is export from one of them(st_uvis25_core.c):
```c
int st_uvis25_probe(struct device *dev, int irq, struct regmap *regmap)
{
  /* code */
}
EXPORT_SYMBOL(st_uvis25_probe);
```
**EXPORT_SYMBOL** is a marco defined in linux-4.9/include/linux/export.h
```c
// linux-4.9/include/linux/export.h, Line 56
/* For every exported symbol, place a struct in the __ksymtab section */
#define ___EXPORT_SYMBOL(sym, sec)					\
	extern typeof(sym) sym;						\
	__CRC_SYMBOL(sym, sec)						\
	static const char __kstrtab_##sym[]				\
	__attribute__((section("__ksymtab_strings"), aligned(1)))	\
	= VMLINUX_SYMBOL_STR(sym);					\
	static const struct kernel_symbol __ksymtab_##sym		\
	__used								\
	__attribute__((section("___ksymtab" sec "+" #sym), used))	\
	= { (unsigned long)&sym, __kstrtab_##sym }
```

In newer kernel 4.19.9, this marco has been simplified to:
```c
/* For every exported symbol, place a struct in the __ksymtab section */
#define ___EXPORT_SYMBOL(sym, sec)					\
	extern typeof(sym) sym;						\
	__CRC_SYMBOL(sym, sec)						\
	static const char __kstrtab_##sym[]				\
	__attribute__((section("__ksymtab_strings"), used, aligned(1)))	\
	= #sym;								\
	__KSYMTAB_ENTRY(sym, sec)
```

When you use it as **EXPORT_SYMBOL(my_export, GPL)**,it will be expanded like this:
```c
	extern typeof(my_export) my_export;						\
	__CRC_SYMBOL(my_export, GPL)						\
	static const char __kstrtab_my_export[]				\
	__attribute__((section("__ksymtab_strings"), aligned(1)))	\
	= VMLINUX_SYMBOL_STR(my_export);					\
	static const struct kernel_symbol __ksymtab_my_export		\
	__used								\
	__attribute__((section("___ksymtab" GPL "+" my_export), used))	\
	= { (unsigned long)&my_export, __kstrtab_my_export }
```
It will be simpler if ignore __attribute__ and __used(there are gcc attributes) and expand again:
```c
static const char __kstrtab_my_export[] =” my_export”;

static const struct kernel_symbol__ksymtab_my_export={(unsigned long)&my_export,_kstrab_my_export}
```
This part of code declared a static const char array to store symbol name and a static const struct to store address and name of this symbol.

If we add __attribute__ back again, this char array will be put into section **__ksymtab_strings** and struct will be put into section **__ksymatab_gpl**.

How to call drivers in user space will be discussed in Part III.
To be continued...