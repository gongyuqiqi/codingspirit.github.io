---
title: 'Android: Swipe Down To Refresh'
top: false
tags:
  - Android
date: 2020-06-27 14:15:56
categories: App Development
---

"Swipe down/Pull down to refresh" is a widely used feature in various kinds of apps. Let's see how can we do that via SwipeRefreshLayout in AndroidX.

<!--more-->

## Dependencies

```gradle
implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.0.0'
```

## Layout

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.swiperefreshlayout.widget.SwipeRefreshLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/mySwipeRefreshLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ui.main.DevicesFragment">


    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/myRecyclerView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"

        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.swiperefreshlayout.widget.SwipeRefreshLayout>
```

Here we have a `RecyclerView` inside `SwipeRefreshLayout`. We plan to update dataset in `RecyclerView` when user swipe down.

## Java

To implement the logic of refreshing, we need to set refresh listener and override method `onRefresh`:

```java
mSwipeRefreshLayout = getView().findViewById(R.id.mySwipeRefreshLayout);
mSwipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
    @Override
    public void onRefresh() {
      // logic implementation start
      // dataSet.add(fetchFromServer());
      // logic implementation end
      mSwipeRefreshLayout.setRefreshing(false);
    }
});
```

When refreshing is done, call `setRefreshing(false)` to stop refreshing animation.
