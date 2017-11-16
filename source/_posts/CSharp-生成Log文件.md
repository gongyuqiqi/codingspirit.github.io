---
title: C# 生成Log文件
tags:
  - C#
date: 2017-11-16 13:05:43
categories: 编程相关
---
写了个Log类实现带时间戳的Log out, 代码如下：
<!--more-->
```cs
namespace My_Space
{
    using System;
    using System.IO;
    class Log
    {
        private string logFile;
        private StreamWriter writer;
        private FileStream fileStream = null;

        public Log(string fileName)
        {
            logFile = fileName;
            CreateDirectory(logFile);
        }

        public void LogOut(string info)
        {
            try
            {
                FileInfo fileInfo = new FileInfo(logFile);
                if (!fileInfo.Exists)
                {
                    fileStream = fileInfo.Create();
                    writer = new StreamWriter(fileStream);
                }
                else
                {
                    fileStream = fileInfo.Open(FileMode.Append, FileAccess.Write);
                    writer = new StreamWriter(fileStream);
                }
                writer.WriteLine("@" + DateTime.Now + "#" + info + ";");
            }
            finally
            {
                if (writer != null)
                {
                    writer.Close();
                    writer.Dispose();
                    fileStream.Close();
                    fileStream.Dispose();
                }
            }
        }

        private void CreateDirectory(string filePath)
        {
            DirectoryInfo directoryInfo = Directory.GetParent(filePath);
            if (!directoryInfo.Exists)
            {
                directoryInfo.Create();
            }
        }

        public static void ReadLog(string logPath, out string dataRead)
        {
            StreamReader sR1 = new StreamReader(logPath);
            try
            {
                dataRead = sR1.ReadToEnd();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
```