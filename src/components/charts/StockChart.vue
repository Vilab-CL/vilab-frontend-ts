<template>

  <vue-highcharts
    type='stockChart'
    :options='chartOptions'
    :redrawOnUpdate='true'
    :oneToOneUpdate='false'
    :animateOnUpdate='true'
    :updated='onUpdated'
    :key='keyChart'
  />
</template>

<script lang='ts'>
import VueHighcharts from 'vue3-highcharts';
import { computed, defineComponent, reactive, ref } from 'vue';
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

    const dataModel = computed({
      get() {
        return props.data;
      },
      set(value) {
        emit('update:data', value);
      }
    });

    const keyChart = ref(0);
    let chartOptions = reactive({

      rangeSelector: {
        selected: 1
      },

      title: {
        text: ''
      },

      series: [{
        name: 'Promedio',
        data: dataModel,
        tooltip: {
          valueDecimals: 2
        }
      }]
    });

    function onUpdated() {
      console.log('chart actualizado');
    }

    return { chartOptions, onUpdated, keyChart };
  }
});
</script>
