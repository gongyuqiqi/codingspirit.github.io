---
title: Linux kernel module(3)
tags:
  - Linux
date: 2018-12-23 09:46:15
categories: 编程相关
---
This post will give a simple introduction to Linux kernel module(Part III.).

Linux kernel module简介(三)
<!--more-->
In this post we will discuss how to call kernel driver in user space.
## Access IIO devices from user space
In last two posts we use a IIO(Linux Industrial I/O Subsystem) device st_uvis25 as a example to show how to write a kernel module. There are a lot of devices fall into this subsystem:
- ADCs
- Accelerometers
- Gyros
- IMUs
- Capacitance to Digital Converters (CDCs)
- Pressure Sensors
- Color, Light and Proximity Sensors
- Temperature Sensors
- Magnetometers
- DACs
- DDS (Direct Digital Synthesis)
- PLLs (Phase Locked Loops)
- Variable/Programmable Gain Amplifiers (VGA, PGA)

In st_uvis25_core.c, a **iio_info** has been defined and assigned to a **iio_dev** in probe function:
```c
// st_uvis25_core.c, Line 267
static const struct iio_info st_uvis25_info = {
	.read_raw = st_uvis25_read_raw,
};
/* code */
int st_uvis25_probe(struct device *dev, int irq, struct regmap *regmap)
{

	struct st_uvis25_hw *hw;
	struct iio_dev *iio_dev;
	int err;

	iio_dev = devm_iio_device_alloc(dev, sizeof(*hw));
	if (!iio_dev)
		return -ENOMEM;

	dev_set_drvdata(dev, (void *)iio_dev);

	hw = iio_priv(iio_dev);
	hw->irq = irq;
	hw->regmap = regmap;

	err = st_uvis25_check_whoami(hw);
	if (err < 0)
		return err;

	iio_dev->modes = INDIO_DIRECT_MODE;
	iio_dev->dev.parent = dev;
	iio_dev->channels = st_uvis25_channels;
	iio_dev->num_channels = ARRAY_SIZE(st_uvis25_channels);
	iio_dev->name = ST_UVIS25_DEV_NAME;
	iio_dev->info = &st_uvis25_info;

	err = st_uvis25_init_sensor(hw);
	if (err < 0)
		return err;

	if (hw->irq > 0) {
		err = st_uvis25_allocate_buffer(iio_dev);
		if (err < 0)
			return err;

		err = st_uvis25_allocate_trigger(iio_dev);
		if (err)
			return err;
	}

	return devm_iio_device_register(dev, iio_dev);
}
```
If **devm_iio_device_register** success and iio_info.read_raw has been registered, a file will be created at :
/sys/bus/iio/devices/iio:device0/xxx_raw
In terminal, you can read it by **cat**
```bash
cat /sys/bus/iio/devices/iio:device0/xxx_raw
```
In C/C++ applications, you can use **fopen** because it's a file.
