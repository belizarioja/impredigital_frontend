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
          label="Seleccione Servicio"
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
            v-model="numerodocumento"
            label="Número documento"
            autofocus
          />
          <q-input
            class="col-12 q-pa-md"
            type="textarea"
            dense
            v-model="observacion"
            label="Observación"
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
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{resultProcess}}</span>
        </q-card-section>
        <q-card-section>
          <span :class="statusProcess ? 'text-positive' : 'text-negative'">{{messageProcess}}</span>
        </q-card-section>
      </q-card>

    </div>
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
      statusProcess: ref(true),
      resultProcess: ref(''),
      messageProcess: ref(''),
      tokenservicios: ref(''),
      rif: ref(''),
      numerodocumento: ref(''),
      observacion: ref(''),
      loading: ref(false)
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
    crear () {
      if (!this.modelsede.cod) {
        Notify.create('Debe seleccionar Servicio Masivo ')
        return
      }
      if (!this.modeltipo.cod) {
        Notify.create('Debe seleccionar tipo de Documento ')
        return
      }
      this.statusProcess = false
      this.resultProcess = ''
      this.messageProcess = ''
      const headersjwt = {
        headers: {
          Authorization: 'Bearer ' + this.tokenservicios
        }
      }
      const body = {
        rif: this.rif,
        numerodocumento: this.numerodocumento,
        idtipodocumento: this.modeltipo.cod,
        observacion: this.observacion
      }
      // console.log(body)
      axios.post(ENDPOINT_PATH_V2 + 'anulacion', body, headersjwt).then(async response => {
        console.log(response.data)
        if (response.status === 200) {
          this.statusProcess = response.data.success
          this.resultProcess = 'Transmisión EXITOSA!'
          // console.log(response.status)
          this.limpiar()
        }
        if (response.status === 202) {
          this.statusProcess = response.data.success
          this.resultProcess = 'Transmisión FALLIDA!'
          this.messageProcess = response.data.error.message
          // console.log(response.status)
        }
      })
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
