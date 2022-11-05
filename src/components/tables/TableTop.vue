<template>
  <q-card style=" width: 100%;">
    <q-card-section class="q-pa-none">
      <q-table
        title="Principales 5 Emisores"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="height: 400px;"
        :loading="loading"
        hide-pagination
      >
      <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="razonsocial" :props="props" style="display: grid;text-align: left;height: 51px;">
              <span style="font-weight: bolder; width: 120px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ props.row.razonsocial }}</span>
              <span style="font-style: italic;">RIF: {{ props.row.rif }}</span>
            </q-td>
            <q-td key="total" :props="props">
              {{ props.row.total }}
            </q-td>
            <q-td key="iva" :props="props">
              {{ props.row.totalg }}
            </q-td>
            <q-td key="reducido" :props="props">
              {{ props.row.totalr }}
            </q-td>
            <q-td key="igtf" :props="props">
              {{ props.row.totaligtf }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'

import config from '../../config/endpoints'
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default defineComponent({
  name: 'TableTop',
  props: ['idtipodochijo', 'dateFrom', 'dateTo', 'idserviciohijo'],

  data () {
    return {
      columns: [
        {
          name: 'razonsocial',
          label: 'Cliente emisor',
          align: 'left',
          field: row => row.razonsocial,
          format: val => `${val}`
        },
        { name: 'total', label: 'Cantidad de documentos' },
        { name: 'iva', label: 'IVA' },
        { name: 'reducido', label: 'Reducido' },
        { name: 'igtf', label: 'IGTF' }
      ],
      rows: []
    }
  },
  methods: {
    listarTop () {
      const body = {
        idtipodocumento: this.idtipodochijo || undefined,
        idserviciosmasivo: this.idserviciohijo || undefined,
        desde: moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD'),
        hasta: moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD')
      }
      axios.post(ENDPOINT_PATH_V2 + 'reporte/topclientes', body).then(async response => {
        console.log(response.data)
        const datos = response.data.data
        this.rows = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].idserviciosmasivo
          obj.razonsocial = datos[i].razonsocial
          obj.rif = datos[i].rif
          obj.total = datos[i].total

          obj.totalg = datos[i].totalg || 0
          obj.totalg = this.completarDecimales(obj.totalg)

          obj.totalr = datos[i].totalr || 0
          obj.totalr = this.completarDecimales(obj.totalr)

          obj.totaligtf = datos[i].totaligtf || 0
          obj.totaligtf = this.completarDecimales(obj.totaligtf)
          this.rows.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar top cliente ' + error)
      })
    },
    completarDecimales (cadena) {
      cadena = Intl.NumberFormat('de-DE').format(cadena.toFixed(2))
      const arreglo = cadena.split(',')

      cadena = arreglo.length === 1 ? cadena + ',00' : arreglo[1].length === 1 ? cadena + '0' : cadena
      return cadena
    },
    updateTop () {
      this.listarTop()
    }
  },
  watch: {
    idtipodochijo: function (val) {
      this.updateTop()
    },
    dateFrom: function (val) {
      this.updateTop()
    },
    idserviciohijo: function (val) {
      this.updateTop()
    }
  },
  mounted () {
    this.updateTop()
    setInterval(() => {
      this.updateTop()
    }, 14000)
  }
})
</script>

<style scoped>

</style>
