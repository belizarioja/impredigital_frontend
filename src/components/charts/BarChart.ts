import { defineComponent, ref, h, onMounted } from 'vue'
// import axios from 'axios'
// import { Notify } from 'quasar'
// const config = require('../config/endpoints.js')
// const ENDPOINT_PATH = config.endpoint_path

import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'BarChart',
  components: {
    Bar
  },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
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
      chartData.value.labels = labelgrafica
      chartData.value.datasets = [
        {
          label: 'Base Imponible por mes',
          backgroundColor: '#5096b6',
          data: datagrafica
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
      h(Bar, {
        chartData: chartData.value,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses
      })
  }
})
