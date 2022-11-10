<template>
 <div class="bg-primary window-height window-width row justify-center">

  <!--<q-card
    no-body
    class="text-center justify-content-center h-100"
    style="max-width: 600px;min-width: 600px;margin: 0px auto;">
    <q-card-section>
        <br><p style="margin: 0;">SELECCIONE CLIENTE EMISOR</p>
    </q-card-section>
    <q-separator />
    <q-card-section style="display: flex; justify-content: space-evenly;">
      <div
        v-for="(item, index) in rows"
        :key="index"
        class="iconSede sedeNoSelected "
        :class="{[`class${index}`]: true}"
        @click="onSeleted(index)">
         <div class="imgSede">
           <img v-bind:src="item.logo" onerror="this.src='default.svg'" v-bind:width="item.width"/>
         </div>
         <span class="nombreSede">{{ item.rif }}</span>
         <span class="direccionSede">{{ item.razonsocial }}</span>
       </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-btn
        label="Continuar"
        v-close-popup color="secondary"
        style=""
        :disabled="isDisabled"
        @click="volver()"/>
    </q-card-section>
  </q-card> -->
  <q-card style="width: 600px; overflow: auto; height: 730px; margin-top: 40px;">
      <q-card-section class="" style="background: darkslategray;">
        <div class="text-h6 text-white">
          Seleccione cliente emisor
        </div>
      </q-card-section>
        <div
          class="row"
          style="justify-content: center;height: 600px; overflow: scroll;"
        >
          <div
            v-for="(item, index) in rows"
            :key="index"
            class="iconPaquete sedeNoSelected "
            :class="{[`class${index}`]: true}"
            @click="onSeleted(index, item.cod, item.razonsocial, item.rif)"
          >
            <div class="imgPaquete">
              <img
                v-bind:src="item.logo"
                onerror="this.src='default.svg'"
                :width="item.width"
                style="border-radius: 7px;"
              />
            </div>
            <span class="nombrePaquete">{{ item.razonsocial }}</span>
            <span class="sedePaquete">RIF: {{item.rif}}</span>
          </div>
        </div>
      <q-card-section
        class="q-pt-sm"
        style="height: 55px"
      >
        <q-btn
          label="Seguir con Cliente seleccionado"
          :disabled="changePacks"
          color="primary"
          @click="continuar"
          style="float:left;"
        />
        <q-btn
         label="Seguir con todos los Clientes"
         v-close-popup color="secondary"
         @click="todos"
         style="float: right;"/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { Notify } from 'quasar'
import axios from 'axios'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2

export default {
  name: 'SedesLayout',
  data () {
    return {
      changePacks: true,
      usuario: '',
      clave: '',
      loading: false,
      columns: [
        { name: 'logo', align: 'center', label: 'Logo', field: 'logo', sortable: true },
        { name: 'rif', align: 'center', label: 'RIF', field: 'rif', sortable: true },
        { name: 'razonsocial', align: 'center', label: 'Razón social', field: 'razonsocial', sortable: true },
        { name: 'direccion', label: 'Dirección', field: 'direccion', sortable: true },
        { name: 'email', label: 'Correo electrónico', field: 'email', sortable: true },
        { name: 'telefono', label: 'Teléfono contacto', field: 'telefono', sortable: true },
        { name: 'estatus', label: 'Estatus', field: 'estatus' }
      ],
      rows: []
    }
  },
  methods: {
    todos () {
      this.$router.push('/dashboard')
    },
    continuar () {
      sessionStorage.setItem('co_sede_seleted', this.co_sede_seleted)
      sessionStorage.setItem('tx_sede_seleted', this.tx_sede_seleted)
      sessionStorage.setItem('rif_sede_seleted', this.rif_sede_seleted)
      this.$router.push('/dashboard')
    },
    onClean () {
      this.co_sede_seleted = ''
      this.tx_sede_seleted = ''
      this.rif_sede_seleted = ''
      const elements = document.querySelectorAll('.iconPaquete')
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains('sedeSelected')) {
          elements[i].classList.remove('sedeSelected')
          elements[i].classList.add('sedeNoSelected')
        }
      }
    },
    onSeleted (index, cod, razonsocial, rif) {
      this.changePacks = true
      const element = document.querySelector('.class' + index)

      this.onClean()
      element.classList.add('sedeSelected')
      element.classList.remove('sedeNoSelected')
      this.co_sede_seleted = cod
      this.tx_sede_seleted = razonsocial
      this.rif_sede_seleted = rif
      const elements = document.querySelectorAll('.iconPaquete')
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains('sedeSelected')) {
          this.changePacks = false
        }
      }
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
          obj.logo = ENDPOINT_PATH_V2 + 'imagen/' + datos[i].rif + '.png'
          obj.width = 100
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
<style>
    .sedeNoSelected{
    border: 2px solid #ddd;
    }
    .sedeSelected {
    border: 2px solid #74ab43;
    }
  .iconPaquete {
    text-align: center;
    width: 150px;
    height: 185px;
    border-radius: 10px;
    margin: 9px;
    padding: 5px;
    float: left;
    cursor: pointer;
    display: grid;
    padding-top: 10px;
  }

  .nombrePaquete {
    height: 53px;
    font-size: 13px;
    display: grid;
    justify-content: center;
    align-items: center;
  }
  .precioPaquete {
    font-size: 15px;
    font-weight: bolder;
  }
  .direccionPaquete {
    font-size: 9px;
    font-style: italic;
    height: 25px;
    display: grid;
    justify-content: center;
    align-items: center;
  }
  .diasPaquete {
    font-size: 14px;
  }
  .sedePaquete {
    font-size: 11px;
    font-weight: bolder;
    color: #74ab43;
  }
  .imgPaquete {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
