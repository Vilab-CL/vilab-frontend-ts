<template>
  <q-layout view='lHh Lpr lFf'>
    <q-header elevated>
      <q-toolbar class='bg-white'>
        <q-btn
          flat
          dense
          round
          icon='fas fa-bars'
          aria-label='Menu'
          @click='toggleLeftDrawer'
          color='secondary'
        />

        <q-toolbar-title class='text-center'>
          <q-img src='https://www.vilab.cl/wp-content/uploads/2021/07/Logo-Vilab-1-transparent-e1627227582118.png'
                 height='50px' width='80px'></q-img>
        </q-toolbar-title>
        <ChangeLanguage />
        <UserMenu v-model:tabs='userTabs' title='Usuario' />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model='leftDrawerOpen'
      bordered
      class='bg-accent'
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for='link in essentialLinks'
          :key='link.title'
          v-bind='link'
        />
      </q-list>
    </q-drawer>

    <q-page-container class='bg-grey-2'>
      <q-card class='q-ma-md' style='max-height: 100%;max-width: 100%'>
        <router-view />
      </q-card>
    </q-page-container>
    <q-footer  reveal class='bg-white text-black'>
      Copyright 2021 © Vilab. Todos los Derechos Reservados.
    </q-footer>
  </q-layout>
</template>

<script lang='ts'>
import EssentialLink from 'components/EssentialLink.vue';
import { defineComponent, ref } from 'vue';
import UserMenu from 'components/menu/UserMenu.vue';
import ChangeLanguage from 'components/language/ChangeLanguage.vue';

const linksList = [
  {
    title: 'Inicio',
    caption: 'Página principal',
    icon: 'fas fa-home',
    link: 'home'
  },
  {
    title: 'Proyectos',
    caption: 'Ingreso a la pagina principal de proyectos',
    icon: 'fas fa-map',
    link: 'plot.index'
  },
  {
    title: 'Roles',
    caption: 'Manejar los roles del sistema',
    icon: 'fas fa-map',
    link: 'role.index'
  }
];

const userTabs = [
  { title: 'Mi perfil', routeName: 'plot.index' },
  { title: 'Cerrar', routeName: 'gawdadwa' }
];

export default defineComponent({
  name: 'MainLayout',

  components: {
    ChangeLanguage,
    UserMenu,
    EssentialLink
  },

  setup() {
    const leftDrawerOpen = ref(false);
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      userTabs
    };
  }
});
</script>
