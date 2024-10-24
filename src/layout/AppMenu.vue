<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Administrador',
        items: [
            { label: 'Panel', icon: 'pi pi-fw pi-home', to: '/admin' },
          /*  { label: 'Mi Perfil', icon: 'pi pi-fw pi-user', to: '/admin/perfil' } */
        ]
    },
 /*   {
        label: 'Gestión Usuarios',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', to: '/admin/usuario' },
            { label: 'Personas', icon: 'pi pi-fw pi-check-square', to: '/admin/persona' },
            
        ]
    },*/
    {
        label: 'Proyectos',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            {
                label: 'Registro de proyectos',
                icon: 'pi pi-fw pi-globe',
                to: '/admin/transferencia'
            },
            {
                label: 'Formularios',
                icon: 'pi pi-fw pi-file-edit',
                to: '/admin/formulario'
            },
            {
                label: 'Plan Programa',
                icon: 'pi pi-fw pi-file-edit',
                to: '/admin/plan'
            }
        ]
    },
    {
        label: 'Presupuesto',
        items: [
            { label: 'Recursos', icon: 'pi pi-fw pi-id-card', to: '/admin/recurso' },
        //    { label: 'Programacion', icon: 'pi pi-fw pi-check-square', to: '/admin/programacion' },
            
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
