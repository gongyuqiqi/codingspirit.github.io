---
title: C#自定义Excel导出类
tags:
  - C#
date: 2017-11-08 09:20:36
categories: 编程相关
---
前段时间写了个debug tool用来自动抓测试数据，该工具需要通过爬取Log数据自动生成带Chart的Excel，但是原生的COM组件非常不好用，于是我重新封装了一个。
<!--more-->
Reference: Microsoft Excel 15.0 Object Library(COM组件)
```cs
using Microsoft.Office.Interop.Excel;
using System;
using System.Reflection;

namespace My_Space
{
    class ExportExcel
    {
        private string xlsOutPath;
        private string xlsInPath;
        private Application xlsApp;
        private Workbook xlsWorkBook;
        private Worksheet xlsWorkSheet;
        private object misValue = Missing.Value;

        public ExportExcel(string excelOutPath)
        {
            xlsOutPath = excelOutPath;
            xlsInPath = null;
            xlsApp = new Application();
            if (xlsApp == null)
            {
                throw new Exception("Please Install Excel 2013 or Newer Verison");
            }
            XlsWorkBook = xlsApp.Workbooks.Add(misValue);
            xlsWorkSheet = XlsWorkBook.Worksheets.get_Item(1);
        }
        public ExportExcel(string excelInPath, string excelOutPath)
        {
            xlsInPath = excelInPath;
            xlsOutPath = excelOutPath;
            xlsApp = new Application();
            if (xlsApp == null)
            {
                throw new Exception("Please Install Excel 2013 or Newer Verison");
            }
            XlsWorkBook = xlsApp.Workbooks.Add(xlsInPath);
            xlsWorkSheet = XlsWorkBook.Worksheets.get_Item(xlsWorkBook.Worksheets.Count);
        }

        public Worksheet XlsWorkSheet { get => xlsWorkSheet; set => xlsWorkSheet = value; }
        public Workbook XlsWorkBook { get => xlsWorkBook; set => xlsWorkBook = value; }

        public void AddChart(Worksheet worksheet, double left, double top, double weight, double height, string dataStart, string dataEnd)
        {
            ChartObjects xlsCharts = worksheet.ChartObjects(Type.Missing);
            ChartObject myChart = xlsCharts.Add(left, top, weight, height);
            Range chartRange = worksheet.get_Range(dataStart, dataEnd);
            myChart.Chart.SetSourceData(chartRange, misValue);
            myChart.Chart.ChartType = XlChartType.xlXYScatterSmooth;
            myChart.Chart.ChartStyle = 245;
        }
        public void AddSheet(string name)
        {
            bool exist = false;int i;
            for (i = 1; i <= XlsWorkBook.Sheets.Count; i++)
            {
                if (XlsWorkBook.Sheets[i].Name == name)
                {
                    exist = true;
                    break;
                }
            }
            if (!exist)
            {
                xlsWorkSheet = XlsWorkBook.Sheets.Add(misValue, xlsWorkSheet, misValue, misValue);
                xlsWorkSheet.Name = name;
            }
            else
            {
                xlsWorkSheet = XlsWorkBook.Sheets[i];
            }
        }
        public void CopySheet(Worksheet src,Worksheet dst)
        {
            src.Cells.Copy(Type.Missing);
            try
            {
                dst.Paste(Type.Missing, Type.Missing);
            }
            catch (Exception)
            {
                throw;
            }
        }
        public void AddHyperLink(string cellName, string link)
        {
            Range range = xlsWorkSheet.get_Range(cellName,Type.Missing);
            xlsWorkSheet.Hyperlinks.Add(range, link);
        }
        public void SaveExcel(bool flag)
        {
            if (flag)
            {
                xlsWorkBook.Close(true, xlsOutPath, misValue);
            }
            System.Runtime.InteropServices.Marshal.ReleaseComObject(xlsWorkSheet);
            System.Runtime.InteropServices.Marshal.ReleaseComObject(xlsWorkBook);
            System.Runtime.InteropServices.Marshal.ReleaseComObject(xlsApp);
            xlsWorkSheet = null;
            xlsWorkBook = null;
            xlsApp = null;
            GC.Collect();
        }
    }
}
```