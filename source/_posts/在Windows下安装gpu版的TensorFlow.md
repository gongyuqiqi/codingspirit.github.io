---
title: 在Windows下安装gpu版的TensorFlow
tags:
  - Machine Learning
  - TensorFlow
date: 2018-01-23 17:25:51
categories: 机器学习
---
  使用非gpu版本的TensorFlow进行训练实在是太慢了，于是尝试在Windows下安装gpu版本的TensorFlow，写篇日志记录一下。
<!--more-->
## 工作环境
  OS：Win10
  Python:3.5(目前TensorFlow仍不支持3.6)
## 安装CUDA
  首先确定想要安装的TensorFlow版本需要哪个版本的CUDA支持。我这里安装的TF版本是1.5.0，需要CUDA 9.0的支持。
### 下载并安装CUDA
  前往[developer.nvidia.com](https://developer.nvidia.com/cuda-downloads)下载CUDA 9.0。一直下一步就行。
  完成之后验证一下是否已经正确安装，运行cmd：
```bash
nvcc  -V
```
如果正确安装，将会显示版本信息：
```bash
C:\Windows\system32>nvcc  -V
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2017 NVIDIA Corporation
Built on Fri_Sep__1_21:08:32_Central_Daylight_Time_2017
Cuda compilation tools, release 9.0, V9.0.176
```
## 安装CUDNN
  同样需要确认需要哪个版本的CUDNN。我这里需要CUDNN 9.0。前往[developer.nvidia.com](https://developer.nvidia.com/cuda-toolkit-archive)下载指定版本，下载完成是一个压缩包，解压到C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v9.0
## 安装TensorFlow
```bash
pip install tensorflow-gpu==1.5.0
```
此处使用==指定版本。另外可以在[pypi.python.org](https://pypi.python.org/pypi)查询到某个包的版本信息。
## 测试
```bash
python
```
```python
import tensorflow as tf
tf.__version__
sess = tf.Session()
a = tf.constant(20)
b = tf.constant(99)
print(sess.run(a + b))
```
运行结果：
```bash
C:\Windows\system32>python
Python 3.5.4 (v3.5.4:3f56838, Aug  8 2017, 02:17:05) [MSC v.1900 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import tensorflow as tf
>>> tf.__version__
'1.5.0'
>>> sess = tf.Session()
2018-02-05 10:21:19.674014: I C:\tf_jenkins\workspace\rel-win\M\windows-gpu\PY\35\tensorflow\core\platform\cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX AVX2
2018-02-05 10:21:20.177086: I C:\tf_jenkins\workspace\rel-win\M\windows-gpu\PY\35\tensorflow\core\common_runtime\gpu\gpu_device.cc:1105] Found device 0 with properties:
name: GeForce 940MX major: 5 minor: 0 memoryClockRate(GHz): 1.2415
pciBusID: 0000:02:00.0
totalMemory: 2.00GiB freeMemory: 1.66GiB
2018-02-05 10:21:20.177537: I C:\tf_jenkins\workspace\rel-win\M\windows-gpu\PY\35\tensorflow\core\common_runtime\gpu\gpu_device.cc:1195] Creating TensorFlow device (/device:GPU:0) -> (device: 0, name: GeForce 940MX, pci bus id: 0000:02:00.0, compute capability: 5.0)
>>> a = tf.constant(20)
>>> b = tf.constant(99)
>>> print(sess.run(a + b))
119
```
## 如何更新
```bash
pip install --upgrade tensorflow-gpu
```