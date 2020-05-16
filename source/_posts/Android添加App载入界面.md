---
title: Android添加App载入界面
tags:
  - Android
  - Java
date: 2017-11-09 14:16:42
categories: App Development
---
当App启动载入时间较长时，我们希望有一个载入界面过渡，当载入完成后再切换到MainActivity。这个载入界面我们称之为SplashActivity。
<!--more-->
首先写一个继承AppCompatActivity的SplashActivity：
```java
public class SplashActivity extends AppCompatActivity{
		final int SplashTime = 3200;// 期望的Splash时间
		WebView wbGif;// 在这里我使用Webview来加载一个GIF动画
}
```
然后Override onCreate方法：
```java
protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        wbGif = (WebView) findViewById(R.id.webViewGif);// 在这里我使用Webview来加载一个GIF动画
        wbGif.setBackgroundColor(Color.parseColor("#6a0606"));
        wbGif.loadUrl("file:///android_res/drawable/loading.gif");
        }
```
在该onCreate方法中创建一个新的Handler对象，它将在SplashTime结束后切换到MainActivity：
```java
        new android.os.Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent main = new Intent(SplashActivity.this, MainActivity.class);
                SplashActivity.this.startActivity(main);
                SplashActivity.this.finish();
            }
        }, SplashTime);
```
最后别忘了在AndroidManifest.xml中将入口Activity设置为SplashActivity：
```xml
        <activity
            android:name=".SplashActivity"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
```
