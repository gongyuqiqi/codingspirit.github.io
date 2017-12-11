---
title: 在Android Things上使用TTS及使用Google Assistant遇到的问题
tags:
  - Android Things
  - Java
date: 2017-12-06 16:37:03
categories: 
  - 编程相关
  - 问题记录
---
  智能音响有两个重要功能:“说”和“听”。在Android Things上我们可以通过TextToSpeech和Google Assistant来实现上述功能。TTS的实现比较容易，而Google Assistant就比较麻烦了，目前我遇到的问题是Google Assistant能听懂我说什么，却不能给出答案。。还是写个日志记录一下吧。
<!--more-->
## TTS的实现
  TTS实现起来十分容易，创建TextToSpeech并重写OnInitListener的onInit方法：
```java
ttsEngine = new TextToSpeech(MainActivity.this, new TextToSpeech.OnInitListener() {
    @Override
    public void onInit(int status) {
        if (status==TextToSpeech.SUCCESS){
            ttsEngine.setLanguage(Locale.US);
        }else {
            Log.w(TAG,"Can not init tts engine");
            ttsEngine = null;
        }
    }
});
```
再通过
```java
if (ttsEngine != null) {
    ttsEngine.speak("Hi master. What can I do for you?", TextToSpeech.QUEUE_ADD, null, "UTTERANCE_ID");
}
```
即可实现音频输出。完整的代码已上传到github：[Roach](https://github.com/codingspirit/Android_Things_TTS)
## Google Assistant
  要使用Google Assistant，必须要使用Google Assistant API并创建相应的加密凭据。同时，申请的Google账号还要给予app权限以允许访问一些敏感内容。先贴张测试结果图：
{% asset_img 1.png %}
在测试中，app似乎成功上传了录音并能正确识别，但是却不能根据问题进行正确的解答，初步怀疑可能还有一些权限没有申请。
