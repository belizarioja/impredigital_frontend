<template>
  <div class="q-pa-md">
    <div class="row">
      <span style="margin: 0 20px;font-size: 25px;font-weight: bolder;">Auditoría</span>
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
        { name: 'evento', align: 'center', label: 'Evento', field: 'evento' },
        { name: 'observacion', align: 'left', label: 'Descripción', field: 'observacion' },
        { name: 'ip', align: 'center', label: 'IP', field: 'ip' },
        { name: 'idusuario', align: 'center', label: 'Id Usuario', field: 'idusuario' },
        { name: 'nombre', align: 'center', label: 'Nombre Usuario', field: 'nombre' }
      ],
      rowstodos: [],
      modelsede: [],
      optionssede: []
    }
  },
  methods: {
    listar () {
      const body = {
        fecha: moment().format('YYYY-MM-DD')
      }
      axios.post(ENDPOINT_PATH_V2 + 'bitacora/listar', body).then(async response => {
        const datos = response.data.data
        console.log(datos)
        this.rowstodos = []
        for (const i in datos) {
          const obj = {}
          obj.num = Number(i) + 1
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
  mounted () {
    this.listar()
  }

}
</script>
