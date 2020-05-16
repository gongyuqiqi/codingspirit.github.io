---
title: 'Android: Swipe Views With Tabs(TabLayout + ViewPager)'
top: false
tags:
  - Android
  - Java
date: 2020-05-16 15:16:44
categories: App Development
---

In AndroidX, TabLayout has been extended and moved to package com.google.android.material.tabs.TabLayout. This post will describe how to use **TabLayout + ViewPager** to create swipe views with tabs in AndroidX.

<!--more-->

## Demo

<img src="https://blog-image-host.oss-cn-shanghai.aliyuncs.com/lzqblog/Android-Swipe-Views-With-Tabs-TabLayout-ViewPager/swipe.gif" width = "50%" height = "50%" />

## Dependencies

Before AndroidX, **TabLayout** is part of <span style="color:red">support</span> package:

```gradle
implementation 'com.android.support:design:28.0.0'
```

But now we need to use <span style="color:red">material</span> package:

```gradle
implementation 'com.google.android.material:material:1.0.0'
```

## Layout

In my scenario I added TabLayout and ViewPager in a fragment(main_fragment.xml):

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ui.main.MainFragment">

    <com.google.android.material.tabs.TabLayout
        android:id="@+id/tab_layout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:layout_constraintTop_toTopOf="parent" />


    <androidx.viewpager.widget.ViewPager
        android:id="@+id/viewPager"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />


</androidx.constraintlayout.widget.ConstraintLayout>

```

Here we added one TabLayout and one ViewPager inside. We will add tab items dynamically, but it's also doable to add tab items inside layout file by adding <span style="color:red">*com.google.android.material.tabs.TabItem*</span>.

Then we need another fragment(publish_fragment.xml) to display the view in each tab.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/publish"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".ui.main.PublishFragment">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"

        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        android:text="Hello" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

Here we added a TextView shows "Hello".

## Java

Back to Java code, in *MainFragment.java* we need to implement **FragmentPagerAdapter**, and `setupWithViewPager` to **TabLayout** :

```java
public class MainFragment extends Fragment {

    public static MainFragment newInstance() {
        return new MainFragment();
    }

    private ArrayList<Fragment> fragmentList = new ArrayList<Fragment>();
    private String[] tabString = {"TAB1", "TAB2", "TAB3"};

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.main_fragment, container, false);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        TabLayout tabLayout = (TabLayout) getView().findViewById(R.id.tab_layout);
        ViewPager viewPager = (ViewPager) getView().findViewById(R.id.viewPager);
        MyAdapter fragmentAdapter = new  MyAdapter(getChildFragmentManager());

        for(String string:tabString){
            tabLayout.addTab(tabLayout.newTab().setText(string));
            fragmentList.add(PublishFragment.newInstance());
        }

        viewPager.setAdapter(fragmentAdapter);
        tabLayout.setupWithViewPager(viewPager);
    }

    public class MyAdapter extends FragmentPagerAdapter {
        public MyAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public int getCount() {
            return fragmentList.size();
        }

        @Override
        public Fragment getItem(int position) {
            return fragmentList.get(position);
        }

        @Nullable
        @Override
        public CharSequence getPageTitle(int position) {
            return tabString[position];
        }
    }

}
```
