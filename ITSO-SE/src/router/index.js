import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/landingpage.vue';
import Ips1 from '../views/ips1.vue';
import Cs1 from '../views/cs1.vue';
import Policies from '../views/policies.vue';
import Contacts from '../views/contacts.vue';
import Ips2 from '../views/ips2.vue';
import Login from '../views/login.vue';
import Signup from '../views/signup.vue';
import Ips3 from '../views/ips3.vue';

const routes = [
    { path: '/', component: LandingPage },
    { path: '/ips1', component: Ips1 },
    { path: '/ips2', component: Ips2 },
    { path: '/ips3', component: Ips3 },
    { path: '/cs1', component: Cs1 },
    { path: '/policies', component: Policies },
    { path: '/contacts', component: Contacts },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
