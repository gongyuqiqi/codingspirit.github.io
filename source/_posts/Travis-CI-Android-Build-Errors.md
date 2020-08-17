---
title: 'Travis CI: Android Build Errors'
top: false
tags:
  - Android
  - Continuous Integration
date: 2020-08-17 19:09:57
categories: 问题记录
---

This post records some errors I have met during set up an Android build pipeline with Travis CI.

<!--more-->

## Failed to install the following Android SDK packages as some licences have not been accepted.

Error message:

Failed to install the following Android SDK packages as some licences have not been accepted.
     platforms;android-29 Android SDK Platform 29
  To build this project, accept the SDK license agreements and install the missing components using the Android Studio SDK Manager.

Fix:
```yml
before_install:
  - yes | sdkmanager "platforms;android-29"
```

## Lint found errors in the project; aborting build.

Error message:

Execution failed for task ':app:lint'.<br>
\> Lint found errors in the project; aborting build.

Quick Fix:

Add following code into *app/build.gradle* to disable abort when lint error:

```
lintOptions {
    abortOnError false
}
```

Suggested Fix:

Run `./gradlew lint` to generate lint report and fix those errors. You can find it under */app/build/outputs/lint-results-debug.html*. You also can run `./gradlew lintDebug` or `./gradlew lintRelease` to run lint for debug or release version specifically.
