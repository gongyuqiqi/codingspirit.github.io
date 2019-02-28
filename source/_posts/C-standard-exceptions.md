---
title: C++ standard exceptions
tags:
  - C++
date: 2019-02-28 03:01:07
categories: 编程相关
---
...
<!--more-->

- logic_error(It reports errors that are a consequence of faulty logic within the program such as violating logical preconditions or class invariants and may be preventable.)
  - invalid_argument
  - domain_error
  - length_error
  - out_of_range
  - future_error(C++11)
- bad_optional_access(C++17)
- runtime_error(It reports errors that are due to events beyond the scope of the program and can not be easily predicted.)
  - range_error
  - overflow_error
  - underflow_error
  - regex_error(C++11)
  - nonexistent_local_time(C++20)
  - ambiguous_local_time(C++20)
  - tx_exception(TM TS)
  - system_error(C++11)
  - ios_base::failure(C++11)
  - filesystem::filesystem_error(C++17)
- bad_typeid
- bad_cast
  - bad_any_cast(C++17)
- bad_weak_ptr(C++11)
- bad_function_call(C++11)
- bad_alloc(report failure to allocate storage)
  - bad_array_new_length(C++11)
- bad_exception
- ios_base::failure(until C++11)
- bad_variant_access(C++17)

For more details, refer to [cppreference](https://en.cppreference.com/w/cpp/error/exception)
