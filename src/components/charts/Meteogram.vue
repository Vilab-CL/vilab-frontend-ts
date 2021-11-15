<template>

  <div id='div_grafico_pronostico'>
    <div style='height: 400px;width: 100%' id='container_pronostico' :key='forecast'></div>
    <div id='loading' v-if='loading'>
      <i class='fa fa-spinner fa-spin'></i> Loading data from external source
    </div>
  </div>

</template>
<script lang='js'>
import 'highcharts';
import { defineComponent, onMounted, reactive, ref } from 'vue';
import Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import winbarb from 'highcharts/modules/windbarb';
import { Meteogram } from './meteogram';
import stockInit from 'highcharts/modules/stock';

stockInit(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);
winbarb(Highcharts);

export default defineComponent({
  // name: 'ComponentName',
  props:{
    data:{
      type:Object
    }
  },
  setup(props) {

    const dataModel = ref(null);
    const loading = ref(null);
    const forecast = ref(0);
    onMounted(() => {

      const r = new ResizeObserver((entries) => {
        forecast.value = forecast.value + 1;
      });

      loading.value = true;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      let url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${props.data.lat}&lon=${props.data.long}`;
      Highcharts.ajax({
        url,
        dataType: 'json',
        success: json => {
          loading.value = false;
          window.meteogram = new Meteogram(json, 'container_pronostico');
        },
        error: Meteogram.prototype.error,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    });

    let chartOptions = reactive({

      rangeSelector: {
        selected: 1
      },

      title: {
        text: ''
      },

      series: [{
        name: 'Valor',
        data: dataModel.value,
        tooltip: {
          valueDecimals: 2
        }
      }]
    });


    return {
      chartOptions,
      dataModel,
      loading,
      forecast
    };
  }

});
</script>

<style scoped>
#container {
  max-width: 800px;
  min-width: 380px;
  height: 310px;
  margin: 0 auto;
}

#loading {
  margin-top: 100px;
  text-align: center;
}

.highcharts-figure,
.highcharts-data-table table {
  min-width: 350px;
  max-width: 800px;
  margin: 1em auto;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
}

</style>
