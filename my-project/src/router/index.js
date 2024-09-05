import { createRouter, createWebHistory } from "vue-router";

const routers = [
    {
        path: "/",
        name: "Home",
        component: () => import("../components/HelloWorld.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers
});

router.beforeEach((to, from, next) => {
    console.log(`router to ${to} ; router from ${from}`);
    next();
});

export default router;