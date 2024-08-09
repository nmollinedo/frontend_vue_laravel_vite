import { createRouter, createWebHistory } from 'vue-router'

import Inicio from "./../views/web/Inicio.vue"
import Servicio from "./../views/web/Servicios.vue"
import Login from "./../views/auth/Login.vue"
import Perfil from '../views/admin/perfil/Perfil.vue'
import Usuario from '../views/admin/usuario/Usuario.vue'
import NotFound from '../views/errors/NotFound.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '', component: Inicio },
        { path: '/servicios', component: Servicio },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/admin/perfil',
            component: Perfil
        },
        {
            path: '/admin/usuario',
            component: Usuario
        },
        {
            path: '/:pathMatch(.*)*',
            component: NotFound
        }
        
    ]
})

export default router;