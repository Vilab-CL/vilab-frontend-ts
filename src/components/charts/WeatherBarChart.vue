<template>
  <vue-highcharts
    type='stockChart'
    v-model:options='chartOptions'
    :redrawOnUpdate='true'
    :oneToOneUpdate='false'
    :animateOnUpdate='true'
  />
</template>

<script lang='ts'>
import VueHighcharts from 'vue3-highcharts';
import { computed, defineComponent, reactive, watch } from 'vue';
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

    let chartOptions = reactive(
      {

        rangeSelector: {
          selected: 1
        },

        title: {
          text: ''
        },

        credits: {
          enabled: false
        },

        yAxis: [{ // Primary yAxis
          labels: {
            format: '',
            style: {
              color: '#7cb5ec'
            }
          },
          opposite: false
        }, { // Secondary yAxis
          labels: {
            text: '',
            style: {
              color: '#434348'
            }
          }
        }],

        tooltip: {
          valueSuffix: ' unidades'
        },

        series: [{
          name: 'Grados días',
          type: 'column',
          data: dataModel.value[0].data_maxmin,
          tooltip: {
            valueDecimals: 2
          }
        }, {
          name: 'Grados días acumulados',
          yAxis: 1,
          data: dataModel.value[0].data_avg,
          tooltip: {
            valueDecimals: 2
          }
        }]
      }
    );

    function onUpdated() {
      console.log('chart actualizado');
    }

    watch(dataModel, value => {
      if (value) {
        Object.assign(chartOptions, {
          ...chartOptions,
          series: [{
            name: 'Grados días',
            type: 'column',
            data: value[0].data_maxmin,
            tooltip: {
              valueDecimals: 2
            }
          }, {
            name: 'Grados días acumulados',
            yAxis: 1,
            data: value[0].data_avg,
            tooltip: {
              valueDecimals: 2
            }
          }]
        });
      }
    });

    return { chartOptions, onUpdated };
  }
});
</script>
