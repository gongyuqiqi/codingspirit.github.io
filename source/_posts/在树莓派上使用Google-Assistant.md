---
title: 在树莓派上使用Google Assistant
tags:
  - null
  - null
date: 2017-12-28 16:21:13
categories:
---
前段时间尝试在树莓派上使用Google Assistant, 系统能够捕捉音频并识别，使用USB声卡也能正常工作，但使用3.5mm jack时没有音频输出。经过摸索终于有输出了！写篇post记录一下关键步骤吧！
<!--more-->
  首先配置输入输出设备：
```java
    audioInputDevice = findAudioDevice(AudioManager.GET_DEVICES_INPUTS, AudioDeviceInfo.TYPE_USB_DEVICE);
    audioOutputDevice = findAudioDevice(AudioManager.GET_DEVICES_OUTPUTS, AudioDeviceInfo.TYPE_BUILTIN_SPEAKER);
```
此处TYPE_BUILTIN_SPEAKER即为3.5mm输出口。之前尝试TYPE_AUX_LINE、TYPE_LINE_ANALOG、TYPE_WIRED_HEADPHONES等全都不能发现设备返回null;
  然后生成凭据：
```java
        try {
            userCredentials =
                    EmbeddedAssistant.generateCredentials(this, R.raw.credentials);
        } catch (IOException | JSONException e) {
            Log.e(TAG, "error getting user credentials", e);
        }
```
  最后使用mEmbeddedAssistant = new EmbeddedAssistant.Builder(), 绑定完RequestCallback、ConversationCallback、凭据、初始音量、采样率、输入输出设备就可以啦！
  现在的sample还有点蠢，不能使用HotWord唤醒。而且在没有前置语言处理模块的情况下，识别稍微有点慢。