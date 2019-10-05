---
title: 'Algorithm Puzzles: Reverse Integer'
top: false
tags:
  - Algorithm
  - C++
date: 2019-10-05 11:10:16
categories: 算法题解
---
Algorithm Puzzles ~~everyday~~ ~~every week~~ sometimes: Reverse Integer

<!--more-->

## Puzzle

Puzzle from [leetcode](https://leetcode.com):

Given a 32-bit signed integer, reverse digits of an integer.

Example 1:

Input: 123
Output: 321
Example 2:

Input: -123
Output: -321
Example 3:

Input: 120
Output: 21

Note:
Assume we are dealing with an environment which could only store integers within the 32-bit signed integer range: [−231,  231 − 1]. For the purpose of this problem, assume that your function returns 0 when the reversed integer overflows.

## Solving

This puzzle is ez to solve if you considered possible overflow at the very beginning. I'd like to using string to do reverse process, which should be no overflow during reverse, after reversing then do overflow check. Considering that the range of int32_t is *[-2147483648, 2147483647]*, we need to check the value after reversing is in this range or not.

```cpp
class Solution
{
public:
    int32_t reverse(int32_t x)
    {
        string ori = std::to_string(x);
        if (ori[0] == '-')
        {
            std::reverse(++std::begin(ori), std::end(ori));
        }
        else
        {
            std::reverse(std::begin(ori), std::end(ori));
        }

        if (ori.length() == 10)
        {
            if (ori[0] > '2')
            {
                return 0;
            }
            else if (ori[0] == '2')
            {
                if (atoi(ori.substr(1, 9).c_str()) > 147483647)
                {
                    return 0;
                }
            }
        }

        if (ori.length() == 11)
        {
            if (ori[1] > '2')
            {
                return 0;
            }
            else if (ori[1] == '2')
            {
                if (atoi(ori.substr(2, 9).c_str()) > 147483648)
                {
                    return 0;
                }
            }
        }
        return atoi(ori.c_str());
    }
};
```

Result I got:

![](Algorithm-Puzzles-Reverse-Integer/s1.png)

One shot pass~~
