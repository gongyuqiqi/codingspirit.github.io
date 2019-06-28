---
title: 'Webserver bring up (II): Create a demo page(html+fcgi)'
top: false
tags:
  - Linux
  - Web
date: 2019-06-28 19:53:01
categories: 编程相关
---

In last post we have installed lighttpd and fastcgi++, it's create a demo page to have a quick verification.

<!--more-->


## A simple html

Let's write a simple html for demo:

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8' />
    <link rel="icon" href="/img/favicon.ico" type="img/x-ico" />
    <title>Alex Demo page</title>
</head>

<body background="/img/back.jpg"
    style=" background-repeat:no-repeat ;background-size:100% 100%;background-attachment: fixed;">
    <div align="center" style="margin-top: 25%">
        <form id="diag" action="/cpp_get.fcgi" method="get">
            <table border="0" style="background-color:dimgrey">
                <tr>
                    <td align="right" valign="middle">
                        Product Name:<input type=" text" name="product_name" /><br />
                        Product ID:<input type="text" name="product_id" /><br />
                        <input type="submit" value="提交" />
                    </td>
                </tr>
            </table>
        </form>
    </div>

</body>

</html>
```

This page will show a picture as page background, meanwhile a from will be created for testing GET method. The path we are using in html is relative path, i.e. if you put your pages to */var/www/pages/test.html*, the absolute path of back.jpg will be */var/www/pages/img/back.jpg* and the relative path will be */img/back.jpg*.

Beware of access rights of those files/directories, the user and user group of lighttpd was configured in **lighttpd.conf** by **server.username** and **server.groupname**. Make sure lighttpd can access them.

## Write a simple fgci backend


```cpp
// fcgi_get.cpp
#include <fastcgi++/request.hpp>
#include <iomanip>
#include <fstream>

class GetTest : public Fastcgipp::Request<wchar_t>
{
    bool response()
    {

        std::wofstream outPutFile("output.patch", std::ios_base::out | std::ios_base::binary);
        //! [Response definition]
        //! [HTTP header]
        out << L"Content-Type: text/html; charset=utf-8\r\n\r\n";
        //! [HTTP header]

        //! [Output]
        out << L"<!DOCTYPE html>\n"
               L"<html>"
               L"<head>"
               L"<meta charset='utf-8' />"
               L"<title>Success</title>"
               L"</head>"
               L"<body>"
               L"<p>";
        using Fastcgipp::Encoding;

        if (!environment().gets.empty())
            for (const auto &get : environment().gets)
            {
                out << L"<b>" << Encoding::HTML << get.first << Encoding::NONE
                    << L":</b> " << Encoding::HTML << get.second
                    << Encoding::NONE << L"<br />";
                outPutFile << get.first << ":" << get.second;
            }

        out << L"</p>"
               L"</body>"
               L"</html>";
        //! [Output]

        //! [Return]
        outPutFile << "FFF" << std::endl;
        outPutFile.close();
        return true;
    }
};

#include <fastcgi++/manager.hpp>
int main()
{
    Fastcgipp::Manager<GetTest> manager;
    //! [Manager]
    //! [Signals]
    manager.setupSignals();
    //! [Signals]
    //! [Listen]
    manager.listen();
    //! [Listen]
    //! [Start]
    manager.start();
    //! [Start]
    //! [Join]
    manager.join();

    return 0;
}
```

Use *environment().gets* to get all data passed by frontend through GET method.

## Compile your fcgi

```bash
g++ fcgi_get.cpp -lfastcgipp -o cpp_get.fcgi
```

Then copy it to */var/www/fcgi-bin/cpp_get.fcgi*. Don't forget add rights of execution for this fcgi file.

## Add your fcgi into lighttpd conf

```
  "/cpp_get.fcgi" => (
    "cpp_get.fastcgi.handler" => (
      "socket" => "/var/run/lighttpd/lighttpd-cpp_get-" + PID + ".socket",,
      "check-local" => "disable",
      "bin-path" => "/var/www/fcgi-bin/cpp_get.fcgi",
      "max-procs" => 30,
    )
  )
```

This configuration allows you execute your fcgi by access localhost/cpp_get.fcgi.

## Apply changes

If lighttpd is already started on your device, you might need to restart lighttpd services to apply changes: 

```bash
service lighttpd force-reload
```

## Verification

Open *http://localhost/test.html*, input something in the form then click "提交", if everything is ok, browser will jump to *http://localhost/cpp_get.fcgi* and show what you have inputted. Meanwhile a file called *output.patch* will be generated at your page folder which contains the text you inputted as well.

Tips: If error occurred, you can find the path of error log by checking the value of **server.errorlog** in your **lighttpd.conf**.
