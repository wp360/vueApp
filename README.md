# Vue2 应用开发

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 开发流程
1. layout.vue 页面布局
2. main.js导入生成
## main.js
```js
默认 》》》
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

修改后 》》》
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Layout from './components/layout'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<Layout/>',
  components: { Layout }
})
```
3. vue-router可以一开始构建时选择安装，也可以单独安装
`npm install --save vue-router`
### router > index.js 修改
```js
默认 》》》
import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    }
  ]
})

修改后 》》》
import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage
    }
  ]
})
```
4. 中间部分内容构建
pages > index.vue
```js
产品内容循环遍历
1. 首先，在data里写入测试的数据
例如：
    data() {
        return {
            boardList: [
              {
                title: '开放产品',
                ...省略
              },
              ...省略
            ]
2. 然后，template模板里添加
...省略
<div class="index-board-item-inner">
    <h2>{{item.title}}</h2>
    <p>{{item.description}}</p>
    <div class="index-board-button">
        <a href="" class="button">立即购买</a>
    </div>
</div>
3. 样式添加及对应调整
<style scoped>
...省略
</style>
当然，部分内容需要做些判断，添加不同的类名，以更改样式。
例如：
<div class="index-board-item" 
v-for="(item,index) in boardList" 
:class="[{'line-last' : index % 2 !==0 },
'index-board-' + item.id]">
```
5. vue前后台数据交互vue-resource
`npm install vue-resource`
```js
1. 在main.js里全局导入
import VueResource from 'vue-resource'
Vue.use(VueResource)
2. 使用的话，例如：
export default {
    created: function(){
        this.$http.get('getList')
        .then(function(data){
            console.log(data);
        },function (err){
            console.log(err);
        })
    },
    ...省略
```
相关使用方法，可以参考
[一起玩转Vue-resource](http://www.jianshu.com/p/3ce2bd36596e)
[vue前后台数据交互vue-resource文档](http://www.cnblogs.com/yuzhengbo/p/6714355.html)

6. json-server “伪造”后台接口
`npm install json-server --save`
然后，进入build > dev-server.js里，添加
```js
var jsonServer = require('json-server')
var apiServer = jsonServer.create()
var apiRouter = jsonServer.router('db.json')
var middlewares = jsonServer.defaults()

apiServer.use(middlewares)
apiServer.use(apiRouter)
apiServer.listen(port + 1, () => {
  console.log('JSON Server is running')
})
```
[文档](https://github.com/typicode/json-server)
## 代理使用
config 》 index.js
```js
    assetsPublicPath: '/',
    proxyTable: {},
    改成
    proxyTable: {
      '/api/': 'http://localhost:8081/'
    },

接下来，更新内容 （pages/index.vue）
    created: function(){
        this.$http.get('api/getNewsList')
        .then((res) => {
           this.newsList = res.data;
        },(err) => {
            console.log(err);
        })
    },

json-server 的不足：
只能通过get请求获取数据，所以，解决方法是采用express。
```
7. 如何去除vue项目中的 # --- History模式
使用vue-cli搭建的环境，在配置好路由之后，可以看到下面的情况：
http://localhost:8080/#/
解决办法：添加 》 mode: 'history',
[参考文档](https://router.vuejs.org/zh-cn/essentials/history-mode.html)
[相关文章](http://www.cnblogs.com/zhuzhenwei918/p/6892066.html)

8. express
```js
//express获取数据，此为通用方法
var apiServer = express()
var bodyParser = require('body-parser')
apiServer.use(bodyParser.urlencoded({ extended: true }))
apiServer.use(bodyParser.json())
var apiRouter = express.Router()
var fs = require('fs')
apiRouter.route('/:apiName')
.all(function (req, res) {
  fs.readFile('./db.json', 'utf8', function (err, data) {
    if (err) throw err
    var data = JSON.parse(data)
    if (data[req.params.apiName]) {
      res.json(data[req.params.apiName])  
    }
    else {
      res.send('no such api name')
    }
  })
})


apiServer.use('/api', apiRouter);
apiServer.listen(port + 1, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + (port + 1) + '\n')
})
相关知识点：
[nodejs模块——fs模块](http://www.cnblogs.com/starof/p/5038300.html)
readFile读取文件
var fs = require('fs'); // 引入fs模块

fs.readFile('./文件', function(err, data) {
    // 读取文件失败/错误
    if (err) {
        throw err;
    }
    // 读取文件成功
    console.log(data);
});
[HTML5 History 模式](https://router.vuejs.org/zh-cn/essentials/history-mode.html)
```
9. Vue相关组件库
[链接地址](https://github.com/vuejs/awesome-vue)
## 幻灯片效果
关于幻灯片制作：
1. 构建静态页面，确定样式
2. 相关数据动态调用加载
3. 切换事件绑定
4. 前后图片切换效果添加
5. 高亮显示
6. 切换动画效果（移入移出） 样式添加
7. 事件触发监听
8. 参考总结 后续添加新功能特效
```html
<a :href="slides[nowIndex].href">
  <img :src="slides[nowIndex].src">
</a>
修改为
<a :href="slides[nowIndex].href">
  <transition name="slide-trans">
    <img v-if="isShow" :src="slides[nowIndex].src">
  </transition>
  <transition name="slide-trans-old">
    <img v-if="!isShow" :src="slides[nowIndex].src">
  </transition>
</a>
```

## 备注
### 错误提示:
> `[vue-language-server] Elements in iteration expect to have 'v-bind:key' directives.
Renders the element or template block multiple times based on the source data`
原因：Vue 2.2.0+的版本里，当在组件中使用v-for时，key是必须的。
解决：
更改vetur配置            vscode->首选项->设置->搜索（vetur）
```js
"vetur.validation.template": true,
改成：
"vetur.validation.template": false,
```
参考文章：

1. http://www.cnblogs.com/fly_dragon/p/6220273.html

2. http://www.jianshu.com/p/5ba253651c3b

3. [es6的export语法问题](https://segmentfault.com/q/1010000005918462)

4. [Vue2.0 新手完全填坑攻略——从环境搭建到发布](http://www.jianshu.com/p/5ba253651c3b)
