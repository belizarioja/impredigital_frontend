<template>
  <q-card style="width: 100%;">
    <q-card-section class="q-pa-none">
      <q-table
        :title="'Ultimos documentos procesados (' + tipodochijo + ')'"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        row-key="name"
        :pagination="initialPagination"
        :visible-columns="visibleColumns"

      >
       <!-- <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template> -->
        <template v-slot:top-right>
          <div class="row">
          <span class="col-md-4 col-sm-4 col-xs-12" style="font-size: 20px;">Exportar:</span>
          <q-btn class="q-ml-sm col-md-2 col-sm-2 col-xs-3" color="negative" label="PDF" @click="exportPDF" />
          <q-btn class="q-ml-sm col-md-2 col-sm-2 col-xs-3" color="secondary" label="CSV" @click="exportTable"/>
          <q-btn class="q-ml-sm col-md-2 col-sm-2 col-xs-3" color="info" label="XML" @click="exportXML(tempxml)"/>
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
            <q-td v-if="co_rol === '1'"  key="tipodocumento" :props="props" style="display: grid;text-align: left;height: 51px;">
              <span style="font-weight: bolder;">{{ props.row.tipodocumento }}</span>
              <span style="font-style: italic;">N°: {{ props.row.numerodocumento }}</span>
            </q-td>
            <q-td v-if="co_rol === '3' || co_rol === '2'"  key="tipodocumento" :props="props">
              {{ props.row.tipodocumento }}
            </q-td>
            <q-td v-if="co_rol === '3' || co_rol === '2'"  key="numerodocumento" :props="props">
              <span style="font-weight: bolder;">{{ props.row.numerodocumento }}</span>
            </q-td>
            <q-td key="fecha" :props="props">
              <span style="width: 180px;">{{ props.row.fecha }}</span>
            </q-td>
            <q-td key="nombrecliente" :props="props" style="display: grid;text-align: left;height: 51px;">
              <span style="font-weight: bolder; width: 160px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{ props.row.nombrecliente }}</span>
              <span style="font-style: italic;">RIF: {{ props.row.cedulacliente }}</span>
            </q-td>
            <q-td key="iva" :props="props">
              {{ props.row.impuestog }}
            </q-td>
            <q-td key="reducido" :props="props">
              {{ props.row.impuestor }}
            </q-td>
            <q-td key="igtf" :props="props">
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
                @click="openDetail(props.row)" /> -->
              <q-btn
                color="info"
                label="XML"
                @click="exportXMLDetail(props.row)" />
            </q-td>
          </q-tr>
        </template>
        <template v-slot:bottom-row>
          <q-tr>
            <q-td :colspan="(co_rol === '1' || co_rol === '3') || (co_rol === '2' && !co_sede_seleted) ? '5' : '4'" class="totales">
              Totales
            </q-td>
            <q-td style="text-align: right;"  class="totales">
              {{totalimpuestog}}
            </q-td>
            <q-td style="text-align: right;" class="totales">
              {{totalimpuestor}}
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
                    Razón social: {{registro.nombreclientedetail}}  RIF: {{registro.cedulaclientedetail}}
                  </td>
                  <td>
                    N° DE CONTROL: <span style="font-size: 18px;color: #e00303;font-weight: bolder;">{{registro.numerodocumento}}</span>
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
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { exportFile, Notify } from 'quasar'
import axios from 'axios'
import moment from 'moment'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

import config from '../../config/endpoints'
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
export default defineComponent({
  name: 'TableRegister',
  props: ['idtipodochijo', 'tipodochijo', 'dateFrom', 'dateTo', 'idserviciohijo', 'serviciohijo'],

  setup () {
    return {
      totalbaseg: ref('0,00'),
      totalbaser: ref('0,00'),
      totalbaseigtf: ref('0,00'),
      totalimpuestog: ref('0,00'),
      totalimpuestor: ref('0,00'),
      totalimpuestoigtf: ref('0,00'),
      loading: ref(false),
      term: ref(''),
      viewdetail: ref(false),
      dateHoy: moment().format('DD/MM/YYYY'),
      tx_nombre: sessionStorage.getItem('tx_nombre'),
      co_rol: sessionStorage.getItem('co_rol'),
      idusuario: sessionStorage.getItem('id_usuario'),
      co_sede_seleted: sessionStorage.getItem('co_sede_seleted'),
      initialPagination: {
        page: 1,
        rowsPerPage: 10 // 0 means all rows
      }
    }
  },
  data () {
    return {
      visibleColumns: (this.co_rol === '1' || this.co_rol === '3')
        ? ['rif', 'trackingid', 'tipodocumento', 'fecha', 'nombrecliente', 'iva', 'reducido', 'igtf', 'relacionado', 'detail', 'exportar']
        : (this.co_rol === '2' && !this.co_sede_seleted) ? ['rif', 'tipodocumento', 'numerodocumento', 'fecha', 'nombrecliente', 'iva', 'reducido', 'igtf', 'relacionado', 'detail', 'exportar'] : ['tipodocumento', 'numerodocumento', 'fecha', 'nombrecliente', 'iva', 'reducido', 'igtf', 'relacionado', 'detail', 'exportar'],
      columns: [
        {
          name: 'rif',
          label: 'Cliente emisor',
          align: 'left',
          field: 'razonsocial',
          format: val => `${val}`,
          sortable: true
        },
        { name: 'trackingid', align: 'left', label: 'Referencia', field: 'trackingid', sortable: true },
        { name: 'tipodocumento', align: 'left', label: 'Documento' },
        { name: 'numerodocumento', align: 'left', label: 'N° de control' },
        { name: 'fecha', align: 'left', label: 'Fecha y Hora', field: 'fecha' },
        { name: 'nombrecliente', align: 'left', label: 'Nombre Cliente' },
        { name: 'iva', label: 'IVA' },
        { name: 'reducido', label: 'Reducido' },
        { name: 'igtf', label: 'IGTF' },
        { name: 'relacionado', label: 'Relacionado', field: 'relacionado' },
        { name: 'detail', label: 'Ver', align: 'center' },
        { name: 'exportar', label: 'Exportar', align: 'center' }
      ],
      rows: [],
      tempxml: [],
      rowtempxml: [],
      registro: {}
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
      this.crearbitacora(vm.dateFrom, vm.dateTo, 6)
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
      const tipodoc = vm.tipodochijo === 'Todos' ? 'Documentos' : vm.tipodochijo
      const emisor = vm.idserviciohijo ? ' Emisor ' + vm.serviciohijo : ''
      // eslint-disable-next-line new-cap
      const doc = new jsPDF('l', 'pt')
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(13)
      doc.text('Reporte de ' + tipodoc + '       Desde ' + moment(vm.dateFrom, 'YYYY/MM/DD').format('DD/MM/YYYY') + ' Hasta ' + moment(vm.dateTo, 'YYYY/MM/DD').format('DD/MM/YYYY') + '       ' + emisor, 40, 40)
      doc.autoTable(columns, vm.rows, {
        margin: { top: 60 }
      })
      addFooters(doc)
      doc.save('impredigital.pdf')
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
      const fechas = ' desde el ' + desde + ' hasta el ' + hasta
      const tipodoc = this.idtipodochijo ? ', ' + this.tipodochijo : ''
      observacion += tipodoc
      const cliente = this.idserviciohijo ? ', cliente emisor ' + this.serviciohijo : ''
      observacion += cliente
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
      const body = {
        idtipodocumento: this.idtipodochijo || undefined,
        idserviciosmasivo: this.idserviciohijo || undefined,
        desde: moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD'),
        hasta: moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD'),
        estatus: 1
      }
      console.log('IP: ', this.term)
      if (this.term) {
        this.crearbitacora(moment(this.dateFrom, 'YYYY/MM/DD').format('YYYY-MM-DD'), moment(this.dateTo, 'YYYY/MM/DD').format('YYYY-MM-DD'), 2)
        this.loading = true
        axios.post(ENDPOINT_PATH_V2 + 'reporte/facturas', body).then(async response => {
          // console.log(response.data)
          const datos = response.data.data
          this.rows = []
          this.totalbaseg = 0
          this.totalbaser = 0
          this.totalbaseigtf = 0
          this.totalimpuestog = 0
          this.totalimpuestor = 0
          this.totalimpuestoigtf = 0
          for (const i in datos) {
            // console.log(datos[i])
            const obj = {}
            obj.cod = datos[i].id
            obj.logo = ENDPOINT_PATH_V2 + 'imagen/' + datos[i].rif + '.png'
            obj.idserviciosmasivo = datos[i].idserviciosmasivo
            obj.relacionado = datos[i].relacionado
            obj.razonsocial = datos[i].razonsocial
            obj.rif = datos[i].rif
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

            obj.tasag = datos[i].tasag
            obj.tasaigtf = datos[i].tasaigtf

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
          }
          this.loading = false

          this.totalbaseg = this.completarDecimales(this.totalbaseg)
          this.totalbaser = this.completarDecimales(this.totalbaser)
          this.totalbaseigtf = this.completarDecimales(this.totalbaseigtf)

          this.totalimpuestog = this.completarDecimales(this.totalimpuestog)
          this.totalimpuestor = this.completarDecimales(this.totalimpuestor)
          this.totalimpuestoigtf = this.completarDecimales(this.totalimpuestoigtf)
        }).catch(error => {
          Notify.create('Problemas al listar Facturas ' + error)
        })
      }
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
    updateRegistros () {
      this.listarfacturas()
    },
    exportXMLDetail (reg) {
      this.rowtempxml.push(this.detailXML(reg))
      this.exportXML(this.rowtempxml)
    },
    openDetail (reg) {
      this.rowtempxml = []
      reg.fecha = moment(reg.fecha, 'DD/MM/YYYY HH:mm:ss')
      this.rowtempxml.push(this.detailXML(reg))
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
    }
  },
  watch: {
    idtipodochijo: function (val) {
      this.updateRegistros()
    },
    dateFrom: function (val) {
      this.updateRegistros()
    },
    idserviciohijo: function (val) {
      this.updateRegistros()
    }
  },
  mounted () {
    fetch('https://api.ipify.org?format=json').then(x => x.json()).then(({ ip }) => {
      this.term = ip
      this.updateRegistros()
    /* setInterval(() => {
      this.updateRegistros()
    }, 4000) */
    })
  }
})
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
