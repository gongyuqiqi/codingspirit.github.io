---
title: 'Algorithm Puzzles: Number of Islands'
top: false
tags:
  - Algorithm
  - C++
date: 2020-10-18 13:47:51
categories: 算法题解
---
Algorithm Puzzles ~~everyday~~ ~~every week~~ sometimes: Number of Islands

<!--more-->

## Puzzle
Puzzle from [leetcode](https://leetcode.com):

Given an m x n 2d grid map of '1's (land) and '0's (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

```
Example 1:

Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1
Example 2:

Input: grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
Output: 3
```

## Solving
It looks like a typical depth-first search puzzle:

```cpp
class Solution {
  public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.size() == 0) return 0;

        mSize = grid.size();
        nSize = grid[0].size();

        int island = 0;

        for (int m = 0; m < mSize; ++m) {
            for (int n = 0; n < nSize; ++n) {
                if (grid[m][n] == '0') {
                    continue;
                } else {
                    bfs(grid, m, n);
                    ++island;
                }
            }
        }

        return island;
    }

  private:
    int mSize;
    int nSize;
    void bfs(vector<vector<char>>& grid, int m, int n) {
        if (m < 0 || n < 0 || m >= mSize || n >= nSize || grid[m][n] != '1')
            return;

        grid[m][n] = '0';
        bfs(grid, m + 1, n);
        bfs(grid, m - 1, n);
        bfs(grid, m, n + 1);
        bfs(grid, m, n - 1);
    }
};
```

![](Algorithm-Puzzles-Number-of-Islands/res.png)
