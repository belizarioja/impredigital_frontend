<template>
  <div class="q-pa-md">
    <q-table
      title="Usuarios"
      dense
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <template v-slot:top>
        <q-btn v-if="co_rol === '1' || co_rol === '2'" color="primary" :disable="loading" label="Crear usuario" @click="modalcrear = true" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <q-dialog v-model="modalcrear" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Crear usuario</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="nombre"
            label="Nombre"
            autofocus
            :rules="[ val => val.length > 0 || 'Ingresar NOMBRE DE USUARIO' ]"
          />
          <q-input
            dense
            v-model="usuario"
            label="Usuario"
            autofocus
            :rules="[ val => val.length > 0 || 'Ingresar DESCRIPCION DE USUARIO' ]"
          />
          <q-input
            dense
            v-model="clave"
            label="Clave"
            autofocus
            :rules="[ val => val.length > 0 || 'Ingresar CLAVE DE USUARIO' ]"
          />
          <q-select
            dense
            class="col"
            filled
            options-dense
            v-model="modelrol"
            :options="optionsrol"
            option-label="name"
            option-value="cod"
            label="Rol de usuario"
            style="margin: 10px;" />
          <q-select
            dense
            class="col"
            filled
            options-dense
            v-model="modelsede"
            :options="optionssede"
            option-label="name"
            option-value="cod"
            label="Cliente emisor"
            style="margin: 10px;" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Aceptar" @click="crearusuario"/>
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
      usuario: ref(''),
      clave: ref(''),
      nombre: ref(''),
      filter: ref(''),
      loading: ref(false),
      co_rol: sessionStorage.getItem('co_rol'),
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      }
    }
  },
  data () {
    return {
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'usuario', align: 'center', label: 'Usuario', field: 'usuario', sortable: true },
        { name: 'clave', align: 'center', label: 'Clave', field: 'clave', sortable: true },
        { name: 'rol', label: 'Rol', field: 'rol', sortable: true },
        { name: 'feultacceso', label: 'Último acceso', field: 'feultacceso', sortable: true },
        { name: 'estatus', label: 'Estatus', field: 'estatus' }
      ],
      rows: [],
      modelrol: [],
      optionsrol: [],
      modelsede: [],
      optionssede: []
    }
  },
  methods: {
    updateEstatus (cousuario, estatus) {
      console.log(cousuario, estatus)
      const activa = estatus === 'Activa' ? 0 : 1
      const data = {
        in_activa: activa
      }
      console.log(data)
      axios.put(ENDPOINT_PATH_V2 + 'usuario/' + cousuario, data).then(async response => {
        console.log(response.data)
        this.listarusuarios()
      })
    },
    crearusuario () {
      this.modalcrear = false
      console.log(this.usuario)
      console.log(this.modelrol)
      const data = {
        usuario: this.usuario,
        clave: this.clave,
        nombre: this.nombre,
        estatus: 1,
        idrol: Number(this.modelrol.cod),
        idserviciosmasivo: Number(this.modelsede?.cod) || null
      }
      axios.post(ENDPOINT_PATH_V2 + 'usuario', data).then(async response => {
        console.log(response.data)
        this.usuario = ''
        this.clave = ''
        this.nombre = ''
        this.modelrol = []
        this.modelsede = []
        this.listarusuarios()
      })
    },
    listarusuarios () {
      axios.get(ENDPOINT_PATH_V2 + 'usuario').then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.name = datos[i].nombre
          obj.usuario = datos[i].usuario
          obj.clave = datos[i].clave
          obj.rol = datos[i].rol
          obj.feultacceso = datos[i].feultacceso
          obj.estatus = datos[i].estatus === '1' ? 'Activo' : 'Inactivo'
          this.rows.push(obj)
        }
        console.log(this.rows)
      }).catch(error => {
        Notify.create('Problemas al listar Usuarios ' + error)
      })
    },
    listarroles () {
      axios.get(ENDPOINT_PATH_V2 + 'usuario/roles').then(async response => {
        console.log(response.data)
        const datos = response.data.resp
        this.optionsrol = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].rol
          this.optionsrol.push(obj)
        }
        console.log(this.optionsrol)
      }).catch(error => {
        Notify.create('Problemas al listar Roles ' + error)
      })
    },
    listarsedes () {
      axios.get(ENDPOINT_PATH_V2 + 'sede').then(async response => {
        console.log(response.data)
        const datos = response.data.data
        this.optionssede = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].razonsocial
          this.optionssede.push(obj)
        }
        console.log(this.optionssede)
      }).catch(error => {
        Notify.create('Problemas al listar Sedes ' + error)
      })
    }
  },
  mounted () {
    this.listarusuarios()
    this.listarroles()
    this.listarsedes()
  }

}
</script>
