---
title: 'Kibana: Read only dashboard'
top: false
tags:
  - 日志
date: 2020-08-15 14:05:41
categories: 随便写写
---

...

<!--more-->

## X-Pack security enabled

With X-Pack security enabled, give specific user with `kibana_dashboard_only_user` role in **Management > Security > Users**. In this case user can access dashboard but there is no edit button in dashboard.

## X-Pack security is not enabled

If X-Pack security is not enabled, there is another way to make dashboard "read only" :

```sql
PUT .kibana/_settings
{
  "index": {
    "blocks.read_only": true
  }
}
```

If applied code in **Dev tool**, Edit button still can be seen in dashboard but user can't save modified dashboard.
