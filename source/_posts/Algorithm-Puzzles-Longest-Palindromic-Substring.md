---
title: 'Algorithm Puzzles: Longest Palindromic Substring'
top: false
tags:
  - Algorithm
  - C++
date: 2019-08-04 15:50:03
categories: 算法题解
---

Algorithm Puzzles ~~everyday~~ ~~every week~~ sometimes: Longest Palindromic Substring

<!--more-->

## Puzzle

Puzzle from [leetcode](https://leetcode.com):

Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example 1:

Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.
Example 2:

Input: "cbbd"
Output: "bb"

## Solving

### First Came out solution:

```cpp
class Solution {
public:
    string longestPalindrome(const string& s) {
        int head = 0,tail = 0;
        int length = s.length();
        int longestH = 0, longestT = 0;
        while(head != length){
            if(s[head] == s[tail]){
                if(isPalindromic(s.substr(head, tail - head + 1))){
                    longestH = head;
                    longestT = tail;
                }
            }
            ++tail;
            if(tail >= length){
                ++head;
                tail = head + longestT - longestH + 1;
                if(tail >= length){
                    break;
                }
            }
        }
        return s.substr(longestH, longestT - longestH + 1);
    }
private:
    bool isPalindromic(const string& s){
        double dMid = s.length()/2.0;
        int mid = s.length()/2;
        string sub = s.substr((dMid - mid) > 0 ? mid + 1 : mid);
        std::reverse(sub.begin(), sub.end());
        if(sub == s.substr(0, mid)){
            return true;
        }
        return false;
    }
};
```

Result:

![](Algorithm-Puzzles-Longest-Palindromic-Substring/s1.png)

<div  align="center"> 
![](Algorithm-Puzzles-Longest-Palindromic-Substring/f1.jpeg)
</div>

Well, that's the worst result I have ever seen.

## Extend from the center

Checked the solution provided by leetcode, there is one way only have time complexity O(n²), I implemented in it C++ with a little optimization:

```cpp
class Solution {
public:
    const string longestPalindrome(const string& s) {
        int start = 0, maxLength = 0, halfLength = 0;
        for(int i = 0; i < s.length(); i++){
            if(s.length() - i + 1 < halfLength || i + 1 < halfLength){
                continue;
            }
            int len1 = extendFromCenter(s, i, i);
            int len2 = extendFromCenter(s, i, i+1);
            int len = len1 > len2 ? len1 : len2;
            if(len > maxLength){
                start = i - (len - 1) / 2;
                maxLength = len;
                halfLength = maxLength / 2; 
            }
        }
        return s.substr(start, maxLength);
    }
private:
    int extendFromCenter(const string& s, int left, int right){
        while(left >= 0 && right < s.length() && s[left] == s[right]){
            --left;
            ++right;
        }
        return right - left - 1;
    }
};
```

Result with this:

![](Algorithm-Puzzles-Longest-Palindromic-Substring/s2.png)

