---
title: nfsroot boot crash after systemd-networkd starts
top: false
tags:
  - Linux
date: 2020-03-08 10:02:36
categories: 问题记录
---
Yesterday we found that nfsroot will get crash after systemd-networkd starts:

```
nfs: server 192.168.0.101 not responding, still trying
```

<!--more-->

## Root cause

Crash was happened after we importing *eth.network* for systemd-networkd, which will set ethernet as DHCP mode after system booting. We doubting that this setting will release the IP we set when boards was mounting nfsroot.

## Solutions

As far as I know there are two solutions to avoid systemd-networkd breaking nfs connection:

- **KernelCommandLine=!nfsroot**

```
[Match]
Name=eth0
KernelCommandLine=!nfsroot

[Network]
DHCP=ipv4

```

According to Linux manual page:

>       KernelCommandLine=
>           Checks whether a specific kernel command line option is set (or
>           if prefixed with the exclamation mark unset). See
>           "ConditionKernelCommandLine=" in systemd.unit(5) for details.

So **KernelCommandLine=!nfsroot** will prevent this config to be applied if we have set nfsroot in kernel command line.

- **CriticalConnection=true**

```
[Match]
Name=eth0

[Network]
DHCP=ipv4

[DHCP]
CriticalConnection=true

```

According to Linux manual page:

>        CriticalConnection=
>           When true, the connection will never be torn down even if the
>           DHCP lease expires. This is contrary to the DHCP specification,
>           but may be the best choice if, say, the root filesystem relies on
>           this connection. Defaults to false.

So with **CriticalConnection=true** the connection will not be dropped, which prevent nfs from disconnecting as well.
