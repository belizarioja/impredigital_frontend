<template>
   <q-layout view="hHh Lpr lff" container style="min-height: 100vh;" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        />

        <q-toolbar-title style="display: grid;">
          <span v-if="tx_sede" style="font-size: 16px;">{{tx_sede}}</span>
          <span style="font-size: 14px;">Bienvenido {{tx_nombre}} - {{tx_rol}}</span>
        </q-toolbar-title>

        <div style="display: flex;justify-content: center;align-items: center;">
          <span v-if="co_sede_seleted && co_rol === '4'" style="font-size: 16px; margin-right: 20px;">{{tx_sede_seleted}}</span>
          <q-btn
            v-if="co_rol === '1' || co_rol === '2' || co_rol === '4'"
            color="info"
            icon="add_business"
            :label="co_sede_seleted ? 'Cambiar de Emisor' : 'Seleccionar Emisor'"
            @click="sedeschange" />
        </div>
      </q-toolbar>
    </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"

        :width="230"
        :breakpoint="500"
        bordered
        class="bg-grey-3"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <!-- <EssentialLink
              v-for="link in essentialLinks"
              :key="link.title"
              v-bind="link"
            /> -->
            <q-item v-if="co_rol !== '4'" clickable v-ripple @click="listado" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="dashboard" />
              </q-item-section>
              <q-item-section>
                <div>Indicadores principales</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="consulta" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="summarize" />
              </q-item-section>
              <q-item-section>
                <div>Consulta</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="anulaciones" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="bookmark_remove" />
              </q-item-section>
              <q-item-section>
                <div>Anulaciones</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="reportes" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="summarize" />
              </q-item-section>
              <q-item-section>
                <div>Reportes</div>
              </q-item-section>
            </q-item>
            <q-item v-if="co_rol === '1' || co_rol === '2'" clickable v-ripple @click="sedes" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="store" />
              </q-item-section>
              <q-item-section>
                <div>Cliente emisor</div>
              </q-item-section>
            </q-item>
            <q-item v-if="co_rol === '1' || co_rol === '2'" clickable v-ripple @click="usuarios" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="manage_accounts" />
              </q-item-section>
              <q-item-section>
                <div>Usuarios</div>
              </q-item-section>
            </q-item>
            <q-item v-if="co_rol === '1' || co_rol === '2'" clickable v-ripple @click="auditorias" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="policy" />
              </q-item-section>
              <q-item-section>
                <div>Auditoría</div>
              </q-item-section>
            </q-item>
            <q-item v-if="co_rol === '1'" clickable v-ripple @click="simulador" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="print" />
              </q-item-section>
              <q-item-section>
                <div>Simulador Facturación</div>
              </q-item-section>
            </q-item>
            <q-item v-if="co_rol === '1'" clickable v-ripple @click="simulador2" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="print" />
              </q-item-section>
              <q-item-section>
                <div>Simulador Anulación</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="salir" style="font-size: 12px;">
              <q-item-section avatar>
                <q-icon color="black" name="logout" />
              </q-item-section>
              <q-item-section>
                <div>Salir</div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar>
              </q-item-section>
              <q-item-section>
                <img v-if="co_rol === '3'" :src="logo_sede" onerror="this.src='logo_impredigital.png'" width="110" />
                <img v-if="co_rol === '1'" src="logo_impredigital.png" width="110" />
                <img v-if="co_rol === '2' || co_rol === '4'" src="logo_seniat.png" width="110" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
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
  setup () {
    return {
      drawer: ref(false),
      miniState: ref(true)
    }
  },
  data () {
    return {
      co_sede_seleted: sessionStorage.getItem('co_sede_seleted'),
      tx_sede_seleted: sessionStorage.getItem('tx_sede_seleted'),
      logo_sede: ENDPOINT_PATH_V2 + 'imagen/' + sessionStorage.getItem('rif_sede') + '.png',
      tx_usuario: sessionStorage.getItem('rol_name'),
      tx_nombre: sessionStorage.getItem('tx_nombre'),
      co_rol: sessionStorage.getItem('co_rol'),
      tx_rol: sessionStorage.getItem('tx_rol'),
      tx_sede: sessionStorage.getItem('tx_sede')
    }
  },
  methods: {
    listado () {
      this.$router.push('/dashboard')
    },
    sedes () {
      this.$router.push('/sedes')
    },
    auditorias () {
      this.$router.push('/auditorias')
    },
    sedeschange () {
      sessionStorage.removeItem('co_sede_seleted')
      sessionStorage.removeItem('tx_sede_seleted')
      sessionStorage.removeItem('rif_sede_seleted')
      this.$router.push('/emisores')
    },
    consulta () {
      this.$router.push('/consulta')
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
