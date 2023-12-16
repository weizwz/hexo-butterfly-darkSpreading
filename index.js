'use strict';
// 全局声明插件代号
const pluginname = 'hexo_butterfly_navctrl';
// 全局声明依赖
const pug = require('pug');
const path = require('path');
const fs = require('hexo-fs');
const { version } = require('./package.json');

// 注册静态资源
hexo.extend.generator.register('navctrl_lib', () => [
  {
    path: 'css/navctrl.css',
    data: function () {
      return fs.createReadStream(path.resolve(path.resolve(__dirname, './lib'), 'navctrl.css'));
    }
  }
])

// hexo过滤器 https://hexo.io/zh-cn/api/filter
hexo.extend.filter.register(
  'after_generate', 
  function () {
    // 获取整体的配置项名称
    const config = hexo.config.navctrl || hexo.theme.config.navctrl;
    // 如果配置开启
    if (!(config && config.enable)) return;

    // 获取菜单
    const getMenu = function (str) {
      if (!str) return false;
      const strArr = str.split('||');
      if (strArr.length < 2) return false;
      return {
        title: strArr[0].trim(),
        icon: strArr[1].trim()
      }
    }

    // 获取所有文章路径
    const posts_list = hexo.locals.get('posts').data;
    let posts_path = [];
    for (const item of posts_list) {
      posts_path.push(item.path);
    }

    // 集体声明配置项
    const data = {
      layout_type: config.layout.type,
      layout_name: config.layout.name,
      layout_index: config.layout.index ? config.layout.index : 0,
      menu_display: config.menu.display || '',
      menu_dark: getMenu(config.menu.dark),
      menu_random: getMenu(config.menu.random),
    }

    // 渲染页面
    const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/navctrl.pug'), data);

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

    // 挂载容器脚本
    var user_info_js = `
      <script data-pjax>
        if (typeof window.navctrl === 'undefined') {
          window.navctrl = {
            ${pluginname}_init: function() {
              const $navctrl = document.querySelector('#navctrl');
              if($navctrl) return;
              var parent_div_git = ${get_layout};
              var item_html = '${temple_html_text}';
              parent_div_git.insertAdjacentHTML("beforeend",item_html);
            },
            changeDark: function() {
              const event = window.event || arguments.callee.caller.arguments[0];
              document.documentElement.style.setProperty('--x', event.clientX + 'px');
              document.documentElement.style.setProperty('--y', event.clientY + 'px');
              if(document.startViewTransition) {
                document.startViewTransition(() => {
                  window.navctrl.setTheme();
                })
              } else {
                window.navctrl.setTheme();
              }
            },
            setTheme: function() {
              const theme = document.documentElement.getAttribute('data-theme');
              if (theme === 'light' || !theme) {
                document.documentElement.setAttribute('data-theme', 'dark')
                document.documentElement.classList.add('navctrl-dark')
                window.localStorage.theme = JSON.stringify({
                  value: 'dark',
                  expiry: Date.now() + 2*24*60*60*1000
                })
              } else {
                document.documentElement.setAttribute('data-theme', 'light')
                document.documentElement.classList.remove('navctrl-dark')
                window.localStorage.theme = JSON.stringify({
                  value: 'light',
                  expiry: Date.now() + 2*24*60*60*1000
                })
              }
            },
            toRandomPost: function() {
              var posts_path = "${posts_path}".split(',');
              var randomPost = posts_path[Math.floor(Math.random() * posts_path.length)];
              window.recommend.toPost(randomPost);
            }
          }
          console.log(
            "%c plugin ⭐ hexo_butterfly_navctrl ⭐ https://github.com/weizwz/hexo-butterfly-navctrl ",
            "color: #fff; padding:3px; font-size:12px; background: linear-gradient(90deg, #358bff, #1eebeb);"
          )
        }
        window.navctrl.${pluginname}_init();
      </script>`;

    // 此处利用挂载容器实现了二级注入
    hexo.extend.injector.register('body_end', user_info_js, 'default');

    // 注入静态资源
    const css = hexo.extend.helper.get('css').bind(hexo);
    // const js = hexo.extend.helper.get('js').bind(hexo)
    hexo.extend.injector.register('head_end', () => {
      return css(`/css/navctrl.css?v=${version}`);
    }, 'default')
  },
  (hexo.config.recommend || hexo.config.theme_config.recommend)['priority'] || 10
)

