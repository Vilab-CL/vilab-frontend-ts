<template>
  <q-card style='width: 100%'>
    <q-card-section>
      <div class='text-h6 '>
        <span class='text-grey-7'>Proyecto: &nbsp;</span>
        <span class='text-h5 text-weight-bold'>{{ propertyDescription.pre_nombre }}</span>
      </div>
    </q-card-section>
    <q-card-section class='q-ma-none q-pa-none'>
      <q-splitter
        v-model='splitterModel'
        horizontal
      >

        <template v-slot:before>
          <q-tabs
            v-model='propertyCharacteristicTab'
            class='text-green'
            no-caps
          >
            <q-tab name='indices' icon='fas fa-chart-area' label='Indices'>
            </q-tab>
            <q-tab name='general' icon='fas fa-home' label='General' />
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels
            v-model='propertyCharacteristicTab'
            animated
            swipeable
            transition-prev='jump-up'
            transition-next='jump-up'
          >
            <q-tab-panel name='indices'>

              <div class='row'>
                <div class='col q-mb-md'>

                  <q-select dense v-model='selectIndexModel'
                            map-options
                            emit-value
                            :options='propertyIndexOptions'
                            label='Seleccionar indices' />

                </div>
            <!--       <template v-if="selectIndexModel.value === 'v_ndvi'">
                        <label>Nombre de Usuario</label>
                      </template>        -->
              </div>
              <div class='row'>
                <div class='col q-mb-md'>
                <template v-if="selectIndexModel === 'v_ndvi' ||selectIndexModel === 'v_ndre' ||selectIndexModel === 'v_msavi2' ||selectIndexModel === 'v_ndii' ||selectIndexModel === 'v_ndwi' ">
                             <VButtonDate v-model:date='propertyDateModel' v-model:options='propertyDateOptions' />
                             <VButtonDate v-model:date='propertyDateModel2' v-model:options='propertyDateOptions' />
                 </template>
                 <template v-else-if="selectIndexModel === 'v_floracion'">
                             <VButtonDate v-model:date='propertyDateModel' v-model:options='propertyDateOptions' />
                             <VButtonDate v-model:date='propertyDateModel2' v-model:options='propertyDateOptions' />
                             <VButtonDate v-model:date='propertyDateModel3' v-model:options='propertyDateOptions' />
                 </template>
                 <template v-else>
                             <VButtonDate v-model:date='propertyDateModel' v-model:options='propertyDateOptions' />
                 </template>

                </div>
              </div>

              <vue-highcharts
                type='chart'
                style='width: 100%;'
                :options='chartOptions'
                :redrawOnUpdate='true'
                :oneToOneUpdate='false'
                :animateOnUpdate='true'
              />
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
                  <span class='text-h6 text-bold'>Promedio: </span>
                </div>
                <div class='col text-center q-mt-xs'>
                  <span>{{ $store.getters['project/getPeriodAvg'] }}</span>
                </div>
              </div>

            </q-tab-panel>
            <q-tab-panel name='general'>
              <span>Información general del predio:</span>
              <ul>
                <li><span class='text-bold '>Cultivo:</span>{{ propertyDescription.cultivo }}</li>
                <li><span class='text-bold '>Variedad: </span>{{ propertyDescription.variedad }}</li>
                <li><span class='text-bold '> Ubicación:</span>
                  <ul>
                    <li><span class='text-bold '>Región:</span> {{ propertyDescription.region }}</li>
                    <li><span class='text-bold '>Provincia:</span> {{ propertyDescription.provincia }}</li>
                    <li><span class='text-bold '>Comuna:</span> {{ propertyDescription.comuna }}</li>
                  </ul>

                </li>
                <li><span class='text-bold '>Area:</span>{{ propertyDescription.area }}</li>
                <li><span class='text-bold '>Fecha de plantación:</span></li>
              </ul>
            </q-tab-panel>
          </q-tab-panels>
        </template>

      </q-splitter>

    </q-card-section>
  </q-card>
</template>

<script lang='ts'>
import VueHighcharts from 'vue3-highcharts';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import { defineComponent, inject, onMounted, reactive, ref, watch,watchEffect } from 'vue';
import VButtonDate from 'components/date/VButtonDate.vue';
import useAverageIndexLandLot from 'src/composables/useAverageIndexLandLot';
import useIndicatorLandPlot from 'src/composables/useIndicatorLandPlot';
import DateUtil from 'src/utils/DateUtil';
import { useStore } from 'src/store';
import moment from 'moment';

stockInit(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);


const propertyIndexOptions = [
  { label: '<span class="text-caption text-black">Índices</span>', value: null, html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDVI]</span>', value: 'ndvi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDRE]</span>', value: 'ndre', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [MSAVI2]</span>', value: 'msavi2', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDII]</span>', value: 'ndii', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDWI]</span>', value: 'ndwi', html: true },
  { label: '<span class="text-caption text-black">Anomalías</span>', value: null, html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDVI]</span>', value: 'v_ndvi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDRE]</span>', value: 'v_ndre', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [MSAVI2]</span>', value: 'v_msavi2', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDII]</span>', value: 'v_ndii', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDWI]</span>', value: 'v_ndwi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Floración</span>', value: 'v_floracion', html: true },
];

export default defineComponent({
  components: {
    VButtonDate,

    VueHighcharts
  },
  setup() {
    const { fetchIndexImage, fetchIndexImageLegend, indicatorLandPlotLegend } = useIndicatorLandPlot();
    let chartOptions = reactive({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        margin: [0, 0, 0, 0],
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
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        },

        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        }
      },
      series: [{
        name: 'Porcentaje',
        colorByPoint: true,
        data: indicatorLandPlotLegend.value
      }]
    });
    const plotServiceProvider: any = inject('PlotServiceProvider');
    const propertyCharacteristicTab = ref('indices');
    const splitterModel = ref(12);
    const selectIndexModel: any = ref(null);

    const propertyDateModel = ref<any>(null);
    const propertyDateModel2 = ref<any>(null);
    const propertyDateModel3 = ref<any>(null);
    const propertyDateOptions = ref<Array<string>>([]);


    const { getAvgIndex, avgIndex } = useAverageIndexLandLot();

    const dateUtil = new DateUtil();
    const store = useStore();

    let propertyDescription = reactive({
      pre_nombre: '',
      cultivo: '',
      variedad: '',
      region: '',
      provincia: '',
      comuna: '',
      area: '',
      pre_id: ''
    });
    let projectDate = {
      date1: {
        normalizeWithSlash: '',
        normalizeWithDash: ''
      }
    };


    //Cuando cargan los datos del predio proyecto
    watch(plotServiceProvider,  (val) => {
      selectIndex('');
      selectIndex('ndvi');
      Object.assign(propertyDescription, val.properties);
      for (const valKey in propertyDescription) {
        if (!propertyDescription[valKey]) propertyDescription[valKey] = '-';
      }
      // let lastDate=await setDatesToComponent(data); // Guarda las fechas en el componente QDate
      // propertyDateModel.value=dateUtil.utcFormat(lastDate, 'DD/MM/YYYY')
    });
    function selectIndex(index) {
      selectIndexModel.value = index;
      }
    /*INDICES*/
    watch(selectIndexModel, async (val: any) => {
      avgIndex.value = [];
      if (val && propertyDescription.pre_id) {
        if(val ==='v_ndvi' ||val ==='v_ndre' ||val ==='v_msavi2' ||val ==='v_ndii' ||val ==='v_ndwi'){
          val=val.substr(2);
        }else if ( val ==='v_floracion'){
          val = 'ndvi';
        }
        const data = await getAvgIndex(propertyDescription.pre_id, val); //Carga las fechas y promedios
        setDatesToComponent(data)
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    watchEffect(async ()=>{
      if ( selectIndexModel.value === 'v_ndvi' ||selectIndexModel.value === 'v_ndre' ||selectIndexModel.value === 'v_msavi2' ||selectIndexModel.value === 'v_ndii' ||selectIndexModel.value === 'v_ndwi'  ) {
        let dateModel=propertyDateModel.value
        let day=dateModel.split('/')[0]
        let month=dateModel.split('/')[1]
        let year=dateModel.split('/')[2]
        let dateModel2=propertyDateModel2.value
        let day2=dateModel2.split('/')[0]
        let month2=dateModel2.split('/')[1]
        let year2=dateModel2.split('/')[2]
        let dashDate=dateUtil.dateToFormat(day,month,year,'YYYY-MM-DD')
        let dashDate2=dateUtil.dateToFormat(day2,month2,year2,'YYYY-MM-DD')
        await loadProjectImageData(selectIndexModel.value, dashDate,
          dashDate2, dashDate);
      }else if (selectIndexModel.value === 'v_floracion'){
        let dateModel=propertyDateModel.value
        let day=dateModel.split('/')[0]
        let month=dateModel.split('/')[1]
        let year=dateModel.split('/')[2]
        let dateModel2=propertyDateModel2.value
        let day2=dateModel2.split('/')[0]
        let month2=dateModel2.split('/')[1]
        let year2=dateModel2.split('/')[2]
        let dateModel3=propertyDateModel3.value
        let day3=dateModel3.split('/')[0]
        let month3=dateModel3.split('/')[1]
        let year3=dateModel3.split('/')[2]
        let dashDate=dateUtil.dateToFormat(day,month,year,'YYYY-MM-DD')
        let dashDate2=dateUtil.dateToFormat(day2,month2,year2,'YYYY-MM-DD')
        let dashDate3=dateUtil.dateToFormat(day3,month3,year3,'YYYY-MM-DD')
        await loadProjectImageData(selectIndexModel.value, dashDate,
          dashDate2, dashDate3);
      }else{
        let dateModel=propertyDateModel.value
        let day=dateModel.split('/')[0]
        let month=dateModel.split('/')[1]
        let year=dateModel.split('/')[2]
        let dashDate=dateUtil.dateToFormat(day,month,year,'YYYY-MM-DD')
        await loadProjectImageData(selectIndexModel.value, dashDate,
          dashDate, dashDate);
      }
    })
    /* Fecha por indice */

    async function loadProjectImageData(selectedIndex, date1, date2, date3) {
      let project_id=propertyDescription.pre_id
      await fetchIndexImage(project_id, selectedIndex, date1, date2, date3);
      await fetchIndexImageLegend(project_id, selectedIndex, date1, date2, date3);
    }

    // Guarda las fechas en el componente y setea el promedio
     function setDatesToComponent(datesArray: Array<any>) {
      propertyDateModel.value = '';
      propertyDateModel2.value = '';
      propertyDateModel3.value = ''; // QInput con la fecha
      propertyDateOptions.value = [];
      if (datesArray && datesArray.length) {
        datesArray.forEach((value) => {
          let date = value[0];
          propertyDateOptions.value.push(dateUtil.utcFormatSpace(date, '/'));
        });
        store.commit('project/setFirstPeriodUtc', datesArray.reverse()[0][0]);
        store.commit('project/setPeriodAvg', datesArray.reverse()[0][1]);
        propertyDateModel.value = dateUtil.utcFormat(datesArray.reverse()[0][0], 'DD/MM/YYYY');
        propertyDateModel2.value = propertyDateModel.value;
        propertyDateModel3.value = propertyDateModel.value; //Poner la ultima fecha en el input Qselect qdate
        return datesArray.reverse()[0][0]; //Retornar la fecha mas reciente
      }
      return;
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

    return {
      propertyCharacteristicTab,
      splitterModel,
      chartOptions,
      propertyIndexOptions,
      selectIndexModel,
      plotServiceProvider,
      propertyDescription,
      avgIndex,
      propertyDateModel,
      propertyDateModel2,
      propertyDateModel3,
      propertyDateOptions,

      indicatorLandPlotLegend
    };
  }
});
</script>
