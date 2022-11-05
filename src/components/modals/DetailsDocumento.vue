<template>
      <q-dialog v-model="viewdetailhijo" persistent>
        <q-card style="max-width: inherit; width: auto">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="logo_impredigital.jpg">
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

          <q-item>

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
          <q-separator spaced inset="item" />
          <q-card-actions align="right">
            <q-btn label="Cerrar" color="primary" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
</template>

<script>
export default {
  props: ['viewDetail', 'registro', 'cerrar'],

  data () {
    return {
      viewdetailhijo: false
    }
  },
  methods: {
    cerrarHijo () {
      console.log('hijo')
      this.$emit('cerrar')
    }
  },
  watch: {
    viewDetail: function (val) {
      console.log(val)
      this.viewdetailhijo = true
    }
  }
}
</script>
<style>
.text-caption {
    font-size: inherit;
}
</style>
