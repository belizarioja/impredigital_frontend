
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue')
  }, {
    path: '/emisores',
    component: () => import('layouts/SedesLayout.vue')
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/dashboard', component: () => import('pages/Index.vue') },
      { path: '/usuarios', component: () => import('pages/Usuarios.vue') },
      { path: '/sedes', component: () => import('pages/Sedes.vue') },
      { path: '/simulador', component: () => import('pages/Simulador.vue') },
      { path: '/simulador2', component: () => import('pages/Simulador2.vue') },
      { path: '/reportes', component: () => import('pages/Reportes.vue') },
      { path: '/anulaciones', component: () => import('pages/Anulaciones.vue') },
      { path: '/auditorias', component: () => import('pages/Bitacoras.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
