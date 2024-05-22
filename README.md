# 云开发 quickstart

这是云开发的快速启动指引，其中演示了如何上手使用云开发的三大基础能力：

- 数据库：一个既可在小程序前端操作，也能在云函数中读写的 JSON 文档型数据库
- 文件存储：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- 云函数：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码

## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)


## 安装教程
1.  创建数据库
2.  下载源码
3.  导入源码
4.  关联云空间环境
5.  上传云函数
6.  下载图片资源，并传到云空间
7.  运行代码

## 资源
[项目图片资源下载](https://gitee.com/zheng_yongtao/images-package.git)

## 使用说明

1.[手把手教学，从零到一打造一款专属的情侣小程序](https://blog.csdn.net/Twinkle_sone/article/details/121484742)

### 预览

#### 首页

![输入图片说明](README-IMG/1651486239(1).png)

#### 轮播图

![输入图片说明](README-IMG/1651655524(1).png)

可以动态更新轮播图图片。

#### 消费记录（表单版）

![在这里插入图片描述](https://img-blog.csdnimg.cn/87f4c523d1b14d188ec918d47e4342ec.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)

自己设计表单，每天根据表单项来记录消费。

#### 睡觉打卡

![在这里插入图片描述](https://img-blog.csdnimg.cn/482bfd59597a4849a780672745e73ff8.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)

统计睡觉规律。

#### 消费记录（详细记录版）

![在这里插入图片描述](https://img-blog.csdnimg.cn/fed9d95434584af18a23dd71dfad82a7.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)

详细记录消费内容。

#### 纪念日

![输入图片说明](README-IMG/1651486096(1).png)

可以自己设置纪念日。

#### 辛苦日记录

![在这里插入图片描述](https://img-blog.csdnimg.cn/cb2b3ce0389c4ab9a899e3aea56b43c5.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)

记录生理期时间，同时可以根据多次的记录判断下次生理期时间。

#### 许愿树

![在这里插入图片描述](https://img-blog.csdnimg.cn/f37efa327e5946ffa0de8cfe598a26de.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_12,color_FFFFFF,t_70,g_se,x_16#pic_center)

可以在这里悄悄的写上自己的心愿，等待被发现然后帮你实现。

### 准备

#### 工具

微信开发者工具

[https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

#### 文档

微信开放文档

[https://developers.weixin.qq.com/miniprogram/dev/framework/](https://developers.weixin.qq.com/miniprogram/dev/framework/)

代码地址（不完善版本）

[https://gitee.com/zheng_yongtao/me-and-my-doodle.git](https://gitee.com/zheng_yongtao/me-and-my-doodle.git)

#### 账号

没有小程序账号的需要先去申请一个账号

官网地址：[https://mp.weixin.qq.com/wxamp/home/guide?lang=zh_CN&token=1210542861](https://mp.weixin.qq.com/wxamp/home/guide?lang=zh_CN&token=1210542861)

### 开发

#### 1、下载代码

将代码拉取到本地，然后导入微信开发者工具，需要登录并关联自己的云空间。

#### 2、设置账号信息

![在这里插入图片描述](https://img-blog.csdnimg.cn/2fa598032072499594800d299c4fc77d.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


因为是自用的，所以也就没有将账号信息存放到数据库中，而是保存为一个用户配置文件，文件位置如上图。userConfig对象中的key对应账号，password则是密码，nickName为在小程序中显示的昵称，eName是英文别名（这里是随便起的），color为代表色，icon是代表图表，wishIcon为许愿树模块中的礼物盒图标，将账号信息配置好即可登录小程序。

#### 3、上传图片并修改路径

图片包地址：[https://gitee.com/zheng_yongtao/images-package.git](https://gitee.com/zheng_yongtao/images-package.git)

因为一开始只是为了做一个记账本功能的小程序，所以我在云存储中创建了一个记账本文件夹，如下图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/18b45506a7514a83a26934ff3babae80.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2a6f5daece67489ca13cba026bd876c6.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

我们可以在这里创建一个文件夹（或者自己重新命名创建一个文件夹，代码中对应的图片路径要改变），下载好图片包后上传到该目录中，然后修改小程序中对应的文件路径即可。图片的公共路径在配置文件我已经进行了抽取配置，这里修改为你云空间的存储路径即可，如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/421e2ce136cd4c15a69d40b52221cfb5.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


#### 4、上传云函数

![在这里插入图片描述](https://img-blog.csdnimg.cn/f2e8b690eb9a4fb0ace18d80622a33eb.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_10,color_FFFFFF,t_70,g_se,x_16#pic_center)


右键选择上传并部署（所有文件）
 wx-server-sdk报错的话需要在每个云函数目录中安装一下依赖`npm instasll wx-server-sdk@latest`;
后续有时间会进行优化。

#### 5、初始化数据库

首次导入需要先初始化数据库，已集成为函数一键初始化，只需点击我的页面中的初始化数据库按钮即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/e330a0d5d00445c0b07f5aabf7ad4b8d.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_15,color_FFFFFF,t_70,g_se,x_16#pic_center)


#### 6、上传代码为体验版

![在这里插入图片描述](https://img-blog.csdnimg.cn/25d2d3abb232427abff9ba39cdad64da.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)


上传之后代码可以在自己的小程序后台看到上传的版本，目前个人不支持上传为线上版本，所以我们只能使用体验版，设置为体验版的方法如下：
微信小程序管理后台地址：[https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=1210542861&lang=zh_CN](https://mp.weixin.qq.com/wxamp/wacodepage/getcodepage?token=1210542861&lang=zh_CN)


![在这里插入图片描述](https://img-blog.csdnimg.cn/ea11393e5d7e4f0a86324d4076db10ef.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/bddddddc72764696b6dd2d8238672cc0.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

#### 7、添加体验成员

上传为体验版之后，还应该要将对方设置为体验成员或项目成员，对方才有权限体验小程序，和你一起使用小程序。
![在这里插入图片描述](https://img-blog.csdnimg.cn/890cac18aa6d41729a004c9b818d54d5.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/09365556d78c442da3cb56079d1e3020.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

### 问题合集
#### 1、数据库初始化失败
大概率是云函数依赖没有安装，可以在下面几个云函数目录都安装上依赖。
```shell
npm install wx-server-sdk
```
![输入图片说明](README-IMG/%E4%BA%91%E5%87%BD%E6%95%B0.png)

### 体验

点击体验版二维码这里，就会弹出一个二维码，扫码后即可打开小程序，然后将其分享给你的女朋友即可一起使用该小程序了。

![在这里插入图片描述](https://img-blog.csdnimg.cn/177392ea22124d1cbd7a728e1c75aa9d.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBAU0FET05fanVuZw==,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

## 联系我
1. [个人博客地址](http://jyeontu.xyz/JYeontuBlog/#/home)
2. 微信公众号：『前端也能这么有趣』

