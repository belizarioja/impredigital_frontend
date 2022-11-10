<template>
  <div class="q-pa-md">
    <div class="text-h6">Cliente Emisor</div>
    <q-table
      title="Secciones"
      dense
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:top>
        <q-btn
         v-if="co_rol === '1'"
         color="primary"
         :disabled="btndisable"
         label="Crear emisor"
         @click="modalcrear = true" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-tokenservicios="props">
        <q-td :props="props">
          <div>
            <q-btn icon="visibility" @click.stop="btnviewtoken(props.row)" dense flat/>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-numeracionactual="props">
        <q-td :props="props">
          <div>
            <q-btn icon="list_alt" @click.stop="btnviewdetails(props.row)" dense flat/>
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="modalcrear" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Cliente Emisor</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="crear" class="q-gutter-md">
            <q-input
              dense
              label="Ingrese RIF"
              v-model="rif"
              autofocus
              :rules="[ val => val.length > 0 || 'Ingresar RIF' ]"
            />
            <q-input
              dense
              label="Ingrese Razón Social"
              v-model="razonsocial"
              autofocus
              :rules="[ val => val.length > 0 || 'Ingresar RAZON SOCIAL' ]"
            />
            <q-input
              dense
              label="Ingrese Dirección"
              v-model="direccion"
              :rules="[ val => val.length > 0 || 'Ingresar DIRECCIÓN' ]"
            />
            <q-input
              dense
              v-model="email"
              label="Ingrese Email"
              :rules="[ val => val.length > 0 || 'Ingresar EMAIL' ]"
            />
            <q-input
              dense
              v-model="telefono"
              label="Ingrese Teléfono de contacto"
              :rules="[ val => val.length > 0 || 'Ingresar TELÉFONO' ]"
            />
            <div>
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
              label="Aceptar"
              type="submit"
              />
            </div>
           </q-form>
          </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="viewtoken" persistent>
      <q-card style="width: auto;">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Token del Cliente Emisor {{ razonsocialtitulo + ' - ' + riftitulo}}</span>
        </q-card-section>
        <q-card-section class="row items-center" style="word-break: break-all;">
          <div style="">
            {{ tokenservicios }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Aceptar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="viewdetails" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Numeración actual de {{ razonsocialtitulo + ' - ' + riftitulo }}</span>
        </q-card-section>
        <q-card-section class="row items-center" style="word-break: break-all;justify-content: center;">
          <q-table
            dense
            :rows="rowsdetails"
            :columns="columnsdetails"
            row-key="name"
            hide-pagination
          >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-italic text-blue"
                style="font-size: 20px"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
        </q-table>

        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Aceptar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default {
  setup () {
    return {
      modalcrear: ref(false),
      viewtoken: ref(false),
      viewdetails: ref(false),
      tokenservicios: ref(''),
      rif: ref(''),
      razonsocial: ref(''),
      riftitulo: ref(''),
      razonsocialtitulo: ref(''),
      email: ref(''),
      direccion: ref(''),
      telefono: ref(''),
      filter: ref(''),
      co_rol: sessionStorage.getItem('co_rol'),
      loading: ref(false)
    }
  },
  data () {
    return {
      columns: [
        {
          name: 'cod',
          required: true,
          label: '#',
          align: 'left',
          field: row => row.cod,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'rif', align: 'center', label: 'RIF', field: 'rif', sortable: true },
        { name: 'razonsocial', align: 'center', label: 'Razón social', field: 'razonsocial', sortable: true },
        { name: 'direccion', label: 'Dirección', field: 'direccion', sortable: true },
        { name: 'email', label: 'Correo electrónico', field: 'email', sortable: true },
        { name: 'telefono', label: 'Teléfono contacto', field: 'telefono', sortable: true },
        { name: 'tokenservicios', label: 'Token', field: 'tokenservicios', sortable: true },
        { name: 'numeracionactual', label: 'Numeración actual', field: 'numeracionactual', sortable: true },
        { name: 'estatus', label: 'Estatus', field: 'estatus' }
      ],
      rows: [],
      columnsdetails: [
        /* {
          name: 'name',
          required: true,
          label: 'Documento',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        }, */
        { name: 'identificador', align: 'center', label: 'Identificador', field: 'identificador', style: 'font-size:20px' },
        { name: 'corelativo', align: 'center', label: 'Correlativo', field: 'corelativo', style: 'font-size:20px' }
      ],
      rowsdetails: [],
      btndisable: true
    }
  },
  methods: {
    btnviewtoken (row) {
      this.razonsocialtitulo = row.razonsocial
      this.riftitulo = row.rif
      this.tokenservicios = row.tokenservicios
      this.viewtoken = true
    },
    btnviewdetails (row) {
      this.razonsocialtitulo = row.razonsocial
      this.riftitulo = row.rif
      axios.get(ENDPOINT_PATH_V2 + 'sede/' + row.cod).then(async response => {
        console.log(response.data)
        const datos = response.data.data
        this.rowsdetails = []
        for (const i in datos) {
          const obj = {}
          // obj.name = datos[i].tipodocumento
          obj.identificador = datos[i].identificador.toString().padStart(2, '0')
          obj.corelativo = datos[i].corelativo.toString().padStart(8, '0')
          this.rowsdetails.push(obj)
        }
        console.log(this.rowsdetails)
      }).catch(error => {
        Notify.create('Problemas al listar Detalles corelativo ' + error)
      })
      this.viewdetails = true
    },
    limpiar () {
      this.rif = ''
      this.razonsocial = ''
      this.direccion = ''
      this.email = ''
      this.telefono = ''
    },
    crear () {
      if (this.rif.length === 0) {
        return
      }
      if (this.razonsocial.length === 0) {
        return
      }
      if (this.direccion.length === 0) {
        return
      }
      if (this.email.length === 0) {
        return
      }
      if (this.telefono.length === 0) {
        return
      }
      const data = {
        rif: this.rif,
        razonsocial: this.razonsocial,
        direccion: this.direccion,
        email: this.email,
        telefono: this.telefono
      }
      axios.post(ENDPOINT_PATH_V2 + 'sede', data).then(async response => {
        this.modalcrear = false
        console.log(response.data)
        this.limpiar()
        this.listar()
      })
    },
    listar () {
      this.btndisable = false
      axios.get(ENDPOINT_PATH_V2 + 'sede').then(async response => {
        console.log(response.data)
        const datos = response.data.data
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.rif = datos[i].rif
          obj.razonsocial = datos[i].razonsocial
          obj.direccion = datos[i].direccion
          obj.email = datos[i].email
          obj.telefono = datos[i].telefono
          obj.tokenservicios = datos[i].tokenservicios
          obj.estatus = datos[i].estatus === '1' ? 'Activo' : 'Inactivo'
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Sedes ' + error)
      })
    }
  },
  mounted () {
    this.listar()
  }
}
</script>
