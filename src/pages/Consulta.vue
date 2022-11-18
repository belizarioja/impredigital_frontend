<template>
  <div class="q-pa-md">
    <div class="row">
      <span style="margin: 0 20px;font-size: 25px;font-weight: bolder;">Consulta</span>
    </div>
    <div class="row">
        <q-select
          v-if="co_rol === '1' || co_rol === '2'"
          label="Buscar por Nombre o RIF del Emisor"
          dense
          class="col-md-4 col-sm-12 col-xs-12"
          filled
          v-model="modelsede"
          :disable="disabledSede"
          use-input
          hide-selected
          fill-input
          clearable
          options-dense
          option-label="namerif"
          option-value="cod"
          input-debounce="0"
          :options="optionssede"
          @update:model-value="changeSede()"
          @input:="changeSede()"
          @filter="searchEmisor"
          style="padding: 5px;"
        />
        <q-select
          dense
          class="col-md-4 col-sm-6 col-xs-12"
          filled
          options-dense
          v-model="modeltipo"
          :options="optionstipo"
          option-label="name"
          option-value="cod"
          label="Tipo de Documento"
          @update:model-value="changeTipo()"
          style="padding: 5px;"
        />
        <q-input
          filled
          class="col-md-4 col-sm-6 col-xs-12"
          label="Buscar por N° Control"
          v-model="numerodocumento"
          @input:="listarfacturas"
          style="padding: 5px;"
          :disable="disable"
          dense
        >
          <template v-slot:append>
            <q-icon
             v-if="numerodocumento.length > 0"
             name="close"
             @click="numerodocumento = '', listarfacturas()"
             class="cursor-pointer"
            />
          </template>
          <template v-slot:after>
            <q-btn dense color="primary" icon="search" @click="listarfacturas" :disable="disable"/>
          </template>
        </q-input>
    </div>
    <div class="row">
      <q-select
          label="Buscar por Nombre o RIF del cliente"
          dense
          class="col-md-4 col-sm-6 col-xs-12"
          filled
          v-model="modelcliente"
          use-input
          :disable="disable"
          hide-selected
          fill-input
          clearable
          options-dense
          option-label="namerif"
          option-value="rif"
          input-debounce="0"
          :options="optionscliente"
          @update:model-value="changeCliente()"
          @input:="changeCliente()"
          @filter="searchCliente"
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
          v-model="modelimpuesto"
          :options="optionsimpuesto"
          option-label="name"
          option-value="cod"
          label="Tipo de Impuesto"
          @update:model-value="changeImpuesto()"
          style="padding: 5px;"
        />
    </div>
    <div class="row q-pa-md" style="">
      <q-table
        class="my-sticky-header-table"
        :title="modeltipo.cod ? modeltipo.name : titulotabla"
        :rows="rows"
        :columns="columnseleted"
        row-key="name"
        :pagination="initialPagination"
        style="overflow: auto;"
        :loading="loading"
        no-data-label="No hay registros!"
      >
       <template v-slot:top-right>
        <div class="row">
          <q-btn color="primary" label="Imprimir" @click="exportPDF" />
        </div>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-if="(co_rol === '1' || co_rol === '3') || (co_rol === '2' && !co_sede_seleted)" key="rif" :props="props" style="display: grid;text-align:left;height: 51px;">
              <span style="font-weight: bolder; width: 200px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ props.row.razonsocial }}</span>
              <span style="font-style: italic;">RIF: {{ props.row.rif }}</span>
            </q-td>
            <q-td v-if="co_rol === '1' || co_rol === '3'"  key="trackingid" :props="props">
              {{ props.row.trackingid }}
            </q-td>
            <q-td v-if="co_rol === '1' || co_rol === '3'"  key="tipodocumento" :props="props" style="display: grid;text-align: left;height: 51px;">
              <span style="font-weight: bolder;">{{ props.row.tipodocumento }}</span>
              <span style="font-style: italic;">N°: {{ props.row.numerodocumento }}</span>
            </q-td>
            <q-td v-if="co_rol === '2' || co_rol === '4'"  key="tipodocumento" :props="props">
              {{ props.row.tipodocumento }}
            </q-td>
            <q-td v-if="co_rol === '2' || co_rol === '4'"  key="numerodocumento" :props="props">
              <span style="font-weight: bolder;">{{ props.row.numerodocumento }}</span>
            </q-td>
            <q-td key="fecha" :props="props">
              {{ props.row.fecha }}
            </q-td>
            <q-td key="nombrecliente" :props="props" style="display: grid;text-align:left;height: 51px;">
              <span style="font-weight: bolder; width: 180px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ props.row.nombrecliente }}</span>
              <span style="font-style: italic;">RIF: {{ props.row.cedulacliente }}</span>
            </q-td>
            <q-td key="exento" :props="props">
              {{ props.row.exento }}
            </q-td>
            <q-td key="tasag" :props="props">
              {{ props.row.tasag }}
            </q-td>
            <q-td key="baseg" :props="props">
              {{ props.row.baseg }}
            </q-td>
            <q-td key="impuestog" :props="props">
              {{ props.row.impuestog }}
            </q-td>
            <q-td key="tasar" :props="props">
              {{ props.row.tasar }}
            </q-td>
            <q-td key="baser" :props="props">
              {{ props.row.baser }}
            </q-td>
            <q-td key="impuestor" :props="props">
              {{ props.row.impuestor }}
            </q-td>
            <q-td key="tasaigtf" :props="props">
              {{ props.row.tasaigtf }}
            </q-td>
            <q-td key="baseigtf" :props="props">
              {{ props.row.baseigtf }}
            </q-td>
            <q-td key="impuestoigtf" :props="props">
              {{ props.row.impuestoigtf }}
            </q-td>
            <q-td key="relacionado" :props="props">
              <q-badge v-if="props.row.relacionado"
                color="green"
                style="cursor: pointer;padding: 5px 10px;"
                @click="buscarDetail(props.row)">
              {{ props.row.relacionado }}
            </q-badge>
            </q-td>
            <q-td key="detail" :props="props">
              <q-btn
                color="primary"
                icon="receipt_long"
                @click="openDetail(props.row)" />
            </q-td>
            <q-td key="exportar" :props="props">
              <!-- <q-btn
                color="negative"
                label="PDF"
                style="    margin-right: 10px;"
                @click="exportToPDF" />-->
              <q-btn
                color="info"
                label="XML"
                @click="exportXMLDetail(props.row)" />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom-row>
          <q-tr>
            <q-td :colspan="(co_rol === '1' || co_rol === '3') || (co_rol === '2' && !co_sede_seleted) ? '7' : '6'" class="totales">
              Totales
            </q-td>
            <q-td style="text-align: right;"  class="totales">
              {{totalbaseg}}
            </q-td>
            <q-td style="text-align: right;" class="totales">
              {{totalimpuestog}}
            </q-td>
            <q-td  class="totales">
            </q-td>
            <q-td style="text-align: right;" class="totales">
              {{totalbaser}}
            </q-td>
            <q-td style="text-align: right;" class="totales">
              {{totalimpuestor}}
            </q-td>
            <q-td  class="totales">
            </q-td>
            <q-td style="text-align: right;" class="totales">
              {{totalbaseigtf}}
            </q-td>
            <q-td style="text-align: right;" class="totales">
              {{totalimpuestoigtf}}
            </q-td>
            <q-td  class="totales">
            </q-td>
            <q-td  class="totales">
            </q-td>
            <q-td  class="totales">
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-dialog v-model="viewdetail" persistent>
        <q-card style="max-width: inherit; width: auto">
          <div id="detailid">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="registro.logo" onerror="this.src='default.svg'">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <table>
                <tr>
                  <td style="width: 333px;">
                    {{registro.razonsocialdetail}}
                  </td>
                  <td>
                    RIF: {{registro.rifdetail}}
                  </td>
                </tr>
                <tr>
                  <td>
                   {{registro.direcciondetail}}
                  </td>
                  <td>
                   {{registro.tipodocumentodetail}}
                  </td>
                </tr>
              </table>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <table style="width: 625px;">
                <tr>
                  <td style="width: 390px;">
                    Razón&nbsp;social:&nbsp;{{registro.nombreclientedetail}}&nbsp; RIF:&nbsp;{{registro.cedulaclientedetail}}
                  </td>
                  <td>
                    N° DE CONTROL&nbsp;:&nbsp;<span style="font-size: 18px;color: #e00303;font-weight: bolder;"> {{registro.numerodocumento}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Dirección: {{registro.direccionclientedetail}} Caracas
                  </td>
                  <td>
                   Fecha de Emisión: {{registro.fechadetail}}
                  </td>
                </tr>
                <tr>
                  <td>
                    Teléfono: {{registro.telefonoclientedetail}} 04125558877
                  </td>
                  <td>
                    Hora de Emisión: {{registro.horadetail}}
                  </td>
                </tr>
              </table>
            </q-item-section>
          </q-item>
          <q-separator />

          <q-item style="width: 65%;">

            <q-item-section>
              <q-item-label>Base imponible Bs. Gravable 16%:</q-item-label>
              <q-item-label>Base imponible Bs. Gravable 8%:</q-item-label>
              <q-item-label>Base imponible Bs. Exento 0%:</q-item-label>
              <q-item-label>Base imponible Bs. IGTF 3%:</q-item-label>
              <q-item-label>IVA 16%%:</q-item-label>
              <q-item-label>IVA Reducido 8%:</q-item-label>
              <q-item-label>IGTF 3%:</q-item-label>
              <q-item-label>Total:</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{registro.basegdetail}}</q-item-label>
              <q-item-label caption>{{registro.baserdetail}}</q-item-label>
              <q-item-label caption>{{registro.exentodetail}}</q-item-label>
              <q-item-label caption>{{registro.baseigtfdetail}}</q-item-label>
              <q-item-label caption>{{registro.impuestogdetail}}</q-item-label>
              <q-item-label caption>{{registro.impuestordetail}}</q-item-label>
              <q-item-label caption>{{registro.impuestoigtfdetail}}</q-item-label>
              <q-item-label caption>{{registro.totaldetail}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
          <q-separator spaced inset="item" />
          <q-card-actions align="right">
            <q-btn
                color="info"
                label="PDF"
                style="margin-right: 10px;"
                @click="exportDetailToPDF" />
            <q-btn label="Cerrar" color="negative" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- CARD DE PDF DETAIL
      <q-card style="max-width: inherit; width: auto; display: none;">
          <div id="">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img :src="registro.logo" onerror="this.src='default.svg'">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <table>
                <tr>
                  <td style="width: 333px;">
                    {{registro.razonsocialdetail}}
                  </td>
                  <td>
                    RIF Nuevo: {{registro.rifdetail}}
                  </td>
                </tr>
                <tr>
                  <td>
                   {{registro.direcciondetail}}
                  </td>
                  <td>
                   {{registro.tipodocumentodetail}}
                  </td>
                </tr>
              </table>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <table style="width: 625px;">
                <tr>
                  <td style="width: 390px;">
                    Razón&nbsp;social:&nbsp;{{registro.nombreclientedetail}}&nbsp; RIF:&nbsp;{{registro.cedulaclientedetail}}
                  </td>
                  <td>
                    N° DE CONTROL&nbsp;:&nbsp;<span style="font-size: 18px;color: #e00303;font-weight: bolder;"> {{registro.numerodocumento}}</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    Dirección: {{registro.direccionclientedetail}} Caracas
                  </td>
                  <td>
                   Fecha de Emisión: {{registro.fechadetail}}
                  </td>
                </tr>
                <tr>
                  <td>
                    Teléfono: {{registro.telefonoclientedetail}} 04125558877
                  </td>
                  <td>
                    Hora de Emisión: {{registro.horadetail}}
                  </td>
                </tr>
              </table>
            </q-item-section>
          </q-item>
          <q-separator />

          <q-item style="width: 65%;">

            <q-item-section>
              <q-item-label>Base imponible Bs. Gravable 16%:</q-item-label>
              <q-item-label>Base imponible Bs. Gravable 8%:</q-item-label>
              <q-item-label>Base imponible Bs. Exento 0%:</q-item-label>
              <q-item-label>Base imponible Bs. IGTF 3%:</q-item-label>
              <q-item-label>IVA 16%%:</q-item-label>
              <q-item-label>IVA Reducido 8%:</q-item-label>
              <q-item-label>IGTF 3%:</q-item-label>
              <q-item-label>Total:</q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{registro.basegdetail}}</q-item-label>
              <q-item-label caption>{{registro.baserdetail}}</q-item-label>
              <q-item-label caption>{{registro.exentodetail}}</q-item-label>
              <q-item-label caption>{{registro.baseigtfdetail}}</q-item-label>
              <q-item-label caption>{{registro.impuestogdetail}}</q-item-label>
              <q-item-label caption>{{registro.impuestordetail}}</q-item-label>
              <q-item-label caption>{{registro.impuestoigtfdetail}}</q-item-label>
              <q-item-label caption>{{registro.totaldetail}}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
       </q-card>-->
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { exportFile, Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
const config = require('../config/endpoints.js')
const ENDPOINT_PATH_V2 = config.endpoint_path_v2
function wrapCsvValue (val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}
export default {
  setup () {
    return {
      term: ref(''),
      totalbaseg: ref('0,00'),
      totalbaser: ref('0,00'),
      totalbaseigtf: ref('0,00'),
      totalimpuestog: ref('0,00'),
      totalimpuestor: ref('0,00'),
      totalimpuestoigtf: ref('0,00'),
      disabledSede: ref(false),
      viewdetail: ref(false),
      idserviciosmasivo: ref(undefined),
      idtipodocumento: ref(undefined),
      serviciosmasivo: ref(undefined),
      tipodocumento: ref(undefined),
      dateHoy: moment().format('DD/MM/YYYY'),
      tx_nombre: sessionStorage.getItem('tx_nombre'),
      loading: ref(false),
      numerodocumento: ref(''),
      titulotabla: ref('Documentos'),
      disable: ref(true),
      dateFrom: ref(moment().format('YYYY-MM-DD')),
      dateTo: ref(moment().format('YYYY-MM-DD')),
      co_rol: sessionStorage.getItem('co_rol'),
      co_sede: sessionStorage.getItem('co_sede'),
      initialPagination: {
        page: 1,
        rowsPerPage: 10 // 0 means all rows
      }
    }
  },
  data () {
    return {
      columnseleted: [],
      columns: [
        {
          name: 'rif',
          required: true,
          label: 'Cliente emisor',
          align: 'left',
          field: row => row.razonsocial,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'trackingid', align: 'left', label: 'Referencia ID', field: 'trackingid', sortable: true },
        { name: 'tipodocumento', align: 'left', label: 'Documento', sortable: true },
        { name: 'fecha', align: 'left', label: 'Fecha y Hora', field: 'fecha' },
        { name: 'nombrecliente', align: 'left', label: 'Nombre Cliente', field: 'nombrecliente' },
        { name: 'exento', label: 'Exento', field: 'exento' },
        { name: 'tasag', label: 'Tasa IVA', field: 'tasag' },
        { name: 'baseg', label: 'Imponible IVA', field: 'baseg' },
        { name: 'impuestog', label: 'Impuesto IVA', field: 'impuestog' },
        { name: 'tasar', label: 'Tasa Reducido', field: 'tasar' },
        { name: 'baser', label: 'Imponible Reducido', field: 'baser' },
        { name: 'impuestor', label: 'Impuesto Reducido', field: 'impuestor' },
        { name: 'tasaigtf', label: 'Tasa IGTF', field: 'tasaigtf' },
        { name: 'baseigtf', label: 'Imponible IGTF', field: 'baseigtf' },
        { name: 'impuestoigtf', label: 'Impuesto IGTF', field: 'impuestoigtf' },
        { name: 'relacionado', label: 'Relacionado', field: 'relacionado' },
        { name: 'detail', label: 'Ver', align: 'center' },
        { name: 'exportar', label: 'Exportar', align: 'center' }
      ],
      columns2: [
        {
          name: 'rif',
          required: true,
          label: 'Cliente emisor',
          align: 'left',
          field: row => row.razonsocial,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'tipodocumento', align: 'left', label: 'Documento', field: 'tipodocumento', sortable: true },
        { name: 'numerodocumento', align: 'left', label: 'Número de Control', field: 'numerodocumento', sortable: true },
        { name: 'fecha', align: 'left', label: 'Fecha y Hora', field: 'fecha' },
        { name: 'nombrecliente', align: 'left', label: 'Nombre Cliente', field: 'nombrecliente' },
        { name: 'exento', label: 'Exento', field: 'exento' },
        { name: 'tasag', label: 'Tasa IVA', field: 'tasag' },
        { name: 'baseg', label: 'Imponible IVA', field: 'baseg' },
        { name: 'impuestog', label: 'Impuesto IVA', field: 'impuestog' },
        { name: 'tasar', label: 'Tasa Reducido', field: 'tasar' },
        { name: 'baser', label: 'Imponible Reducido', field: 'baser' },
        { name: 'impuestor', label: 'Impuesto Reducido', field: 'impuestor' },
        { name: 'tasaigtf', label: 'Tasa IGTF', field: 'tasaigtf' },
        { name: 'baseigtf', label: 'Imponible IGTF', field: 'baseigtf' },
        { name: 'impuestoigtf', label: 'Impuesto IGTF', field: 'impuestoigtf' },
        { name: 'relacionado', label: 'Relacionado', field: 'relacionado' },
        { name: 'detail', label: 'Ver', align: 'center' },
        { name: 'exportar', label: 'Exportar', align: 'center' }
      ],
      columns3: [
        { name: 'tipodocumento', align: 'left', label: 'Documento', field: 'tipodocumento', sortable: true },
        { name: 'numerodocumento', align: 'left', label: 'Número de Control', field: 'numerodocumento', sortable: true },
        { name: 'fecha', align: 'left', label: 'Fecha y Hora', field: 'fecha' },
        { name: 'nombrecliente', align: 'left', label: 'Nombre Cliente', field: 'nombrecliente' },
        { name: 'exento', label: 'Exento', field: 'exento' },
        { name: 'tasag', label: 'Tasa IVA', field: 'tasag' },
        { name: 'baseg', label: 'Imponible IVA', field: 'baseg' },
        { name: 'impuestog', label: 'Impuesto IVA', field: 'impuestog' },
        { name: 'tasar', label: 'Tasa Reducido', field: 'tasar' },
        { name: 'baser', label: 'Imponible Reducido', field: 'baser' },
        { name: 'impuestor', label: 'Impuesto Reducido', field: 'impuestor' },
        { name: 'tasaigtf', label: 'Tasa IGTF', field: 'tasaigtf' },
        { name: 'baseigtf', label: 'Imponible IGTF', field: 'baseigtf' },
        { name: 'impuestoigtf', label: 'Impuesto IGTF', field: 'impuestoigtf' },
        { name: 'relacionado', label: 'Relacionado', field: 'relacionado' },
        { name: 'detail', label: 'Ver', align: 'center' },
        { name: 'exportar', label: 'Exportar', align: 'center' }
      ],
      rows: [],
      tempxml: [],
      rowtempxml: [],
      modeltipo: [],
      modelimpuesto: [],
      optionsimpuesto: [
        { cod: undefined, name: 'Todos' },
        { cod: 1, name: 'Exento' },
        { cod: 2, name: 'Impuesto IVA' },
        { cod: 3, name: 'Impuesto reducido' },
        { cod: 4, name: 'Impuesto IGTF' }
      ],
      optionstipo: [],
      modelsede: null,
      optionssede: [],
      modelcliente: null,
      optionscliente: [],
      basegdetail: '',
      baserdetail: '',
      exentodetail: '',
      baseigtfdetail: '',
      registro: {},
      idusuario: sessionStorage.getItem('id_usuario'),
      co_sede_seleted: sessionStorage.getItem('co_sede_seleted'),
      tx_sede_seleted: sessionStorage.getItem('tx_sede_seleted'),
      rif_sede_seleted: sessionStorage.getItem('rif_sede_seleted')
    }
  },
  methods: {
    exportDetailToPDF () {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('l', 'pt', 'a4')
      console.log(document.getElementById('detailid'))
      doc.html(document.getElementById('detailid'), {
        callback: function (doc) {
          doc.save('impredigitalDetalle.pdf')
        },
        x: 60,
        y: 60

      })
    },
    JSONtoXML (obj) {
      let xml = ''
      for (const prop in obj) {
        xml += obj[prop] instanceof Array ? '' : '<' + prop + '>'
        if (obj[prop] instanceof Array) {
          for (const array in obj[prop]) {
            xml += '\n<' + prop + '>\n'
            xml += this.JSONtoXML(obj[prop][array])
            xml += '</' + prop + '>'
          }
        } else if (typeof obj[prop] === 'object') {
          xml += this.JSONtoXML(obj[prop])
        } else {
          xml += obj[prop]
        }
        xml += obj[prop] instanceof Array ? '' : '</' + prop + '>\n'
      }
      xml = xml.replace(/<\/?[0-9]{1,}>/g, '')
      return xml
    },
    exportXML (arreglo) {
      let header = '<?xml version="1.0"?>\n'
      header += '<root xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n\n'
      header += '<IsOriginal>true</IsOriginal>\n'
      header += '<IsOriginalMessage>ORIGINAL</IsOriginalMessage>\n\n'
      header += '<Documents>\n'

      const xml = this.JSONtoXML(arreglo)
      let footer = '</Documents>\n'
      footer += '</root>\n'

      // console.log(header + xml + footer)
      const status = exportFile(
        'impredigital-export.xml',
        header + xml + footer,
        'txt'
      )

      if (status !== true) {
        Notify.create('Browser denied file download...')
      }
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
        this.rows.map(row => this.columns.map(col => wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[col.field === void 0 ? col.name : col.field],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'impredigital-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        Notify.create('Browser denied file download...')
      }
    },
    exportPDF () {
      const vm = this
      this.crearbitacora(vm.dateFrom, vm.dateTo, 7)
      const columns = [
        { title: 'Emisor', dataKey: 'razonsocial' },
        { title: 'Rif', dataKey: 'rif' },
        { title: 'Referencia', dataKey: 'trackingid' },
        { title: 'Tipo Documento', dataKey: 'tipodocumento' },
        { title: 'N° de Control', dataKey: 'numerodocumento' },
        { title: 'Cliente', dataKey: 'nombrecliente' },
        { title: 'RIF Cliente', dataKey: 'cedulacliente' },
        { title: 'Fecha', dataKey: 'fecha' },
        { title: 'IVA', dataKey: 'impuestog' },
        { title: 'Reducido', dataKey: 'impuestor' },
        { title: 'IGTF', dataKey: 'impuestoigtf' }
      ]
      const addFooters = doc => {
        const pageCount = doc.internal.getNumberOfPages()

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(11)
        doc.setPage(pageCount)
        doc.text('Imprenta Digital', 40, doc.internal.pageSize.height - 40)
        doc.text('Fecha de Exportación ' + vm.dateHoy, 600, doc.internal.pageSize.height - 40)
        doc.text('Usuario: ' + vm.tx_nombre, 600, doc.internal.pageSize.height - 20)
      }
      const tipodoc = vm.idtipodocumento ? vm.tipodocumento : 'Documentos'
      const emisor = vm.idserviciosmasivo ? ' Emisor ' + vm.serviciosmasivo : ''
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('l', 'pt')
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(13)
      doc.text('Reporte de ' + tipodoc + '       Desde ' + moment(vm.dateFrom).format('DD/MM/YYYY') + ' Hasta ' + moment(vm.dateTo).format('DD/MM/YYYY') + '       ' + emisor, 40, 40)
      doc.autoTable(columns, vm.rows, {
        margin: { top: 60 }
      })
      addFooters(doc)
      doc.save('impredigitalRegistros.pdf')
    },
    exportXMLDetail (reg) {
      this.rowtempxml.push(this.detailXML(reg))
      this.exportXML(this.rowtempxml)
    },
    openDetail (reg) {
      this.rowtempxml = []
      reg.fecha = moment(reg.fecha, 'DD/MM/YYYY HH:mm:ss')
      this.rowtempxml.push(this.detailXML(reg))
      // console.log(this.rowtempxml)
      this.viewdetail = true
      this.registro.logo = reg.logo
      this.registro.razonsocialdetail = reg.razonsocial
      this.registro.rifdetail = reg.rif
      this.registro.direcciondetail = reg.direccion
      this.registro.tipodocumentodetail = reg.tipodocumento
      this.registro.numerodocumento = reg.numerodocumento
      this.registro.nombreclientedetail = reg.nombrecliente
      this.registro.cedulaclientedetail = reg.cedulacliente
      this.registro.direccionclientedetail = reg.direccioncliente
      this.registro.telefonoclientedetail = reg.telefonocliente
      this.registro.fechadetail = reg.fechasolo
      this.registro.horadetail = reg.hora
      this.registro.exentodetail = reg.exento

      this.registro.basegdetail = reg.baseg
      this.registro.baserdetail = reg.baser
      this.registro.baseigtfdetail = reg.baseigtf

      this.registro.impuestogdetail = reg.impuestog
      this.registro.impuestordetail = reg.impuestor
      this.registro.impuestoigtfdetail = reg.impuestoigtf

      this.registro.totaldetail = Number(reg.impuestogN) + Number(reg.impuestorN) + Number(reg.impuestoigtfN)
      this.registro.totaldetail = this.completarDecimales(this.registro.totaldetail)
    },
    searchCliente (val, update, abort) {
      if (val.length < 3) {
        abort()
        return
      }
      update(() => {
        if (val === '') {
          this.optionscliente = this.clientes
        } else {
          const needle = val.toLowerCase()
          this.optionscliente = this.clientes.filter(v => v.namerif.toLowerCase().indexOf(needle) > -1)
        }
      })
    },
    searchEmisor (val, update, abort) {
      if (val.length < 3) {
        abort()
        return
      }
      update(() => {
        if (val === '') {
          this.optionssede = this.emisores
        } else {
          const needle = val.toLowerCase()
          this.optionssede = this.emisores.filter(v => v.namerif.toLowerCase().indexOf(needle) > -1)
        }
      })
    },
    changeImpuesto () {
      this.exento = undefined
      this.impuestog = undefined
      this.impuestor = undefined
      this.impuestoigtf = undefined
      switch (this.modelimpuesto.cod) {
        case 1:
          this.exento = true
          break
        case 2:
          this.impuestog = true
          break
        case 3:
          this.impuestor = true
          // expected output: "Mangoes and papayas are $2.79 a pound."
          break
        case 4:
          this.impuestoigtf = true
          // expected output: "Mangoes and papayas are $2.79 a pound."
          break
        default:
          console.log('Sorry, we are out of.')
      }
      this.listarfacturas()
    },
    changeCliente () {
      this.cedulacliente = this.modelcliente?.rif
      this.listarfacturas()
    },
    changeSede () {
      this.disable = true
      this.numerodocumento = ''
      this.idserviciosmasivo = this.modelsede?.cod
      this.serviciosmasivo = this.modelsede?.namerif
      if (this.modelsede?.cod) {
        this.disable = false
      }
      this.listarfacturas()
    },
    changeTipo () {
      // this.disable = true
      this.idtipodocumento = this.modeltipo.cod
      this.tipodocumento = this.modeltipo.name
      // this.numerodocumento = ''
      this.listarfacturas()
    },
    listartipos () {
      axios.get(ENDPOINT_PATH_V2 + 'tipodocumento').then(async response => {
        const datos = response.data.data
        this.optionstipo = []
        const obj = {}
        obj.cod = undefined
        obj.name = 'Todos'
        this.optionstipo.push(obj)
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
        const datos = response.data.data
        this.optionssede = []
        for (const i in datos) {
          if (datos[i].razonsocial.length > 0) {
            const obj = {}
            obj.cod = datos[i].id
            obj.name = datos[i].razonsocial
            obj.rif = datos[i].rif
            obj.namerif = datos[i].razonsocial + ' ' + datos[i].rif
            obj.tokenservicios = datos[i].tokenservicios
            this.optionssede.push(obj)
          }
        }
        this.emisores = this.optionssede
        // this.rifs = this.optionssede
      }).catch(error => {
        Notify.create('Problemas al listar Sedes ' + error)
      })
    },
    buscarDetail (row) {
      const body = {
        idserviciosmasivo: row.idserviciosmasivo,
        numerodocumento: row.relacionado
      }
      axios.post(ENDPOINT_PATH_V2 + 'reporte/facturas/relacionado', body).then(async response => {
        const datos = response.data.data
        const obj = {}
        obj.cod = datos[0].id
        obj.logo = ENDPOINT_PATH_V2 + 'imagen/' + datos[0].rif + '.png'
        obj.idserviciosmasivo = datos[0].idserviciosmasivo
        obj.razonsocial = datos[0].razonsocial
        obj.rif = datos[0].rif
        obj.relacionado = datos[0].relacionado
        obj.direccion = datos[0].direccion
        obj.telefono = datos[0].telefono
        obj.trackingid = datos[0].trackingid
        obj.numerodocumento = datos[0].numerodocumento
        obj.tipodocumento = datos[0].tipodocumento
        obj.cedulacliente = datos[0].cedulacliente
        obj.nombrecliente = datos[0].nombrecliente
        obj.direccioncliente = datos[0].direccioncliente
        obj.telefonocliente = datos[0].telefonocliente
        obj.estatus = datos[0].estatus
        obj.observacion = datos[0].observacion
        obj.fecha = moment(datos[0].fecha).format('DD/MM/YYYY HH:mm:ss')
        obj.fechasolo = moment(datos[0].fecha).format('DD/MM/YYYY')
        obj.hora = moment(datos[0].fecha).format('HH:mm:ss')
        obj.subtotal = datos[0].subtotal
        obj.total = datos[0].total

        obj.tasag = datos[0].tasag ? datos[0].tasag + '%' : '0%'
        obj.tasar = datos[0].tasar ? datos[0].tasar + '%' : '0%'
        obj.tasaigtf = datos[0].tasaigtf ? datos[0].tasaigtf + '%' : '0%'

        obj.exento = datos[0].exento || 0
        obj.exentoN = datos[0].exento || 0
        obj.baseg = datos[0].baseg || 0
        obj.basegN = datos[0].baseg || 0
        obj.impuestogN = datos[0].impuestog || 0
        obj.baser = datos[0].baser || 0
        obj.impuestorN = datos[0].impuestor || 0
        obj.baseigtf = datos[0].baseigtf || 0
        obj.baseigtfN = datos[0].baseigtf || 0
        obj.impuestoigtfN = datos[0].impuestoigtf || 0

        datos[0].totalxml = Number(obj.exentoN) + Number(obj.basegN) + Number(obj.impuestogN)
        datos[0].grandtotalxml = Number(datos[0].totalxml) + Number(obj.baseigtfN) + Number(obj.impuestoigtfN)
        obj.totalxml = datos[0].totalxml
        obj.grandtotalxml = datos[0].grandtotalxml

        obj.exento = this.completarDecimales(obj.exento)
        obj.baseg = this.completarDecimales(obj.baseg)
        obj.impuestog = this.completarDecimales(obj.impuestogN)
        obj.baser = this.completarDecimales(obj.baser)
        obj.impuestor = this.completarDecimales(obj.impuestorN)
        obj.baseigtf = this.completarDecimales(obj.baseigtf)
        obj.impuestoigtf = this.completarDecimales(obj.impuestoigtfN)
        this.openDetail(obj)
      }).catch(error => {
        Notify.create('Problemas al Buscar factura ' + error)
      })
    },
    crearbitacora (desde, hasta, idevento) {
      let observacion = ''
      let fechas = ' desde el ' + desde + ' hasta el ' + hasta
      const tipodoc = this.modeltipo.name ? ', ' + this.modeltipo.name : ''
      observacion += tipodoc
      const cliente = this.modelsede?.name ? ', cliente emisor ' + this.modelsede.namerif : ''
      observacion += cliente
      const tipoimpuesto = this.modelimpuesto.name ? ', tipo de impuesto ' + this.modelimpuesto.name : ''
      observacion += tipoimpuesto
      const clientefinal = this.modelcliente?.rif ? ', cliente consumidor ' + this.modelcliente.namerif : ''
      observacion += clientefinal

      if (this.numerodocumento.length > 0) {
        fechas = ''
        observacion += ', N° de control ' + this.numerodocumento
      }
      observacion += fechas
      axios.post(ENDPOINT_PATH_V2 + 'bitacora', {
        idusuario: this.idusuario,
        idevento: idevento,
        ip: this.term,
        observacion: observacion,
        fecha: moment().format('YYYY-MM-DD HH:mm:ss')
      })
    },
    listarfacturas () {
      const desde = this.numerodocumento.length > 0 ? undefined : moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD')
      const hasta = this.numerodocumento.length > 0 ? undefined : moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD')
      const body = {
        idserviciosmasivo: this.modelsede?.cod ? this.modelsede.cod : this.co_rol === '3' ? this.co_sede : undefined,
        idtipodocumento: this.modeltipo?.cod,
        cedulacliente: this.modelcliente?.rif,
        numerodocumento: this.numerodocumento.length > 0 ? this.numerodocumento : undefined,
        desde: desde,
        hasta: hasta,
        exento: this.exento,
        impuestog: this.impuestog,
        impuestor: this.impuestor,
        impuestoigtf: this.impuestoigtf,
        estatus: 1
      }
      this.crearbitacora(desde, hasta, 3)
      this.loading = true
      axios.post(ENDPOINT_PATH_V2 + 'reporte/facturas', body).then(async response => {
        const datos = response.data.data
        this.rows = []
        this.tempxml = []
        this.clientes = []
        this.totalbaseg = 0
        this.totalbaser = 0
        this.totalbaseigtf = 0
        this.totalimpuestog = 0
        this.totalimpuestor = 0
        this.totalimpuestoigtf = 0
        for (const i in datos) {
          const obj = {}
          obj.cod = datos[i].id
          obj.logo = ENDPOINT_PATH_V2 + 'imagen/' + datos[i].rif + '.png'
          obj.idserviciosmasivo = datos[i].idserviciosmasivo
          obj.razonsocial = datos[i].razonsocial
          obj.rif = datos[i].rif
          obj.relacionado = datos[i].relacionado
          obj.direccion = datos[i].direccion
          obj.telefono = datos[i].telefono
          obj.trackingid = datos[i].trackingid
          obj.numerodocumento = datos[i].numerodocumento
          obj.tipodocumento = datos[i].tipodocumento
          obj.cedulacliente = datos[i].cedulacliente
          obj.nombrecliente = datos[i].nombrecliente
          obj.direccioncliente = datos[i].direccioncliente
          obj.telefonocliente = datos[i].telefonocliente
          obj.estatus = datos[i].estatus
          obj.observacion = datos[i].observacion
          obj.fecha = moment(datos[i].fecha).format('DD/MM/YYYY HH:mm:ss')
          obj.fechasolo = moment(datos[i].fecha).format('DD/MM/YYYY')
          obj.hora = moment(datos[i].fecha).format('HH:mm:ss')
          obj.subtotal = datos[i].subtotal
          obj.total = datos[i].total

          obj.tasag = datos[i].tasag ? datos[i].tasag + '%' : '0%'
          obj.tasar = datos[i].tasar ? datos[i].tasar + '%' : '0%'
          obj.tasaigtf = datos[i].tasaigtf ? datos[i].tasaigtf + '%' : '0%'

          obj.exento = datos[i].exento || 0
          obj.exentoN = datos[i].exento || 0
          obj.baseg = datos[i].baseg || 0
          obj.basegN = datos[i].baseg || 0
          obj.impuestogN = datos[i].impuestog || 0
          obj.baser = datos[i].baser || 0
          obj.baserN = datos[i].baser || 0
          obj.impuestorN = datos[i].impuestor || 0
          obj.baseigtf = datos[i].baseigtf || 0
          obj.baseigtfN = datos[i].baseigtf || 0
          obj.impuestoigtfN = datos[i].impuestoigtf || 0

          this.totalbaseg += Number(obj.basegN)
          this.totalbaser += Number(obj.baserN)
          this.totalbaseigtf += Number(obj.baseigtfN)
          this.totalimpuestog += Number(obj.impuestogN)
          this.totalimpuestor += Number(obj.impuestorN)
          this.totalimpuestoigtf += Number(obj.impuestoigtfN)

          datos[i].totalxml = Number(obj.exentoN) + Number(obj.basegN) + Number(obj.impuestogN)
          datos[i].grandtotalxml = Number(datos[i].totalxml) + Number(obj.baseigtfN) + Number(obj.impuestoigtfN)
          obj.totalxml = datos[i].totalxml
          obj.grandtotalxml = datos[i].grandtotalxml

          obj.exento = this.completarDecimales(obj.exento)
          obj.baseg = this.completarDecimales(obj.baseg)
          obj.impuestog = this.completarDecimales(obj.impuestogN)
          obj.baser = this.completarDecimales(obj.baser)
          obj.impuestor = this.completarDecimales(obj.impuestorN)
          obj.baseigtf = this.completarDecimales(obj.baseigtf)
          obj.impuestoigtf = this.completarDecimales(obj.impuestoigtfN)
          this.rows.push(obj)
          this.tempxml.push(this.detailXML(datos[i]))
          this.crearClientes(obj)
        }
        this.totalbaseg = this.completarDecimales(this.totalbaseg)
        this.totalbaser = this.completarDecimales(this.totalbaser)
        this.totalbaseigtf = this.completarDecimales(this.totalbaseigtf)

        this.totalimpuestog = this.completarDecimales(this.totalimpuestog)
        this.totalimpuestor = this.completarDecimales(this.totalimpuestor)
        this.totalimpuestoigtf = this.completarDecimales(this.totalimpuestoigtf)

        this.loading = false
      }).catch(error => {
        Notify.create('Problemas al listar Reporte ' + error)
      })
    },
    detailXML (row) {
      const objxml = {}
      objxml.DocumentDto = {}
      objxml.DocumentDto.CompanyFiscalRegistry = row.rif
      objxml.DocumentDto.CompanyName = row.razonsocial
      objxml.DocumentDto.CompanyAddressOne = row.direccion
      objxml.DocumentDto.CompanyAddressFour = row.telefono
      objxml.DocumentDto.id = row.trackingid
      objxml.DocumentDto.Currency = 'VES'

      objxml.DocumentDto.ProductLiteral = row.tipodocumento
      objxml.DocumentDto.SerieLiteral = row.numerodocumento
      objxml.DocumentDto.DayDate = moment(row.fecha).format('DD')
      objxml.DocumentDto.tMonthDate = moment(row.fecha).format('MM')
      objxml.DocumentDto.YearDate = moment(row.fecha).format('YYYY')

      objxml.DocumentDto.EmissionTimeFormatted = moment(row.fecha).format('hh:mm:ss')
      objxml.DocumentDto.Name = row.nombrecliente
      objxml.DocumentDto.FiscalRegistry = row.cedulacliente
      objxml.DocumentDto.Address = row.direccioncliente
      objxml.DocumentDto.Phone = row.telefonocliente
      objxml.DocumentDto.CreditNoteText = ''
      objxml.DocumentDto.Note1 = row.observacion

      objxml.DocumentDto.TaxBaseVES = row.baseg
      objxml.DocumentDto.ExemptAmountVES = row.exento
      objxml.DocumentDto.TaxPercentVES = row.tasag
      objxml.DocumentDto.TaxAmountVES = row.impuestog
      objxml.DocumentDto.TotalVES = this.completarDecimales(row.totalxml)

      objxml.DocumentDto.Annulled = row.estatus === '2' ? 'true' : 'false'
      objxml.DocumentDto.IGTFPercentage = row.tasaigtf
      objxml.DocumentDto.IGTFBaseAmountVES = row.baseigtf
      objxml.DocumentDto.IGTFAmountVES = row.impuestoigtf
      objxml.DocumentDto.GrandTotalVES = this.completarDecimales(row.grandtotalxml)

      return objxml
    },
    completarDecimales (cadena) {
      cadena = Intl.NumberFormat('de-DE').format(cadena.toFixed(2))
      const arreglo = cadena.split(',')
      cadena = arreglo.length === 1 ? cadena + ',00' : arreglo[1].length === 1 ? cadena + '0' : cadena
      return cadena
    },
    crearClientes (row) {
      const obj = {}
      const namerif = row.cedulacliente + ' ' + row.nombrecliente
      if (this.clientes.findIndex(item => item.namerif === namerif) === -1) {
        obj.rif = row.cedulacliente
        obj.namerif = namerif
        this.clientes.push(obj)
      }
    }
  },
  watch: {
    dateFrom: function (val) {
      console.log(val)
      this.listarfacturas()
    },
    dateTo: function (val) {
      console.log(val)
      this.listarfacturas()
    }
  },
  mounted () {
    fetch('https://api.ipify.org?format=json').then(x => x.json()).then(({ ip }) => {
      this.term = ip
      console.log('Mounted')
      console.log(this.tx_sede_seleted)
      if (this.co_sede_seleted) {
        const obj = {}
        obj.cod = this.co_sede_seleted
        obj.rif = this.rif_sede_seleted
        obj.razonsocial = this.tx_sede_seleted
        this.idserviciosmasivo = this.co_sede_seleted
        obj.namerif = obj.razonsocial + ' ' + obj.rif
        this.serviciosmasivo = obj.namerif
        this.modelsede = obj
        this.disabledSede = true
        this.disable = false
      }
      console.log(this.co_rol)
      if (this.co_rol === '3') {
        this.disable = false
      }
      this.listarsedes()
      this.listartipos()
      this.listarfacturas()
      // console.log((this.co_rol === '3' || this.co_rol === '4') || (this.co_rol === '2' && this.co_sede_seleted))
      this.columnseleted = (this.co_rol === '2' && !this.co_sede_seleted)
        ? this.columns2 : (this.co_rol === '1' || this.co_rol === '3') ? this.columns : this.columns3
      /* setInterval(() => {
        this.listarfacturas()
      }, 3000) */
    })
  }
}
</script>

<style>
  .text-caption {
      font-size: inherit;
  }
  .totales{
    font-weight: bolder;
    color: blue;
  }
</style>
<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  min-height: 70vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #f2f2f2

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
