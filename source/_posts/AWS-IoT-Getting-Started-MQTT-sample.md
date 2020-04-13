---
title: 'AWS IoT Getting Started: MQTT sample'
top: false
tags:
  - MQTT
  - IoT
date: 2020-04-13 14:40:37
categories: IoT
---
AWS IoT Getting Started: MQTT sample
<!--more-->

## AWS IoT Console

Using [AWS IoT Console](https://console.aws.amazon.com/iot/home) to manage IoT devices. In MQTT sample, we need to create a thing in console and setup policy, certificate, and keys.

## Create a Thing

> Devices connected to AWS IoT are represented by things in the AWS IoT registry. A thing represents a specific device or logical entity. It can be a physical device or sensor (for example, a light bulb or a switch on the wall). It can also be a logical entity, like an instance of an application or physical entity that does not connect to AWS IoT, but is related to other devices that do (for example, a car that has engine sensors or a control panel). (From [Amazon docs](https://docs.aws.amazon.com/iot/latest/developerguide/create-aws-thing.html))

In AWS IoT Console, go to Manage->Things to create a thing. After that, in things details page *Interact* tab we can find the API endpoint for IoT device.

![](https://blog-image-host.oss-cn-shanghai.aliyuncs.com/lzqblog/AWS-IoT-Getting-Started-MQTT-sample/Screenshot%20from%202020-04-13%2016-23-25.png)

## Certificates and keys

In AWS IoT Console, go to Secure->Certificates to create a certificate(One-click certificate creation are recommended):

![](https://blog-image-host.oss-cn-shanghai.aliyuncs.com/lzqblog/AWS-IoT-Getting-Started-MQTT-sample/Screenshot%20from%202020-04-13%2016-32-30.png)

Then we need to download certificate, keys and root CA from this page:

![](https://blog-image-host.oss-cn-shanghai.aliyuncs.com/lzqblog/AWS-IoT-Getting-Started-MQTT-sample/Screenshot%20from%202020-04-13%2016-33-47.png)


## AWS IoT SDK

[AWS IoT SDK](https://github.com/aws/aws-iot-device-sdk-embedded-C) is the SDK for connecting to AWS IoT from a device using embedded C. Before porting to embedded platform, we can have a quick trial on a Linux based PC.

### Dependencies

This SDK depends on [MbedTLS](https://github.com/ARMmbed/mbedtls). Files of MbedTLS need to copy to *aws-iot-device-sdk-embedded-C/external_libs/mbedTLS/*.

### Modifications before building
MQTT sample code is under *aws-iot-device-sdk-embedded-C/samples/linux/subscribe_publish_sample/*. Before building, we need to do some modifications to make it work.

- Copy the downloaded certificate, keys and root CA into *aws-iot-device-sdk-embedded-C/certs/*.
- Modify */home/alex/data/aws/aws-iot-device-sdk-embedded-C/samples/linux/subscribe_publish_sample/aws_iot_config.h*:
  - AWS_IOT_MQTT_HOST: Which is the API endpoint we got when created a thing
  - AWS_IOT_MY_THING_NAME: Should be same as the name we set when created a thing
  - AWS_IOT_ROOT_CA_FILENAME: File name of the rootCA we downloaded.
  - AWS_IOT_CERTIFICATE_FILENAME: File name of the device certificate we downloaded.
  - AWS_IOT_PRIVATE_KEY_FILENAME: File name of the private key we downloaded.

### make and run

Device log:

```
Subscribing...
-->sleep
Subscribe callback
sdkTest/sub	hello from SDK QOS0 : 0 
Subscribe callback
sdkTest/sub	hello from SDK QOS1 : 1 
-->sleep
Subscribe callback
sdkTest/sub	hello from SDK QOS0 : 2 
Subscribe callback
sdkTest/sub	hello from SDK QOS1 : 3 
-->sleep
Subscribe callback
sdkTest/sub	hello from SDK QOS0 : 4 
Subscribe callback

```

AWS IoT Console:
![](AWS-IoT-Getting-Started-MQTT-sample/Screenshot%20from%202020-04-13%2017-02-38.png)
