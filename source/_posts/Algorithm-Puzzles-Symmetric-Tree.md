---
title: 'Algorithm Puzzles: Symmetric Tree'
top: false
tags:
  - Algorithm
  - C++
date: 2020-10-25 13:02:59
categories: 算法题解
---
Algorithm Puzzles ~~everyday~~ ~~every week~~ sometimes: Symmetric Tree

<!--more-->

## Puzzle

Puzzle from [leetcode](https://leetcode.com):

Given a binary tree, check whether it is a mirror of itself (ie, symmetric around its center).

For example, this binary tree [1,2,2,3,4,4,3] is symmetric:

```
    1
   / \
  2   2
 / \ / \
3  4 4  3
```

But the following [1,2,2,null,3,null,3] is not:
```
    1
   / \
  2   2
   \   \
   3    3
```

## Solving

```cpp
class Solution {
  public:
    bool isSymmetric(const TreeNode* const root) {
        if (root != nullptr) {
            return isSubTreeSymmetric(root->left, root->right);
        }

        return true;
    }

  private:
    bool isSubTreeSymmetric(const TreeNode* const r, const TreeNode* const l) {
        if (r == l) {
            return true;
        }

        if (r == nullptr || l == nullptr) {
            return false;
        }

        return (r->val == l->val) && isSubTreeSymmetric(r->right, l->left) &&
               isSubTreeSymmetric(r->left, l->right);
    }
};
```
