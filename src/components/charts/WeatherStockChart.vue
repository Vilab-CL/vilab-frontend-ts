<template>

  <vue-highcharts
    type='stockChart'
    v-model:options='chartOptions'
    :redrawOnUpdate='true'
    :oneToOneUpdate='false'
    :animateOnUpdate='true'
    :updated='onUpdated'
    :key='keyChart'
  />
</template>

<script lang='ts'>
import VueHighcharts from 'vue3-highcharts';
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';

import stockInit from 'highcharts/modules/stock';

exportingInit(Highcharts);
stockInit(Highcharts);
export default defineComponent({
  // name: 'ComponentName',
  components: {
    VueHighcharts
  },
  props: {
    data: [Array, Object]
  },
  setup(props, { emit }) {

    const dataModel = computed<any>({
      get() {
        return props.data;
      },
      set(value) {
        emit('update:data', value);
      }
    });

    const keyChart = ref(0);
    let chartOptions = reactive({

      title: {
        text: ''
      },

      xAxis: {
        type: 'datetime'
      },

      yAxis: {
        title: {
          text: null
        }
      },

      credits: {
        enabled: false
      },

      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: ' °C'
      },

      legend: { enabled: false },

      series: [
        {
          name: ' asd',
          data: dataModel.value[0].data_avg,
          zIndex: 1,
          marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: '#7cb5ec'
          }
        }, {
          name: ' rangos sd',
          data: dataModel.value[0].data_maxmin,
          type: 'arearange',
          lineWidth: 0,
          linkedTo: ':previous',
          color: '#7cb5ec',
          fillOpacity: 0.3,
          zIndex: 0,
          marker: {
            enabled: false
          }
        }
      ]
    });

    function onUpdated() {
      console.log('chart actualizado');
    }

    watch(dataModel, value => {
      if (value) {
        Object.assign(chartOptions, {
          ...chartOptions,
          series: [
            {
              name: 'Velocidad del viento promedio:',
              data: value[0].data_avg,
              zIndex: 1,
              marker: {
                fillColor: 'white',
                lineWidth: 2,
                lineColor: '#7cb5ec'
              }
            }, {
              name: 'Rango (mínima y máxima)Ñ',
              data: value[0].data_maxmin,
              type: 'arearange',
              lineWidth: 0,
              linkedTo: ':previous',
              color: '#7cb5ec',
              fillOpacity: 0.3,
              zIndex: 0,
              marker: {
                enabled: false
              }
            }
          ]
        });
      }
    });

    return { chartOptions, onUpdated, keyChart };
  }
});
</script>
