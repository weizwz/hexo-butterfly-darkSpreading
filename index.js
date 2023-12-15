'use strict';
// 全局声明插件代号
const pluginname = 'hexo_butterfly_darkSpreading';
// 全局声明依赖
const pug = require('pug');
const path = require('path');
const fs = require('hexo-fs');
const { version } = require('./package.json');

// 注册静态资源
hexo.extend.generator.register('darkSpreading_lib', () => [
  {
    path: 'css/darkSpreading.css',
    data: function () {
      return fs.createReadStream(path.resolve(path.resolve(__dirname, './lib'), 'darkSpreading.css'));
    }
  }
])

// hexo过滤器 https://hexo.io/zh-cn/api/filter
hexo.extend.filter.register(
  'after_generate', 
  function () {
    // 获取整体的配置项名称
    const config = hexo.config.darkSpreading || hexo.theme.config.darkSpreading;
    // 如果配置开启
    if (!(config && config.enable)) return;

    // 集体声明配置项
    const data = {
      layout_type: config.layout.type,
      layout_name: config.layout.name,
      layout_index: config.layout.index ? config.layout.index : 0,
    }

    // 渲染页面
    const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/darkSpreading.pug'), data);

    //注入容器声明
    var get_layout;
    //若指定为class类型的容器
    if (data.layout_type === 'class') {
      //则根据class类名及序列获取容器
      get_layout = `document.getElementsByClassName('${data.layout_name}')[${data.layout_index}]`;
    }
    // 若指定为id类型的容器
    else if (data.layout_type === 'id') {
      // 直接根据id获取容器
      get_layout = `document.getElementById('${data.layout_name}')`;
    }
    // 若未指定容器类型，默认使用id查询
    else {
      get_layout = `document.getElementById('${data.layout_name}')`;
    }

    //挂载容器脚本
    var user_info_js = `
      <script data-pjax>
        if (typeof window.dark === 'undefined') {
          window.dark = {
            ${pluginname}_init: function() {
              var parent_div_git = ${get_layout};
              var item_html = '${temple_html_text}';
              parent_div_git.insertAdjacentHTML("afterbegin",item_html);
            },
            hideCover: function() {
              const $main = document.querySelector("#recommend-post-main");
              $main.className = 'recommend-post-main recommend-hide';
            }
          }
        }
        window.dark.${pluginname}_init();
      </script>`;

    // 此处利用挂载容器实现了二级注入
    hexo.extend.injector.register('body_end', user_info_js, 'default');

    // 注入静态资源
    const css = hexo.extend.helper.get('css').bind(hexo);
    // const js = hexo.extend.helper.get('js').bind(hexo)
    hexo.extend.injector.register('head_end', () => {
      return css(`/css/darkSpreading.css?v=${version}`);
    }, 'default')
  },
  (hexo.config.recommend || hexo.config.theme_config.recommend)['priority'] || 10
)

