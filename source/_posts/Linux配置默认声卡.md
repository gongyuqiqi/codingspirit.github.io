---
title: Linux配置默认声卡
tags:
  - Linux
  - Raspberry Pi
date: 2018-05-02 14:08:54
categories: 随便写写
---
树莓派多声卡，尝试配置声卡0为默认输出设备，声卡1为默认输入设备。
<!--more-->

## List all play/record device

```sh
pi@raspberrypi:~ $ aplay -l
**** List of PLAYBACK Hardware Devices ****
card 0: ALSA [bcm2835 ALSA], device 0: bcm2835 ALSA [bcm2835 ALSA]
  Subdevices: 7/7
  Subdevice #0: subdevice #0
  Subdevice #1: subdevice #1
  Subdevice #2: subdevice #2
  Subdevice #3: subdevice #3
  Subdevice #4: subdevice #4
  Subdevice #5: subdevice #5
  Subdevice #6: subdevice #6
card 0: ALSA [bcm2835 ALSA], device 1: bcm2835 ALSA [bcm2835 IEC958/HDMI]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```

```sh
pi@raspberrypi:~ $ arecord -l
**** List of CAPTURE Hardware Devices ****
card 1: Device [USB PnP Sound Device], device 0: USB Audio [USB Audio]
  Subdevices: 1/1
  Subdevice #0: subdevice #0
```
## Set card 0 as playback, card 1 as capture
Open **.asoundrc** file under **$HOME**
```sh
cd $HOME
vim .asoundrc
```
Modify **.asoundrc**:
```
pcm.!default {
    type asym
    playback.pcm "plughw:0,0"
    capture.pcm  "plughw:1,0"
}
ctl.!default {
        type hw
        card 0
}
```
*"plughw:1,0"* means card 1, device 0

Then **save file** and **reboot**
