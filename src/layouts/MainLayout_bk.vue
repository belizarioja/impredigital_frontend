<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title style="display: grid;">
          <span v-if="tx_sede" style="font-size: 16px;">{{tx_sede}}</span>
          <span style="font-size: 14px;">Bienvenido {{tx_nombre}} - {{tx_rol}}</span>
        </q-toolbar-title>

        <div style="display: flex;justify-content: center;align-items: center;">
          <q-btn
            v-if="co_rol === '1' || co_rol === '2'"
            color="info"
            icon="add_business"
            :label="co_sede_seleted ? 'Cambiar de Emisor' : 'Seleccionar Emisor'"
            @click="sedeschange" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
          style="display: grid;justify-content: center;align-items: center;background: #1976d2;"
        >
          <img v-if="co_rol === '3'" :src="logo_sede" onerror="this.src='logo_impredigital.jpg'" width="200" />
          <img v-if="co_rol === '1'" src="logo_impredigital.jpg" width="200" />
          <img v-if="co_rol === '2'" src="logo_seniat.png" width="200" />
        </q-item-label>

        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
        <q-item clickable v-ripple @click="listado">
          <q-item-section avatar>
            <q-icon color="black" name="dashboard" />
          </q-item-section>
          <q-item-section>
            <div>Indicadores principales</div>
            <div style="font-size: x-small;">Estadisticas, reportes.</div>
          </q-item-section>
        </q-item>
        <q-item v-if="co_rol === '1' || co_rol === '2'" clickable v-ripple @click="usuarios">
          <q-item-section avatar>
            <q-icon color="black" name="manage_accounts" />
          </q-item-section>
          <q-item-section>
            <div>Usuarios</div>
            <div style="font-size: x-small;">Gestión de usuarios del sistema</div>
          </q-item-section>
        </q-item>
        <q-item v-if="co_rol === '1' || co_rol === '2'" clickable v-ripple @click="sedes">
          <q-item-section avatar>
            <q-icon color="black" name="store" />
          </q-item-section>
          <q-item-section>
            <div>Cliente emisor</div>
            <div style="font-size: x-small;">Negocio, sucursal, contribuyentes</div>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="reportes">
          <q-item-section avatar>
            <q-icon color="black" name="summarize" />
          </q-item-section>
          <q-item-section>
            <div>Reportes</div>
            <div style="font-size: x-small;">Reportes, exportar</div>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="anulaciones">
          <q-item-section avatar>
            <q-icon color="black" name="bookmark_remove" />
          </q-item-section>
          <q-item-section>
            <div>Anulaciones</div>
            <div style="font-size: x-small;">Anulaciones, correcciones</div>
          </q-item-section>
        </q-item>
         <q-item v-if="co_rol === '1'" clickable v-ripple @click="simulador">
          <q-item-section avatar>
            <q-icon color="black" name="print" />
          </q-item-section>
          <q-item-section>
            <div>Simulador Facturación</div>
            <div style="font-size: x-small;">Facturas, notas de entrega, etc.</div>
          </q-item-section>
        </q-item>
         <q-item v-if="co_rol === '1'" clickable v-ripple @click="simulador2">
          <q-item-section avatar>
            <q-icon color="black" name="print" />
          </q-item-section>
          <q-item-section>
            <div>Simulador Anulación</div>
            <div style="font-size: x-small;">Simular anulaciones.</div>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="salir">
          <q-item-section avatar>
            <q-icon color="black" name="logout" />
          </q-item-section>
          <q-item-section>
            <div>Salir</div>
            <div style="font-size: x-small;">Cerrar sesión</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default defineComponent({
  name: 'MainLayout',
  data () {
    return {
      co_sede_seleted: sessionStorage.getItem('co_sede_seleted'),
      logo_sede: ENDPOINT_PATH_V2 + 'imagen/' + sessionStorage.getItem('rif_sede') + '.png',
      tx_usuario: sessionStorage.getItem('rol_name'),
      tx_nombre: sessionStorage.getItem('tx_nombre'),
      co_rol: sessionStorage.getItem('co_rol'),
      tx_rol: sessionStorage.getItem('tx_rol'),
      tx_sede: sessionStorage.getItem('tx_sede')
    }
  },
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  methods: {
    listado () {
      this.$router.push('/dashboard')
    },
    sedes () {
      this.$router.push('/sedes')
    },
    sedeschange () {
      sessionStorage.removeItem('co_sede_seleted')
      sessionStorage.removeItem('tx_sede_seleted')
      sessionStorage.removeItem('rif_sede_seleted')
      this.$router.push('/emisores')
    },
    reportes () {
      this.$router.push('/reportes')
    },
    anulaciones () {
      this.$router.push('/anulaciones')
    },
    simulador () {
      this.$router.push('/simulador')
    },
    simulador2 () {
      this.$router.push('/simulador2')
    },
    usuarios () {
      this.$router.push('/usuarios')
    },
    salir () {
      this.$q.dialog({
        title: 'Confirmación!',
        message: '¿Está seguro que quieres cerrar sesión?',
        ok: {
          color: 'primary',
          label: 'Sí'
        },
        cancel: {
          color: 'secondary',
          label: 'No'
        },
        persistent: true
      }).onOk(() => {
        sessionStorage.removeItem('co_sede_seleted')
        sessionStorage.removeItem('tx_sede_seleted')
        sessionStorage.removeItem('rif_sede_seleted')
        sessionStorage.removeItem('tx_rol')
        sessionStorage.removeItem('tx_nombre')
        sessionStorage.removeItem('tx_sede')
        sessionStorage.removeItem('co_sede')
        sessionStorage.removeItem('co_rol')
        this.$router.push('/')
      })
    }
  }
})
</script>
