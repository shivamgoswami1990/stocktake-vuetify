import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import(/* webpackChunkName: "about" */ './views/Login'),
    },
    {
      path: '/dashboard',
      name: 'template',
      component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Template'),
      children: [
        {
          path: 'main',
          name: 'main',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Main')
        },
        {
          path: 'items',
          name: 'items',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Items.vue')
        },
        {
          path: 'users',
          name: 'users',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Users.vue')
        },
        {
          path: 'companies',
          name: 'companies',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Companies.vue')
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Customers.vue')
        },
        {
          path: 'newInvoice',
          name: 'newInvoice',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/NewInvoice.vue')
        },
        {
          path: 'invoices',
          name: 'invoices',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Invoices.vue')
        },
        {
          path: 'editInvoice/:id',
          name: 'editInvoice',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/EditInvoice.vue')
        },
        {
          path: 'viewInvoice/:id',
          name: 'viewInvoice',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/ViewInvoice.vue')
        },
        {
          path: 'hsnSummary',
          name: 'hsnSummary',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/HSNSummary.vue')
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/Analysis.vue')
        },
        {
          path: 'notFound',
          name: 'notFound',
          component: () => import(/* webpackChunkName: "about" */ './views/Dashboard/Children/NotFound.vue')
        }
      ]
    }
  ],
});
