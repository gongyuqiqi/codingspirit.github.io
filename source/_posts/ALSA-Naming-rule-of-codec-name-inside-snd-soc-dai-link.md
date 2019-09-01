---
title: 'ALSA: Naming rule of codec_name inside snd_soc_dai_link'
top: false
tags:
  - Linux
date: 2019-09-01 09:50:26
categories: 随便写写
---
...
<!--more-->

When we define a dai link in machine driver, a structure names "snd_soc_dai_link" will be created. There are two members inside this structure to find the adaptive codec drivers: **codec_name** and **codec_dai_name**. 

Normally codec driver will define **codec_dai_name**. You can find it easily inside codec driver source code. To make sure the dai link created properly, the **codec_dai_name** in machine driver and codec driver should be exactly same. As for **codec_name**, the naming rule should be like this:

```
codec_name.bus_number-codec_address
```

Taking pcm512x as an example, if we connect it to **i2c bus 4** and the i2c address of pcm512x we are using is **0x4e** in device tree, we should define snd_soc_dai_link like this:

```
  .codec_name     = "pcm512x.4-004e",
  .codec_dai_name = "pcm512x-hifi",
```



