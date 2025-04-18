import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/landingpage.vue';
import Ipdisclaimer from '../views/ipdisclaimer.vue';
import Ips1 from '../views/ips1.vue';
import Ips2 from '../views/ips2.vue';
import Ips3 from '../views/ips3.vue';
import Ips4 from '../views/ips4.vue';
import Cs1 from '../views/cs1.vue';
import Cs2 from '../views/cs2.vue';
import Cs3 from '../views/cs3.vue';
import Policies from '../views/policies.vue';
import Contacts from '../views/contacts.vue';
import Login from '../views/login.vue';
import Signup from '../views/signup.vue';
import homepage from '../views/homeview.vue';
import Admincs3 from '../views/admincs3.vue'


const routes = [
    { path: '/', component: LandingPage },
    { path: '/ipsdisclaimer', component: Ipdisclaimer },
    
    { path: '/ips1', component: Ips1 },
    { path: '/ips2', component: Ips2 },
    { path: '/ips3', component: Ips3 },
    { path: '/ips4', component: Ips4 },
    { path: '/cs1', component: Cs1 },
    { path: '/cs2', component: Cs2 },
    { path: '/cs3', component: Cs3 },
    { path: '/admincs3', component: Admincs3 },
    { path: '/policies', component: Policies },
    { path: '/contacts', component: Contacts },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/home', component: homepage },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
