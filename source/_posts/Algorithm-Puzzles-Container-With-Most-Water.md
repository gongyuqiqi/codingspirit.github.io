---
title: 'Algorithm Puzzles: Container With Most Water'
top: false
tags:
  - Algorithm
  - C++
date: 2020-01-26 13:53:52
categories: 算法题解
---

Algorithm Puzzles ~~everyday~~ ~~every week~~ sometimes: Container With Most Water

<!--more-->

## Puzzle

Puzzle from [leetcode](https://leetcode.com):

Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with x-axis forms a container, such that the container contains the most water.

Note: You may not slant the container and n is at least 2.

## Solving

This puzzle can be easily solved by exhaustion method but time complexity is **O(N^2)**. A better approach will be using "compress window“：
```cpp
class Solution {
  public:
    int maxArea(const vector<int>& height) {
        size_t length = height.size();
        int currentMax = 0, windowLeft = 0, windowRight = length - 1;

        while (windowLeft < windowRight) {
            currentMax = std::max(
                currentMax, std::min(height[windowLeft], height[windowRight]) *
                                (windowRight - windowLeft));
            if (height[windowLeft] < height[windowRight]) {
                ++windowLeft;
            } else {
                --windowRight;
            }
        }
        return currentMax;
    }
};
```
Here time complexity is **O(N)**
![](Algorithm-Puzzles-Container-With-Most-Water/s1.png)

Try to use iterator:

```cpp
class Solution {
  public:
    int maxArea(const vector<int>& height) {
        int currentMax = 0;
        auto iterL = height.cbegin();
        auto iterR = height.cend() - 1;

        while (iterL < iterR) {
            currentMax =
                std::max(currentMax, std::min(*iterL, *iterR) *
                                         (int)std::distance(iterL, iterR));
            if (*iterL < *iterR) {
                ++iterL;
            } else {
                --iterR;
            }
        }
        return currentMax;
    }
};
```

![](Algorithm-Puzzles-Container-With-Most-Water/s2.png)

Bravo!
