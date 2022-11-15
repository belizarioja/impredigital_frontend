<template>
  <div class="bg-primary window-height window-width row justify-center">
    <div class="column">
      <div class="justify-center" style="margin: 20px 0 0 0;display: grid;">
        <img src="logo_impredigital.jpg" style="max-width: 180px;" />
      </div>
      <div class="row justify-center">
        <h5 class="text-h5 text-white q-my-md">Inicie sesión</h5>
      </div>
      <div class="row justify-center">
        <form @submit.prevent="submit" class="row justify-center">
          <q-card bordered class="q-pa-lg shadow-1" style="max-width: 335px;border-radius: 10px;">
            <q-card-section>
              <q-form class="q-gutter-md">
                <q-input square filled clearable v-model="usuario" type="text" label="Usuario" />
                <q-input square filled clearable v-model="clave" type="password" label="Clave" />
              </q-form>
            </q-card-section>
            <q-card-actions class="q-px-md">
              <q-btn unelevated color="primary" type="submit"  :loading="loading"  size="lg" class="full-width" label="Ingresar" >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </q-card-actions>
            <!-- <q-card-section class="text-center q-pa-none">
              <p class="text-grey-6">¿Olvidó contraseña?</p>
            </q-card-section> -->
          </q-card>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'

const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default {
  name: 'LoginLayout',
  data () {
    return {
      term: '',
      usuario: '',
      clave: '',
      loading: false
    }
  },
  methods: {
    submit () {
      fetch('https://api.ipify.org?format=json').then(x => x.json()).then(({ ip }) => {
        this.term = ip
        // console.log(this.term)
        if (this.usuario === '') {
          Notify.create('El Usuario es requerido para iniciar sesión')
        } else if (this.clave === '') {
          Notify.create('La contraseña es requerida para iniciar sesión')
        } else {
          this.loading = true
          axios.post(ENDPOINT_PATH_V2 + 'usuario/login', {
            usuario: this.usuario,
            clave: this.clave
          }).then(async response => {
            axios.post(ENDPOINT_PATH_V2 + 'bitacora', {
              idusuario: response.data.resp.id,
              accion: 'ACCESO',
              ip: this.term,
              observacion: 'Acceso al sistema con éxito',
              fecha: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            this.loading = false
            console.log(response)
            console.log(response.data)
            if (response.status === 200) {
              sessionStorage.setItem('id_usuario', response.data.resp.id)
              sessionStorage.setItem('rif_sede', response.data.resp.rif)
              sessionStorage.setItem('co_rol', response.data.resp.idrol)
              sessionStorage.setItem('tx_nombre', response.data.resp.nombre)
              sessionStorage.setItem('tx_rol', response.data.resp.rol)
              sessionStorage.setItem('co_sede', response.data.resp.idserviciosmasivo || 0)
              sessionStorage.setItem('tx_sede', response.data.resp.razonsocial || '')
              if (response.data.resp.idrol === '3') {
                this.$router.push('/dashboard')
              } else {
                // this.$router.push('/dashboard')
                this.$router.push('/emisores')
              }
            } else {
              this.loading = false
              Notify.create('Usuario no encontrado o contraseña incorrecta')
            }
          }).catch(error => {
            this.loading = false
            Notify.create('Error ' + error)
          })
        }
      })
    }
  }
}
</script>

<style>
.q-card {
  width: 360px;
}
</style>
