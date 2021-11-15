<template>
  <q-card style='width: 100%' flat bordered>
    <q-card-section>
      <div class='text-h6 '>
        <span class='text-grey-7'><i class='fas fa-info-circle'></i>&nbsp;Proyecto: &nbsp;</span>
        <span class='text-h5 text-weight-bold'>{{ propertyDescription.pre_nombre }}</span>
      </div>
    </q-card-section>
    <q-card-section class='q-ma-none q-pa-none'>
      <q-tab-panel name='indices'>

        <div class='row'>
          <div class='col q-mb-md'>

            <q-select dense v-model='selectIndexModel'
                      emit-value
                      map-options
                      :options='propertyIndexOptions'
                      label='Seleccionar' />
          </div>
        </div>
        <div v-if='enableFirstPeriod' class='row'>
          <div class='col q-mb-md'>
            <VButtonDate v-model:date='firstDateModel'
                         v-model:options='firstDateOptions'
                         title='Primer Periodo' />
          </div>
        </div>
        <div v-if='enableSecondPeriod' class='row'>
          <div class='col q-mb-md'>
            <VButtonDate v-model:date='secondDateModel'
                         v-model:options='secondDateOptions'
                         title='Segundo Periodo' />
          </div>
        </div>
        <div v-if='enableAverageSelect' class='row'>
          <div class='col q-mb-md'>
            <q-select dense v-model='selectAverageModel'
                      emit-value
                      map-options
                      :options='optionsAverageSelect'
                      label='Seleccionar tipo' />
          </div>
        </div>

        <StockChart v-if='stockChartEnabled && stockModelData' v-model:data='stockModelData' />

        <vue-highcharts
          v-if='pieChartEnabled'
          type='chart'
          style='width: 100%;'
          :options='chartOptions'
          :redrawOnUpdate='true'
          :oneToOneUpdate='false'
          :animateOnUpdate='true'
        />

        <WeatherComponent v-if='enableWeather'/>
        <Meteogram v-if='enableMeteogram'
                   :data='{lat: propertyDescription.pre_lat,long:propertyDescription.pre_long}' />
        <div v-if='enableLegend'>

          <span class='text-uppercase'>Leyenda</span>
          <q-separator />

          <ul class='list-group border-x-0 rounded-0'>
            <a v-for='(legendItem,index) in indicatorLandPlotLegend' :key='index'
               class='list-group-item li st-group-item-action'
               style='padding: 5px 0px 5px 5px;'>

                  <span class='font-weight-semibold'
                        style='font-size: 15px;'>
                    <span class='badge mr-2'
                          :style="'background-color: '+legendItem.color">
                    &nbsp;&nbsp;
                    </span>
                    &nbsp;&nbsp;
                    <b>{{ legendItem.name }}</b>
                    [{{ legendItem.aux_datos }}]
                  </span><br>
            </a>
          </ul>
          <div class='row'>
            <div class='col '>
              <span class=' text-bold text-h5'>Promedio: </span>
            </div>
            <div class='col text-center q-mt-xs'>
              <span class='text-h5'>{{ indicatorLandPlotLegend[0].promedio }}</span>
            </div>
          </div>
        </div>
      </q-tab-panel>
    </q-card-section>
  </q-card>
</template>

<script lang='ts'>
import DateUtil from 'src/utils/DateUtil';
import VueHighcharts from 'vue3-highcharts';
import Highcharts from 'highcharts';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import stockInit from 'highcharts/modules/stock';
import VButtonDate from 'components/date/VButtonDate.vue';
import StockChart from 'components/charts/StockChart.vue';
import useAverageIndexLandLot from 'src/composables/useAverageIndexLandLot';
import useIndicatorLandPlot from 'src/composables/useIndicatorLandPlot';
import { defineComponent, inject, reactive, ref, watch, watchEffect } from 'vue';
import { useStore } from 'src/store';
import Meteogram from 'components/charts/Meteogram.vue';
import WeatherComponent from 'components/weather/WeatherComponent.vue';

stockInit(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);

const optionsAverageSelect = [
  { label: 'Vegetación [NDVI]', value: 'ndvi' },
  { label: 'Vegetación [NDRE]', value: 'ndre' },
  { label: 'Vegetación [MSAVI2]', value: 'msavi2' },
  { label: 'Estrés hidrico [NDII]', value: 'ndii' },
  { label: 'Estrés hidrico [NDWI]', value: 'ndwi' }
];

const propertyIndexOptions = [
  { label: '<span class="text-caption text-black">Índices</span>', value: null, html: true, disable: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDVI]</span>', value: 'ndvi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDRE]</span>', value: 'ndre', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [MSAVI2]</span>', value: 'msavi2', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDII]</span>', value: 'ndii', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDWI]</span>', value: 'ndwi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Visible [RGB]</span>', value: 'truecolor', html: true },
  {
    label: '<span class="text-caption text-grey-7 q-ml-md">Zonificación de suelos [SRCI]</span>',
    value: 'srci',
    html: true
  },
  { label: '<span class="text-caption text-black">Anomalías</span>', value: null, html: true, disable: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDVI]</span>', value: 'v_ndvi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDRE]</span>', value: 'v_ndre', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [MSAVI2]</span>', value: 'v_msavi2', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDII]</span>', value: 'v_ndii', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDWI]</span>', value: 'v_ndwi', html: true },
  { label: '<span class="text-caption text-black">Gráficos</span>', value: null, html: true, disable: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Promedios </span>', value: 'promedios', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Clima </span>', value: 'clima', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Pronóstico </span>', value: 'pronostico', html: true },
  { label: '<span class="text-caption text-black">Funcionalidades</span>', value: null, html: true, disable: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Comparar </span>', value: 'comparar', html: true }
];

export default defineComponent({
  components: {
    WeatherComponent,
    Meteogram,
    StockChart,
    VButtonDate,

    VueHighcharts
  },
  setup() {
    const { fetchIndexImage, fetchIndexImageLegend, indicatorLandPlotLegend } = useIndicatorLandPlot();
    const plotServiceProvider: any = inject('PlotServiceProvider');
    const propertyCharacteristicTab = ref('indices');
    const splitterModel = ref(12);
    const selectIndexModel: any = ref(null);

    const firstDateModel = ref<any>(null);
    const secondDateModel = ref<any>(null);

    const stockModelData = ref<any>(null);

    const firstDateOptions = ref<Array<string>>([]);
    const secondDateOptions = ref<Array<string>>([]);

    const enableFirstPeriod = ref<any>(false);
    const enableSecondPeriod = ref<any>(false);
    const enableAverageSelect = ref<any>(false);
    const enableLegend = ref<any>(false);
    const enableMeteogram = ref<any>(false);
    const enableWeather = ref<any>(false);

    const stockChartEnabled = ref<any>(false);
    const pieChartEnabled = ref<any>(true);

    const selectAverageModel = ref<any>(null);

    const { getAvgIndex, avgIndex } = useAverageIndexLandLot();

    const dateUtil = new DateUtil();
    const store = useStore();


    let chartOptions = reactive({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          borderColor: null,
          innerSize: 70,
          depth: 100,
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          },
          shadow: false,
          center: ['50%', '50%']
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        }
      },
      series: [{
        name: 'Porcentaje',
        colorByPoint: true,
        size: '75%',
        data: indicatorLandPlotLegend.value,
        dataLabels: {
          enabled: false,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }]
    });

    let propertyDescription = reactive({
      pre_nombre: '',
      cultivo: '',
      variedad: '',
      region: '',
      provincia: '',
      comuna: '',
      area: '',
      pre_id: '',
      pre_lat: 0,
      pre_long: 0
    });

    function selectIndex(index) {
      selectIndexModel.value = index;
    }

    /* Fecha por indice */

    async function loadProjectImageData(selectedIndex, date1, date2, date3) {
      if (selectedIndex === 'promedios' || selectedIndex === 'pronostico' || selectedIndex === 'clima') {
        return;
      }
      let project_id = propertyDescription.pre_id;
      await fetchIndexImage(project_id, selectedIndex, date1, date2, date3);
      await fetchIndexImageLegend(project_id, selectedIndex, date1, date2, date3);
    }

    // Guarda las fechas en el componente y setea el promedio
    function setDatesToComponent(datesArray: Array<any>) {
      firstDateOptions.value = [];
      secondDateOptions.value = [];
      if (datesArray && datesArray.length) {
        datesArray.forEach((value) => {
          let date = value[0];
          firstDateOptions.value.push(dateUtil.utcFormatSpace(date, '/'));
          secondDateOptions.value.push(dateUtil.utcFormatSpace(date, '/'));
        });
        store.commit('project/setFirstPeriodUtc', datesArray.reverse()[0][0]);
        store.commit('project/setPeriodAvg', datesArray.reverse()[0][1]);
        firstDateModel.value = dateUtil.utcFormat(datesArray.reverse()[0][0], 'DD/MM/YYYY'); //Poner la ultima fecha en el input Qselect qdate
        secondDateModel.value = dateUtil.utcFormat(datesArray.reverse()[0][0], 'DD/MM/YYYY'); //Poner la ultima fecha en el input Qselect qdatete
      }
    }


    watch(indicatorLandPlotLegend, (value) => {
      void value;
      Object.assign(chartOptions, {
        ...chartOptions,
        series: [{
          name: 'Porcentaje',
          colorByPoint: true,
          data: indicatorLandPlotLegend.value
        }]
      });

    });

    function toggleFirstPeriod(value) {
      enableFirstPeriod.value = value;
    }

    function toggleAnomalies(value) {
      enableSecondPeriod.value = value;
    }

    function toggleAverages(value) {
      enableAverageSelect.value = value;
      if (value)
        selectAverageModel.value = 'ndvi';
    }

    function toggleStockChart(value) {
      stockChartEnabled.value = value;
    }

    function togglePieChart(value) {
      pieChartEnabled.value = value;
    }

    function toggleLegend(value) {
      enableLegend.value = value;
    }

    function toggleMeteogram(value) {
      enableMeteogram.value = value;
    }

    function toggleWeather(value) {
      enableWeather.value = value;
    }

    function whenIsAnomalies() {
      toggleStockChart(false);
      toggleAnomalies(true);
      toggleAverages(false);
      toggleFirstPeriod(true);
      toggleLegend(true);
      toggleMeteogram(false);
    }

    function whenIsGraphics() {

      toggleAnomalies(false);
      toggleFirstPeriod(false);
      toggleAverages(true);
      toggleStockChart(true);
      togglePieChart(false);
      toggleLegend(false);
      toggleMeteogram(false);
    }

    function whenIsWeather() {

      toggleStockChart(false);
      toggleAnomalies(false);
      toggleAverages(false);
      toggleFirstPeriod(false);
      togglePieChart(false);
      toggleLegend(false);
      toggleMeteogram(false);
      toggleWeather(true);
    }

    function whenIsForecast() {
      toggleMeteogram(true);
      toggleFirstPeriod(false);
      togglePieChart(false);
      toggleAnomalies(false);
      toggleStockChart(false);
      toggleAverages(false);
      toggleLegend(false);
    }

    function whenIsComparison() {

      toggleStockChart(false);
      toggleAnomalies(false);
      toggleAverages(false);
      toggleFirstPeriod(false);
      toggleLegend(false);
      toggleMeteogram(false);
    }

    function whenIsDefault() {

      toggleFirstPeriod(true);
      togglePieChart(true);
      toggleAnomalies(false);
      toggleStockChart(false);
      toggleAverages(false);
      toggleLegend(true);
      toggleMeteogram(false);
      toggleWeather(false);
    }


    /*INDICES*/
    watch(selectIndexModel, async (val: any) => {
      avgIndex.value = [];
      if (val && propertyDescription.pre_id) {
        switch (val) {
          case 'v_ndvi':
            whenIsAnomalies();
            break;
          case  'v_ndre':
            whenIsAnomalies();
            break;
          case  'v_msavi2':
            whenIsAnomalies();
            break;
          case  'v_ndii':
            whenIsAnomalies();
            break;
          case  'v_ndwi':
            whenIsAnomalies();
            break;
          case 'promedios':
            whenIsGraphics();
            return;
            break;
          case 'clima':
            whenIsWeather();
            return;
            break;
          case 'pronostico':
            whenIsForecast();
            return;
            break;
          case 'comparar':
            whenIsComparison();
            break;
          default:
            whenIsDefault();
            break;
        }

        const data = await getAvgIndex(propertyDescription.pre_id, val); //Carga las fechas y promedios
        if (data) {
          setDatesToComponent(data);
        }
      }
    });

    watch(selectAverageModel, async (value) => {
      const data = await getAvgIndex(propertyDescription.pre_id, value); //Carga las fechas y promedios
      if (data) {
        stockModelData.value = data;
        setDatesToComponent(data);
      }
    });

    //Cuando cargan los datos del predio proyecto
    watch(plotServiceProvider, (val) => {
      // selectIndex('');
      selectIndex('ndvi');
      Object.assign(propertyDescription, val.properties);
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchEffect(async () => {
      if (firstDateModel.value) {
        let dateModel = firstDateModel.value;
        let day = dateModel.split('/')[0];
        let month = dateModel.split('/')[1];
        let year = dateModel.split('/')[2];

        let dashDate = dateUtil.dateToFormat(day, month, year, 'YYYY-MM-DD');

        await loadProjectImageData(selectIndexModel.value, dashDate,
          dashDate, dashDate);
      }
    });

    return {
      optionsAverageSelect,
      propertyCharacteristicTab,
      splitterModel,
      chartOptions,
      propertyIndexOptions,
      selectIndexModel,
      plotServiceProvider,
      propertyDescription,
      avgIndex,
      firstDateModel,
      firstDateOptions,
      enableSecondPeriod,
      indicatorLandPlotLegend,
      secondDateModel, secondDateOptions,
      enableAverageSelect, enableFirstPeriod,
      selectAverageModel,
      stockModelData, stockChartEnabled, pieChartEnabled, enableLegend, enableMeteogram, enableWeather

    };
  }
});
</script>

<style scoped>
.highcharts-figure, .highcharts-data-table table {
  min-width: 320px;
  max-width: 660px;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border: 1px solid #EBEBEB;
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

.highcharts-data-table td, .highcharts-data-table th, .highcharts-data-table caption {
  padding: 0.5em;
}

.highcharts-data-table thead tr, .highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}

.highcharts-data-table tr:hover {
  background: #f1f7ff;
}

</style>
