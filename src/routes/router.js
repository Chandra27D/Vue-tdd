import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import UserPage from '../pages/UserPage';


const routes = [
    {
        path: "/",
        component: HomePage 
    },
    {
        path: "/signup",
        component: SignUpPage 
    },
    {
        path: "/login",
        component: LoginPage 
    },
    {
        path: "/user/:id",
        component: UserPage 
    },
];

const router = createRouter({routes, history: createWebHistory()});

export default router;