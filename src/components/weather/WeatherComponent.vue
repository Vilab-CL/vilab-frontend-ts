<template>
  <q-select v-model='variant' :options='variantList' map-options emit-value />
  <q-select v-model='graphic' :options='graphicType' map-options emit-value />
  <br>
  <div class='row q-col-gutter-md'>
    <div class='col'>
      <VButtonDate v-model:date='firstDate' mask='DD/MM/YYYY'
      />
    </div>
    <div class='col'>
      <VButtonDate v-model:date='secondDate' mask='DD/MM/YYYY'
      />
    </div>
  </div>

  <WeatherStockChart v-if='stockData && !enableDayDegree && !enableLineChart' v-model:data='stockData' />
  <WeatherBarChart v-if='stockData && enableDayDegree && !enableLineChart' v-model:data='stockData'/>
  <WeatherLineChart v-if='stockData && enableLineChart'  v-model:data='stockData' />
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, watch, watchEffect } from 'vue';
import VButtonDate from 'components/date/VButtonDate.vue';
import { date } from 'quasar';
import useProjects from 'src/composables/useProjects';
import { useStore } from 'src/store';
import WeatherStockChart from 'components/charts/WeatherStockChart.vue';
import moment from 'moment';
import WeatherBarChart from 'components/charts/WeatherBarChart.vue';
import WeatherLineChart from 'components/charts/WeatherLineChart.vue';

const variantList = [
  { label: 'Temperatura', value: 'g_clima_temperatura' },
  { label: 'Humedad', value: 'g_clima_humedad' },
  { label: 'Precipitaciones', value: 'g_clima_precipitacion' },
  { label: 'Radiación solar', value: 'g_clima_radiacion' },
  { label: 'Velocidad del viento', value: 'g_clima_velocidad' },
  { label: 'Grados dias', value: 'g_clima_grados' },
  { label: 'Horas frio', value: 'g_clima_frio' },
  { label: 'Evapotranspiración', value: 'g_clima_evap' }
];

const graphicType = [

  { label: 'Gráfico: diario', value: 1 },
  { label: 'Gráfico: horario', value: 2 }
];
export default defineComponent({
  components: { WeatherLineChart, WeatherBarChart, WeatherStockChart, VButtonDate },
  // name: 'ComponentName'

  setup() {
    const variant = ref('');
    const graphic = ref(0);
    const firstDate = ref(date.formatDate(date.subtractFromDate(Date.now(), { days: 8 }), 'DD/MM/YYYY'));
    const secondDate = ref(date.formatDate(Date.now(), 'DD/MM/YYYY'));
    const stockData = ref<any>(null);
    const enableDayDegree = ref<any>(false);
    const enableLineChart = ref<any>(false);

    const useProject = new useProjects();
    const store = useStore();
    onMounted(() => {
      variant.value = 'g_clima_temperatura';
      graphic.value = 1;
    });

    function toggleDayDegree(value){
      enableDayDegree.value=value
    }
    function toggleLineChart(value){
      enableLineChart.value=value
    }
    watch(variant,(value)=>{
      if (value==='g_clima_grados'){
        toggleDayDegree(true)
        return;
      }else if(value==='g_clima_frio'){
        toggleLineChart(true)
        return;
      }
      toggleLineChart(false)
      toggleDayDegree(false)
      return;
    })
    watchEffect(() => {
      updateWeatherData();
    });

    function updateWeatherData() {
      let pre_id = store.getters['project/getProjectDescription'].geojson.features[0].properties.pre_id;
      void useProject.fetchWeather(pre_id, variant.value, graphic.value,
        moment(firstDate.value, 'DD-MM-YYYYY').format('YYYY-MM-DD'),
        moment(secondDate.value, 'DD-MM-YYYYY').format('YYYY-MM-DD')).then((value) => {
        if (value)
          stockData.value = value;
      });
    }

    return {
      variant, graphic, variantList, graphicType,
      firstDate, secondDate, stockData,enableDayDegree, enableLineChart
    };
  }
});
</script>
