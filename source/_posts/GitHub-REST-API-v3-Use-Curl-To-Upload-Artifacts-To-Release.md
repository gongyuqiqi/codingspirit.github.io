---
title: 'GitHub REST API v3: Use Curl To Upload Artifact To Release'
top: false
tags:
  - 日志
date: 2020-08-30 09:01:17
categories: 随便写写
---

<!--more-->

## With OAuth2 Token Authentication

```sh
curl -H "Authorization: token <OAUTH-TOKEN>" https://api.github.com
```

## Create A Release And Add An Artifact

```sh
# Create a new release and get upload url
upload_url=$(curl -s -H "Authorization: token $TOKEN"  \
     -d '{"tag_name":"'"$ARTIFACTS_BASE_NAME"'", "name":"'"$ARTIFACTS_BASE_NAME"'", "body":"'"$ARTIFACTS_BASE_NAME"'", "target_commitish":"'"$TARGET_BRANCH"'"}'  \
     "https://api.github.com/repos/$REPO/$TARGET_BRANCH" | jq -r '.upload_url')

upload_url="${upload_url%\{*}"

# Upload a tarball
curl -s -H "Authorization: token $TOKEN"  \
            -H "Content-Type: application/x-gzip" \
            --data-binary @$ARTIFACTS_BASE_NAME.tar.gz  \
            "$upload_url?name=$ARTIFACTS_BASE_NAME.tar.gz&label=$ARTIFACTS_BASE_NAME.tar.gz"
```
