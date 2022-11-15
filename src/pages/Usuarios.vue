<template>
  <div class="q-pa-md">
    <div class="row">
      <span style="margin: 0 20px;font-size: 25px;font-weight: bolder;">Usuarios</span>
    </div>
    <q-table
      dense
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination="pagination"
    >
      <template v-slot:top>
        <q-btn v-if="co_rol === '1'" color="primary" :disable="loading" label="Crear usuario" @click="modalcrear = true" />
        <q-space />
        <q-input borderless dense debounce="300" color="primary" v-model="filter">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body-cell-bitacora="props">
        <q-td :props="props">
          <div>
            <q-btn icon="list_alt" @click.stop="btnviewdetails(props.row)" dense flat/>
          </div>
        </q-td>
      </template>
    </q-table>
    <q-table
        dense
        :rows="rowstodos"
        title="Bitácora"
        :columns="columnsdetails"
        row-key="num"
        :pagination="pagination"
        style="width: 100%; margin-top: 40px;"
      >
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
    <q-dialog v-model="viewdetails" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Bitácoras</span>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-table
            dense
            :rows="rowsdetails"
            :columns="columnsdetails"
            row-key="num"
            hide-pagination
            style="width: 100%;"
          >
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
import moment from 'moment'
// import M from 'minimatch'

const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default {
  setup () {
    return {
      modalcrear: ref(false),
      viewdetails: ref(false),
      usuario: ref(''),
      clave: ref(''),
      nombre: ref(''),
      filter: ref(''),
      loading: ref(false),
      co_rol: sessionStorage.getItem('co_rol'),
      pagination: {
        page: 1,
        rowsPerPage: 10 // 0 means all rows
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
        { name: 'razonsocial', align: 'center', label: 'Razon Social', field: 'razonsocial', sortable: true },
        { name: 'usuario', align: 'center', label: 'Usuario', field: 'usuario', sortable: true },
        { name: 'clave', align: 'center', label: 'Clave', field: 'clave', sortable: true },
        { name: 'rol', label: 'Rol', field: 'rol', sortable: true },
        { name: 'bitacora', label: 'Bitácora' },
        { name: 'estatus', label: 'Estatus', field: 'estatus' }
      ],
      rows: [],
      columnsdetails: [
        { name: 'num', align: 'center', label: '#', field: 'num' },
        { name: 'fecha', align: 'center', label: 'Fecha', field: 'fecha' },
        {
          name: 'accion',
          required: true,
          label: 'Acción',
          align: 'left',
          field: row => row.accion,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'observacion', align: 'left', label: 'Observación', field: 'observacion' },
        { name: 'ip', align: 'center', label: 'IP', field: 'ip' },
        { name: 'idusuario', align: 'center', label: 'Id Usuario', field: 'idusuario' },
        { name: 'nombre', align: 'center', label: 'Nombre Usuario', field: 'nombre' }
      ],
      rowsdetails: [],
      rowstodos: [],
      modelrol: [],
      optionsrol: [],
      modelsede: [],
      optionssede: []
    }
  },
  methods: {
    btnviewdetails (row) {
      const body = {
        idusuario: row.id || undefined
      }
      axios.post(ENDPOINT_PATH_V2 + 'bitacora/listar', body).then(async response => {
        const datos = response.data.data
        console.log(datos)
        this.rowsdetails = []
        for (const i in datos) {
          const obj = {}
          obj.num = Number(i) + 1
          obj.accion = datos[i].accion
          obj.idusuario = datos[i].idusuario
          obj.usuario = datos[i].usuario
          obj.nombre = datos[i].nombre
          obj.ip = datos[i].ip
          obj.observacion = datos[i].observacion
          obj.fecha = moment(datos[i].fecha).format('DD/MM/YYYY HH:mm:ss')
          this.rowsdetails.push(obj)
        }
        console.log(this.rowsdetails)
        console.log(row.id)
        if (row.id) {
          this.viewdetails = true
        } else {
          this.rowstodos = this.rowsdetails
        }
        console.log(this.rowstodos)
      }).catch(error => {
        Notify.create('Problemas al listar Detalles bitacora ' + error)
      })
    },
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
        const datos = response.data.resp
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.id = datos[i].id
          obj.name = datos[i].nombre
          obj.razonsocial = datos[i].razonsocial
          obj.usuario = datos[i].usuario
          obj.clave = datos[i].clave
          obj.rol = datos[i].rol
          obj.feultacceso = datos[i].feultacceso
          obj.estatus = datos[i].estatus === '1' ? 'Activo' : 'Inactivo'
          this.rows.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Usuarios ' + error)
      })
    },
    listarroles () {
      axios.get(ENDPOINT_PATH_V2 + 'usuario/roles').then(async response => {
        const datos = response.data.resp
        this.optionsrol = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].rol
          this.optionsrol.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Roles ' + error)
      })
    },
    listarsedes () {
      axios.get(ENDPOINT_PATH_V2 + 'sede').then(async response => {
        const datos = response.data.data
        this.optionssede = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].razonsocial
          this.optionssede.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Sedes ' + error)
      })
    }
  },
  mounted () {
    this.listarusuarios()
    this.listarroles()
    this.listarsedes()
    this.btnviewdetails({})
  }

}
</script>
