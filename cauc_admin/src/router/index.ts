import { setupInitRoutes } from '@/router/modules';
import guard from '@/router/modules/gurad';
import { App } from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';

export const router: Router = createRouter({
    history: createWebHistory(),
    routes: await setupInitRoutes(),
});

const setupRouter = async (app: App) => {
    // guard(router)
    app.use(router)
    await router.isReady();
}

export default setupRouter;