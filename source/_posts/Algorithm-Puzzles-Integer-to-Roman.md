---
title: 'Algorithm Puzzles: Integer to Roman'
top: false
tags:
  - Algorithm
  - C++
date: 2020-01-27 13:35:01
categories: 算法题解
---

Algorithm Puzzles ~~everyday~~ ~~every week~~ sometimes: Integer to Roman

<!--more-->

## Puzzle
Puzzle from [leetcode](https://leetcode.com):

Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
```
Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```
For example, two is written as II in Roman numeral, just two one's added together. Twelve is written as, XII, which is simply X + II. The number twenty seven is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

I can be placed before V (5) and X (10) to make 4 and 9.<br>
X can be placed before L (50) and C (100) to make 40 and 90.<br>
C can be placed before D (500) and M (1000) to make 400 and 900.<br>
Given an integer, convert it to a roman numeral. Input is guaranteed to be within the range from 1 to 3999.<br>

## Solving
## Solution 1
```cpp
class Solution {
  public:
    string intToRoman(int num) {
        string ret = "";
        int bitRet = 0;

        if (num >= 1000) {
            bitRet = num / 1000;
            for (int i = 0; i < bitRet; ++i) {
                ret += "M";
            }
            num %= 1000;
        }

        if (num >= 100) {
            bitRet = num / 100;
            if (bitRet == 9) {
                ret += "CM";
            } else if (bitRet == 4) {
                ret += "CD";
            } else {
                if (bitRet >= 5) {
                    ret += "D";
                    bitRet -= 5;
                }
                for (int i = 0; i < bitRet; ++i) {
                    ret += "C";
                }
            }
            num %= 100;
        }

        if (num >= 10) {
            bitRet = num / 10;
            if (bitRet == 9) {
                ret += "XC";
            } else if (bitRet == 4) {
                ret += "XL";
            } else {
                if (bitRet >= 5) {
                    ret += "L";
                    bitRet -= 5;
                }
                for (int i = 0; i < bitRet; ++i) {
                    ret += "X";
                }
            }
            num %= 10;
        }

        if (num > 0) {
            bitRet = num;
            if (bitRet == 9) {
                ret += "IX";
            } else if (bitRet == 4) {
                ret += "IV";
            } else {
                if (bitRet >= 5) {
                    ret += "V";
                    bitRet -= 5;
                }
                for (int i = 0; i < bitRet; ++i) {
                    ret += "I";
                }
            }
        }

        return ret;
    }
};
```
![](Algorithm-Puzzles-Integer-to-Roman/s1.png)

## Solution 2
```cpp
class Solution {
  public:
    string intToRoman(int num) {
        const string M[] = {"", "M", "MM", "MMM"};
        const string C[] = {"",  "C",  "CC",  "CCC",  "CD",
                            "D", "DC", "DCC", "DCCC", "CM"};
        const string X[] = {"",  "X",  "XX",  "XXX",  "XL",
                            "L", "LX", "LXX", "LXXX", "XC"};
        const string I[] = {"",  "I",  "II",  "III",  "IV",
                            "V", "VI", "VII", "VIII", "IX"};
        return M[num / 1000] + C[(num % 1000) / 100] + X[(num % 100) / 10] +
               I[num % 10];
    }
};
```
![](Algorithm-Puzzles-Integer-to-Roman/s2.png)
