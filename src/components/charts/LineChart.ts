import { defineComponent, ref, h, onMounted } from 'vue'
// import axios from 'axios'
// import { Notify } from 'quasar'
// const config = require('../config/endpoints.js')
// const ENDPOINT_PATH = config.endpoint_path

import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineElement, PointElement)

export default defineComponent({
  name: 'BarChart',
  components: {
    Line
  },
  props: {
    chartId: {
      type: String,
      default: 'Line-chart'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    }
  },
  setup (props) {
    const chartData = ref({
      labels: [],
      datasets: []
    })
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }
    function fillData () {
      const labelgrafica = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
      ]
      const datagrafica = [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
      const datagrafica2 = [39, 80, 40, 20, 12, 11, 40, 20, 12, 39, 10, 40]
      const datagrafica3 = [20, 10, 6, 30, 5, 20, 44, 70, 20, 80, 20, 4]
      chartData.value.labels = labelgrafica
      chartData.value.datasets = [
        {
          label: 'IVA',
          backgroundColor: '#9C27B0',
          data: datagrafica
        },
        {
          label: 'IGTF',
          backgroundColor: '#277dc1',
          data: datagrafica2
        },
        {
          label: 'Reducido',
          backgroundColor: '#F2C037',
          data: datagrafica3
        }
      ]
      /* const updatedChartData = {
        labels: [],
        datasets: [
          {
            data: []
          }
        ]
      }
      chartData.value = { ...updatedChartData } */
    }
    onMounted(() => {
      console.log('Component mounted!')
      fillData()
    })
    return () =>
      h(Line, {
        chartData: chartData.value,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses
      })
  }
})
