<template>
  <q-card class="bg-transparent no-shadow no-border" style="margin: 0 15px;width: auto;">
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm ">
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #6DC72A;" class="q-pa-none">
            <q-item-section side style="background: #569e20;" class=" q-pa-lg q-mr-none text-white">
              <q-icon name="receipt_long" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totaldoc}} {{ tipodochijo !== 'Todos' ? tipodochijo : '' }}</q-item-label>
              <q-item-label>Documentos procesados</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #036fab;" class="q-pa-none">
            <q-item-section side style="background: #00507D;" class=" q-pa-lg q-mr-none text-white">
              <span style="font-size: 19px;font-weight: bolder;">Bs</span>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totalbase}}</q-item-label>
              <q-item-label>Total base imponible</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #00C7DC;" class="q-pa-none">
            <q-item-section side style="background: #00a3b4;" class=" q-pa-lg q-mr-none text-white">
              <span style="font-size: 19px;font-weight: bolder;">Bs</span>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totalimp}}</q-item-label>
              <q-item-label>Total impuesto</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #76a9d1;" class="q-pa-none">
            <q-item-section side style="background: #277dc1;" class=" q-pa-lg q-mr-none text-white">
              <span style="font-size: 19px;font-weight: bolder;">Bs</span>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totalimpg}}</q-item-label>
              <q-item-label>Total IVA 16%</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #659cef;" class="q-pa-none">
            <q-item-section side style="background: #3c64a0;" class=" q-pa-lg q-mr-none text-white">
              <span style="font-size: 19px;font-weight: bolder;">Bs</span>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totalimpigtf}}</q-item-label>
              <q-item-label>Total IGTF 3%</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div v-if="co_rol === '1' || co_rol === '2'" class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #85a1a7;" class="q-pa-none">
            <q-item-section side style="background: #5c7074;" class=" q-pa-lg q-mr-none text-white">
              <span style="font-size: 19px;font-weight: bolder;">Bs</span>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totalimpr}}</q-item-label>
              <q-item-label>Total Reducido 8%</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <!-- <div v-if="co_rol === '1' || co_rol === '2'" class="col-md-4 col-sm-6 col-xs-12">
          <q-item style="background: #85a1a7;" class="q-pa-none">
            <q-item-section side style="background: #5c7074;" class=" q-pa-lg q-mr-none text-white">
              <q-icon name="store" color="white" size="24px"></q-icon>
                </q-item-section>
             <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label class="text-white text-h6 text-weight-bolder">{{totalclientes}}</q-item-label>
              <q-item-label>Total Cliente Emisor</q-item-label>
            </q-item-section>
          </q-item>
        </div> -->
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'
import config from '../../config/endpoints'
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default defineComponent({
  name: 'CardSocial',
  props: ['idtipodochijo', 'tipodochijo', 'dateFrom', 'dateTo', 'idserviciohijo'],
  setup () {
    return {
      totaldoc: ref(0),
      totalbase: ref(0),
      totalimp: ref(0),
      totalimpg: ref(0),
      totalimpr: ref(0),
      totalclientes: ref(0),
      totalimpigtf: ref(0),
      co_rol: sessionStorage.getItem('co_rol')

    }
  },
  methods: {
    totalImp () {
      const body = {
        idtipodocumento: this.idtipodochijo || undefined,
        idserviciosmasivo: this.idserviciohijo || undefined,
        desde: moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD'),
        hasta: moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD')
      }
      axios.post(ENDPOINT_PATH_V2 + 'reporte/impprocesados', body).then(async response => {
        const datos = response.data.data
        // console.log(datos)
        this.totaldoc = datos[0].total
        this.exento = datos[0].totalexento || 0
        this.totalimpg = datos[0].totalg || 0
        this.totalimpr = datos[0].totalr || 0
        this.totalbase = Number(this.totalimpg) + Number(this.totalimpr) + Number(this.exento)
        this.totalimpigtf = datos[0].totaligtf || 0
        this.totalimp = Number(this.totalimpg) + Number(this.totalimpr) + Number(this.totalimpigtf)

        this.totalbase = this.completarDecimales(this.totalbase)
        this.totalimpg = this.completarDecimales(this.totalimpg)
        this.totalimpr = this.completarDecimales(this.totalimpr)
        this.totalimpigtf = this.completarDecimales(this.totalimpigtf)
        this.totalimp = this.completarDecimales(this.totalimp)
      }).catch(error => {
        Notify.create('Problemas al procesar ' + error)
      })
    },
    completarDecimales (cadena) {
      cadena = Intl.NumberFormat('de-DE').format(cadena.toFixed(2))
      const arreglo = cadena.split(',')

      cadena = arreglo.length === 1 ? cadena + ',00' : arreglo[1].length === 1 ? cadena + '0' : cadena
      return cadena
    },
    listarClientes () {
      const body = {
        idtipodocumento: this.idtipodochijo || undefined,
        idserviciosmasivo: this.idserviciohijo || undefined,
        desde: moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD'),
        hasta: moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD')
      }
      axios.post(ENDPOINT_PATH_V2 + 'reporte/totalclientes', body).then(async response => {
        // console.log(response.data)
        this.totalclientes = response.data.data.length
        // console.log(this.totalclientes)
      }).catch(error => {
        Notify.create('Problemas al Contar Clientes ' + error)
      })
    },
    updateSocial () {
      this.totalImp()
      this.listarClientes()
    }
  },
  watch: {
    idtipodochijo: function (val) {
      this.updateSocial()
    },
    dateFrom: function (val) {
      this.updateSocial()
    },
    idserviciohijo: function (val) {
      this.updateSocial()
    }
  },
  mounted () {
    this.updateSocial()
    setInterval(() => {
      this.updateSocial()
    }, 14000)
  }
})
</script>
