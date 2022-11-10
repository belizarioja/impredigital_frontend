<template>
  <div class="q-pa-md">
    <div class="row">
        <q-select
          dense
          class="col"
          filled
          options-dense
          v-model="modelsede"
          :options="optionssede"
          option-label="name"
          option-value="cod"
          @update:model-value="changeSede()"
          label="Seleccione Cliente"
          style="margin: 20px;" />
        <q-select
          dense
          class="col"
          filled
          options-dense
          v-model="modeltipo"
          :options="optionstipo"
          option-label="name"
          option-value="cod"
          label="Seleccione Tipo Documento"
          style="margin: 20px;" />
    </div>
    <div class="row">
      <q-card class="col q-pa-md" style="min-width: 350px">
        <q-card-section class="row">
          <div class="text-h6">Crear Documento</div>
        </q-card-section>

        <q-card-section class="row q-pt-none">
          <q-input
            class="col-12 q-pa-md"
            dense
            type="textarea"
            v-model="tokenservicios"
            label="Token"
            autofocus
          />
          <q-input
            class="col-6 q-pa-md"
            dense
            v-model="rif"
            label="RIF"
            autofocus
          />
          <q-input
            class="col-6 q-pa-md"
            dense
            v-model="relacionado"
            label="Factura relacionada"
            autofocus
          />
          <q-input
            class="col-6 q-pa-md"
            dense
            v-model="cedula"
            label="Cédula"
            autofocus
          />
          <q-input
            class="col-6 q-pa-md"
            dense
            v-model="nombre"
            label="Nombre"
          />
          <q-input
            class="col-6 q-pa-md"
            dense
            v-model="direccion"
            label="Dirección"
            autofocus
          />
          <q-input
            class="col-6 q-pa-md"
            dense
            v-model="telefono"
            label="Teléfono"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="tasag"
            label="IVA"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="baseg"
            label="Imponible"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="impuestog"
            label="Monto IVA"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="tasar"
            label="Tasa Reducida"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="baser"
            label="Base Reducida"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="impuestor"
            label="Impuesto Reducido"
          />
          <!-- <q-input
            class="col-4 q-pa-md"
            dense
            v-model="tasaa"
            label="Tasa A"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="basea"
            label="Base A"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="impuestoa"
            label="Impuesto A"
          /> -->
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="tasaigtf"
            label="IGTF"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="baseigtf"
            label="Imponible"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="impuestoigtf"
            label="Monto IGTF"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="exento"
            label="Exento"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="subtotal"
            label="Sub total"
          />
          <q-input
            class="col-4 q-pa-md"
            dense
            v-model="total"
            label="Total"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Aceptar" @click="crear"/>
        </q-card-actions>
      </q-card>
      <q-card class="col q-pa-md">
        <q-card-section>
          <div class="text-h6 ">Resultado</div>
        </q-card-section>
        <q-card-section>
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{dateInicioPrueba}}</span>
        </q-card-section>
        <q-card-section>
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{resultProcess}}</span>
        </q-card-section>
        <q-card-section>
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{messageProcess}}</span>
        </q-card-section>
        <q-card-section>
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{fechaProcess}}</span>
        </q-card-section>
        <q-card-section>
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{dateFinPrueba}}</span>
        </q-card-section>
      </q-card>

    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'

const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default {
  setup () {
    return {
      statusProcess: ref(true),
      resultProcess: ref(''),
      messageProcess: ref(''),
      fechaProcess: ref(''),
      tokenservicios: ref(''),
      rif: ref(''),
      relacionado: ref(''),
      cedula: ref(''),
      direccion: ref(''),
      telefono: ref(''),
      subtotal: ref(0),
      nombre: ref(''),
      total: ref(0),
      exento: ref(0),
      tasag: ref(0),
      baseg: ref(0),
      impuestog: ref(0),
      tasar: ref(0),
      baser: ref(0),
      impuestor: ref(0),
      tasaa: ref(0),
      basea: ref(0),
      impuestoa: ref(0),
      tasaigtf: ref(0),
      baseigtf: ref(0),
      impuestoigtf: ref(0),
      loading: ref(false),
      dateInicioPrueba: ref(''),
      dateFinPrueba: ref('')
    }
  },
  data () {
    return {
      modeltipo: [],
      optionstipo: [],
      modelsede: [],
      optionssede: [],
      pagination: {
        page: 1,
        rowsPerPage: 0 // 0 means all rows
      }
    }
  },
  methods: {
    changeSede () {
      console.log(this.modelsede.cod)
      this.rif = this.modelsede.rif
      this.tokenservicios = this.modelsede.tokenservicios
      // this.listarfacturas()
    },
    changeTipo () {
      console.log(this.modeltipo.cod)
      // this.listarfacturas()
    },
    generateRandomString () {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result1 = ''
      const charactersLength = characters.length
      for (let i = 0; i < 9; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result1
    },
    crear () {
      if (!this.modelsede.cod) {
        Notify.create('Debe seleccionar Servicio Masivo ')
        return
      }
      if (!this.modeltipo.cod) {
        Notify.create('Debe seleccionar tipo de Documento ')
        return
      }
      if (Number(this.modeltipo.cod) !== 3) {
        this.relacionado = undefined
      }
      this.dateInicioPrueba = moment().format('YYYY-MM-DD HH:mm:ss')
      for (let i = 0; i < 100; i++) {
        for (const j in this.optionssede) {
          const sede = this.optionssede[j]
          this.rif = sede.rif
          this.tokenservicios = sede.tokenservicios
          this.statusProcess = false
          this.resultProcess = ''
          this.messageProcess = ''
          this.fechaProcess = ''
          const trackingid = this.generateRandomString()
          const headersjwt = {
            headers: {
              Authorization: 'Bearer ' + this.tokenservicios
            }
          }
          const body = {
            rif: this.rif,
            trackingid: trackingid,
            nombrecliente: this.nombre,
            rifcedulacliente: this.cedula,
            direccioncliente: this.direccion,
            telefonocliente: this.telefono,
            relacionado: this.relacionado,
            idtipodocumento: Number(this.modeltipo.cod),
            subtotal: Number(this.subtotal),
            exento: Number(this.exento),
            tasag: Number(this.tasag),
            baseg: Number(this.baseg),
            impuestog: Number(this.impuestog),
            tasar: Number(this.tasar),
            baser: Number(this.baser),
            impuestor: Number(this.impuestor),
            tasaigtf: Number(this.tasaigtf),
            baseigtf: Number(this.baseigtf),
            impuestoigtf: Number(this.impuestoigtf),
            total: Number(this.total)
          }
          // console.log(body)
          axios.post(ENDPOINT_PATH_V2 + 'facturacion', body, headersjwt).then(async response => {
            console.log(response.data)
            if (response.status === 200) {
              this.statusProcess = response.data.success
              this.resultProcess = 'Transmisión EXITOSA!'
              this.messageProcess = response.data.data.numerodocumento
              this.fechaProcess = response.data.data.fecha + ' ' + response.data.data.hora
            // console.log(response.status)
            // this.limpiar()
            }
            if (response.status === 202) {
              this.statusProcess = response.data.success
              this.resultProcess = 'Transmisión FALLIDA!'
              this.messageProcess = response.data.error.message
              this.fechaProcess = ''
            // console.log(response.status)
            }
          })
        }
      }

      this.dateFinPrueba = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    limpiar () {
      this.cedula = ''
      this.subtotal = 0
      this.nombre = ''
      this.total = 0
      this.exento = 0
      this.tasag = 0
      this.baseg = 0
      this.impuestog = 0
      this.tasar = 0
      this.baser = 0
      this.impuestor = 0
      this.tasaa = 0
      this.basea = 0
      this.impuestoa = 0
      this.tasaigtf = 0
      this.baseigtf = 0
      this.impuestoigtf = 0
      // this.modelsede = []
      // this.modeltipo = []
    },
    listartipos () {
      axios.get(ENDPOINT_PATH_V2 + 'tipodocumento').then(async response => {
        console.log(response.data)
        const datos = response.data.data
        this.optionstipo = []
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.name = datos[i].tipodocumento
          this.optionstipo.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Tipos de documentos ' + error)
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
          obj.rif = datos[i].rif
          obj.tokenservicios = datos[i].tokenservicios
          this.optionssede.push(obj)
        }
      }).catch(error => {
        Notify.create('Problemas al listar Sedes ' + error)
      })
    }
  },
  mounted () {
    this.listarsedes()
    this.listartipos()
    // this.listarsedes()
  }

}
</script>
