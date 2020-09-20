---
title: 'Jenkins (II): Configure Jenkins To Run On Port 80'
top: false
tags:
  - Jenkins
  - Continuous Integration
date: 2020-09-15 20:40:21
categories: CI
---

Jenkins is running on port 8080 by default, thus user need to manually add **:8080** when access Jenkins. If we make it running on port 80(default http port), user will no longer need to type port number manually.

<!--more-->

## Open ports and forwarding

First of all we need to make sure that ports 8080/80 and 8443/433 have been opened. To check, use `sudo iptalbes -L -n`. If those ports are not opened to tcp, use following commands to add rules:

```bash
sudo iptables -I INPUT 1 -p tcp --dport 8443 -j ACCEPT
sudo iptables -I INPUT 1 -p tcp --dport 8080 -j ACCEPT
sudo iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT
```

Then forward 8080 to 80 and 8443 to 443:

```bash
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8443
```

You need to save the configuration:

```bash
sudo sh -c "iptables-save > /etc/iptables.rules"
```

## Use `iptables-persistent` to config rules on boot

Rules we configured in `iptables` will not automatically applied again when reboot. To configure to automatically run it on boot, install `iptables-persistent`:

```bash
sudo apt-get install iptables-persistent
```
