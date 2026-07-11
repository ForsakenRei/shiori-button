# 海獭按钮 Shiori-button

__请注意音量__ __请注意音量__ __请注意音量__

重的事情说三遍.jpg

## 这是什么？
这是VirtuaReal所属海獭[栞栞Shiori](https://space.bilibili.com/1609526545)的语音按钮网站——海獭按钮的源代码repo。

本项目受众多现存Vtuber语音按钮所启发，使用`Vue`+`Node.js`构建，包含非专业full-stack dev低质量手搓代码与人工智障生成代码，请谨慎使用。

感谢每一位对本项目提供帮助的ttk，包括但不限于切片员，录播员，群友。

## 使用说明

1.每次页面刷新会随机选取一句海獭名言用答辩色显示在最上方。\
2.致聋ttk计数，依赖Umami统计累计访问海獭按钮的ttk总数。\
3.随机老馋：从全部语音可用中随机播放一个。\
4.停止老馋：停止正在播放的所有语音。\
5.连续老馋：勾选后再使用随机功能，会持续播放直到点击停止。\
6.循环老馋：勾选后再播放任意语音，会循环播放直到点击停止。\
7.多重老馋：勾选后可以连续点击多个语音，会并行播放。\
8.全弹装填模式：__慎用！__ 点击任一分类标题会同时播放该分类下的所有语音。

## 完善海獭按钮

个人代码水平与空闲时间都有限，欢迎各位贡献新语音，新名言，新代码以及捉Bug。

### 贡献新语音或新名言

有编程经验欢迎直接提交PR。\
没有编程经验也可以使用Issue模版中的新语音或者新名言模版并提供相关信息，由维护人员确认后添加。

### 新功能，Bug等

同上，有编程经验欢迎直接提交PR，也欢迎通过Issue提出新功能建议或Bug报告。

## 本地开发

确保`Node`和`npm`已安装，clone代码到本地之后运行
```shell
npm install && npm run dev
```
同时启动前后端服务器，可通过`localhost:5173`访问，本地代码修改会即时更新。

如果需要部署在服务器上，运行
```shell
npm install && npm run build && node server.js
```
生成静态站并启动后端服务器，可通过`server_ip:3001`访问。

如使用Docker部署，只需运行
```shell
docker compose up -d
```
注：Docker部署目前不支持hot-reload。

### Umami

ttk计数依赖Umami，仅支持self-hosted，参考`.env.example`设置以下环境变量：

```shell
UMAMI_BASE_URL=http://umami:3000
UMAMI_WEBSITE_ID=your-website-id
UMAMI_TOKEN=your-token
UMAMI_START_AT=0 #optional
```

本地测试开发其实可以忽略，只是单纯不显示计数而已。

## 响度匹配与背景音消除

将逐步匹配所有音频响度至峰值 -6dB （Peak Amplitude）并使用[UVR](https://github.com/anjok07/ultimatevocalremovergui)去除背景音。

## LICENSE

本项目遵循GNU GENERAL PUBLIC LICENSE Version 3。

在引用或者基于海獭按钮开发新项目时，请注明来源项目并遵循GPL v3协议进行开源。

## Disclaimer

本项目为粉丝作品，与VirtuaReal并无任何关联。
