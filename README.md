# hexo-butterfly-navCtrl
<p>
  <a href="https://www.npmjs.com/package/hexo-butterfly-navCtrl?activeTab=versions"><img src="https://img.shields.io/npm/v/hexo-butterfly-navCtrl?color=409eff" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/hexo-butterfly-navCtrl"><img src="https://img.shields.io/npm/dm/hexo-butterfly-navCtrl" alt="Coverage Status"></a>
  <a href="https://mit-license.org/"><img src="https://img.shields.io/github/license/weizwz/hexo-butterfly-navCtrl" alt="Downloads"></a>
</p>

[hexo-theme-butterfly](https://github.com/jerryc127/hexo-theme-butterfly) 主题的扩展，导航栏控制中心

实际效果展示 [唯之为之的博客](https://weizwz.com) 

演示博客示例 [butterfly-plug](https://github.com/weizwz/butterfly-plug) 

参与调试/自定义修改/开发butterfly主题插件，可配合 [butterfly-plug](https://github.com/weizwz/butterfly-plug) 项目示例，欢迎 `⭐Star`。

## 安装
```shell
npm i hexo-butterfly-navCtrl --save
```

## 升级
```shell
npm update hexo-butterfly-navCtrl --save
```

## 使用
在 `_config.butterfly.yml` 里找到 `darkmode`，然后屏蔽掉默认的暗黑模式
```yml
# dark mode
darkmode:
  enable: false # 设置为false
```

将以下配置添加到 `_config.butterfly.yml` 或 `_config.yml`。
```yml
navCtrl:
  enable: true #开关
  priority: 10 #过滤器优先权 默认10，值越低过滤器越早执行
  layout: #挂载容器类型
    type: id
    name: nav #容器名称
    index: 1 #如果是class，取第几个
  menu:
    dark: true || 'fas fa-adjust'
```
重启生效