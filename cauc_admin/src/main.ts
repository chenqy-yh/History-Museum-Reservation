import '@/style.scss'
import 'animate.css'
import 'element-plus/dist/index.css'
import 'remixicon/fonts/remixicon.css'
import { createApp } from 'vue'

import mitt from 'mitt'
import { createPinia } from 'pinia'
import App from './App.vue'
import setupRouter from './router'

// elemenplus 国际化
import ElementPlus from 'element-plus'
import zhCn from "element-plus/dist/locale/zh-cn.mjs"



const bootstrap = async () => {
    const app = createApp(App)
    await setupRouter(app)
    app.use(createPinia())
    const bus = mitt()
    app.config.globalProperties.$bus = bus
    app.use(ElementPlus, {
        locale: zhCn
    });
    app.mount('#app')
}

bootstrap()
