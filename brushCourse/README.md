# 刷题使用方法

1. 使用命令cd进入brushCourse文件夹
2. cnpm install (使用cnpm包管理工具而不是npm, npm由于fq问题无法下载chromium)
3. 参考src/account.json文件,向其中添加没刷过的邮箱账号和密码,可以正确处理是否注册过和是否已经开始我选的那门免费课程
4. cd src && node index.js

### 注意:

1. 将register.js中register函数第二行handless改为true,程序将隐藏浏览器界面
2. account.json有几个账号会同时开几个浏览器窗口
3. 刷完课程的账号会记录在src/logs/completed.log中
4. 浏览器窗口将在运行2小时后自动关闭, 前提是此时浏览器由于异常原因还在运行
5. 运行node src/configLog.js会清除所有日志
6. 用户名和密码都是mock的
7. 模拟iphone6设备防止被封