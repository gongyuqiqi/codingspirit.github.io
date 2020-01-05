---
title: 'Algorithm Puzzles: Regular Expression Matching'
top: false
tags:
  - Algorithm
  - C++
date: 2020-01-05 11:07:45
categories: 算法题解
---
~~每天~~ ~~每周~~ 偶尔一道算法题： 正则表达式匹配
<!--more-->

## Puzzle
Puzzle from [leetcode](https://leetcode.com):

Given an input string (s) and a pattern (p), implement regular expression matching with support for '.' and '*'.

'.' Matches any single character.<br>
'*' Matches zero or more of the preceding element.<br>
The matching should cover the entire input string (not partial).

Note:

s could be empty and contains only lowercase letters a-z.<br>
p could be empty and contains only lowercase letters a-z, and characters like . or *.

[Super_Link](http://lzqblog.top)

## Solving
其实一开始我是打算用c++自带的正则表达式库的，敲完`#include <regex>`后觉得这样不太好，毕竟是在做算法题

![](Algorithm-Puzzles-Regular-Expression-Matching/Onn.png)

那就暴力流来一波！首先考虑没有通配符的情况下, 比较完一位再比较下一位，很自然地想到递归：
```cpp
class Solution {
  public:
    bool isMatch(const string& s, const string& p) {
        if (p.empty()) {
            return s.empty();
        }
        return (s[0] == p[0]) && isMatch(s.substr(1), p.substr(1));
    }
};
```

加上通配符**"."**的情况也比较容易，只需要检查一下字符串在该位有字符即可：
```cpp
class Solution {
  public:
    bool isMatch(const string& s, const string& p) {
        if (p.empty()) {
            return s.empty();
        }
        bool currentMatch = (s[0] == p[0]) || (p[0] == '.' && !s.empty());
        return currentMatch && isMatch(s.substr(1), p.substr(1));
    }
};
```

然后是通配符**"\*"**,这个有点麻烦需要去搜字符串后面几位，匹配0次的情况即`return isMatch(s, p.substr(2))`，直接跳过当前字符后后面的"*", 匹配1次的情况即`return (currentMatch && isMatch(s.substr(1), p))`, 把待匹配字符串后移一位，然后继续递归：
```cpp
class Solution {
  public:
    bool isMatch(const string& s, const string& p) {
        if (p.empty()) {
            return s.empty();
        }
        bool currentMatch = (s[0] == p[0]) || (p[0] == '.' && !s.empty());
        if (p[1] == '*' && p.length() >= 2) {
            return isMatch(s, p.substr(2)) ||
                   (currentMatch && isMatch(s.substr(1), p));
        }
        return currentMatch && isMatch(s.substr(1), p.substr(1));
    }
};
```
试了几个测试例，感觉还行哈~~

![](Algorithm-Puzzles-Regular-Expression-Matching/baoli.jpg)

然后提交完结果出来了：

![](Algorithm-Puzzles-Regular-Expression-Matching/s1.png)

看来我还是too naive...

![](Algorithm-Puzzles-Regular-Expression-Matching/meijianguo.jpeg)

看了下提示，大意是用动态规划，先写状态转移方程:
定义dp[i][j] 在 s[0,i-1]和p[0,j-1]匹配时为正，反之为假
- 当没有通配符**\***时：dp[i][j] = dp[i-1][j-1] && (s[i-1] == p[j-1])
- 当有通配符**\***时:
  - 重复0次：dp[i][j] = dp[i][j-2]
  - 重复1次：dp[i][j] = dp[i-1][j] && (s[i-1] == p[j-2])

贴一下代码(这里优化了一下，照着上面的写空间复杂度会到O(i*j), 下面的为O(N))

```cpp
class Solution {
  public:
    bool isMatch(const string& s, const string& p) {
        int m = s.length(), n = p.length();
        vector<bool> dp(n + 1, false);
        for (int i = 0; i <= m; i++) {
            bool pre = dp[0];
            dp[0] = !i;
            for (int j = 1; j <= n; j++) {
                bool temp = dp[j];
                if (p[j - 1] == '*') {
                    dp[j] = dp[j - 2] || (i && dp[j] && (s[i - 1] == p[j - 2] || p[j - 2] == '.'));
                } else {
                    dp[j] = i && pre && (s[i - 1] == p[j - 1] || p[j - 1] == '.');
                }
                pre = temp;
            }
        }
        return dp[n];
    }
};
```
![](Algorithm-Puzzles-Palindrome-Number/s2.png)
