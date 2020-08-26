---
title: 'SSL certificate problem: unable to get local issuer certificate'
top: false
tags:
  - Linux
date: 2020-08-26 19:25:34
categories: 问题记录
---

Yesterday successfully cross compiled curl with mbedTLS, but there was an error when trying to access a https link:


```
SSL certificate problem: unable to get local issuer certificate
```

To fix it, download CA certificate to local machine and export environment variable `CURL_CA_BUNDLE`:

```bash
wget https://curl.haxx.se/ca/cacert.pem
export CURL_CA_BUNDLE=<path of cacert.pem>
```
