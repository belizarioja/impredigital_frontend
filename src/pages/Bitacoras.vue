<template>
  <div class="q-pa-md">
    <div class="row">
      <span style="margin: 0 20px;font-size: 25px;font-weight: bolder;">Auditoría</span>
    </div>
    <div class="row">
      <q-select
          label="Buscar por Nombre o Usernamme del usuario"
          dense
          class="col-md-4 col-sm-6 col-xs-12"
          filled
          v-model="modelusuario"
          use-input
          hide-selected
          fill-input
          clearable
          options-dense
          option-label="nameuser"
          option-value="cod"
          input-debounce="0"
          :options="optionsusuarios"
          @update:model-value="listar()"
          @input:="listar()"
          @filter="searchUsuario"
          style="padding: 5px;"
        />
        <q-input
          dense
          filled
          label="Desde"
          mask="date"
          v-model="dateFrom"
          class="col-md-2 col-sm-6 col-xs-6"
          style="padding: 5px;">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dateFrom">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          dense
          filled
          label="Hasta"
          v-model="dateTo"
          class="col-md-2 col-sm-6 col-xs-6"
          style="padding: 5px;"
          mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="dateTo">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-select
          dense
          class="col-md-4 col-sm-6 col-xs-12"
          filled
          options-dense
          v-model="modelevento"
          :options="optionsevento"
          option-label="name"
          option-value="cod"
          label="Tipo de Evento"
          @update:model-value="listar()"
          style="padding: 5px;"
        />
    </div>
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
      filter: ref(''),
      co_rol: sessionStorage.getItem('co_rol'),
      dateFrom: ref(moment().format('YYYY-MM-DD')),
      dateTo: ref(moment().format('YYYY-MM-DD')),
      loading: ref(false),
      pagination: {
        page: 1,
        rowsPerPage: 20 // 0 means all rows
      }
    }
  },
  data () {
    return {
      columnsdetails: [
        { name: 'num', align: 'center', label: '#', field: 'num' },
        { name: 'fecha', align: 'center', label: 'Fecha', field: 'fecha' },
        { name: 'usuario', align: 'left', label: 'Usuario', field: 'usuario' },
        { name: 'evento', align: 'left', label: 'Evento', field: 'evento' },
        { name: 'observacion', align: 'left', label: 'Descripción', field: 'observacion' },
        { name: 'ip', align: 'center', label: 'IP', field: 'ip' },
        { name: 'idusuario', align: 'center', label: 'Id Usuario', field: 'idusuario' },
        { name: 'nombre', align: 'left', label: 'Nombre Usuario', field: 'nombre' }
      ],
      rowstodos: [],
      modelevento: [],
      optionsevento: [],
      modelusuario: [],
      optionsusuarios: []
    }
  },
  methods: {
    searchUsuario (val, update, abort) {
      /* if (val.length < 3) {
        abort()
        return
      } */
      update(() => {
        if (val === '') {
          this.optionsusuarios = this.usuarios
        } else {
          const needle = val.toLowerCase()
          this.optionsusuarios = this.usuarios.filter(v => v.nameuser.toLowerCase().indexOf(needle) > -1)
        }
      })
    },
    listarusuarios () {
      axios.get(ENDPOINT_PATH_V2 + 'usuario').then(async response => {
        const datos = response.data.resp
        this.optionsusuarios = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].nombre
          obj.usuario = datos[i].usuario
          obj.nameuser = datos[i].usuario + ' ' + datos[i].nombre
          this.optionsusuarios.push(obj)
          this.usuarios = this.optionsusuarios
        }
      }).catch(error => {
        Notify.create('Problemas al listar Usuarios ' + error)
      })
    },
    listareventos () {
      axios.get(ENDPOINT_PATH_V2 + 'bitacora/eventos').then(async response => {
        const datos = response.data.data
        this.optionsevento = []
        const obj = {}
        obj.cod = undefined
        obj.name = 'Todos'
        this.optionsevento.push(obj)
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].evento
          this.optionsevento.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Eventos ' + error)
      })
    },
    listar () {
      const desde = moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD')
      const hasta = moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD')
      const body = {
        idevento: this.modelevento?.cod,
        idusuario: this.modelusuario?.cod,
        desde: desde,
        hasta: hasta
      }
      axios.post(ENDPOINT_PATH_V2 + 'bitacora/listar', body).then(async response => {
        const datos = response.data.data
        console.log(datos)
        this.rowstodos = []
        let cont = 0
        for (const i in datos.reverse()) {
          const obj = {}
          cont = Number(cont) + Number(1)
          obj.num = cont
          obj.evento = datos[i].evento
          obj.idevento = datos[i].idevento
          obj.idusuario = datos[i].idusuario
          obj.usuario = datos[i].usuario
          obj.nombre = datos[i].nombre
          obj.ip = datos[i].ip
          obj.observacion = datos[i].observacion
          obj.fecha = moment(datos[i].fecha).format('DD/MM/YYYY HH:mm:ss')
          this.rowstodos.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Detalles bitacora ' + error)
      })
    }
  },
  watch: {
    dateFrom: function (val) {
      console.log(val)
      this.listar()
    },
    dateTo: function (val) {
      console.log(val)
      this.listar()
    }
  },
  mounted () {
    this.listar()
    this.listareventos()
    this.listarusuarios()
  }
}
</script>
