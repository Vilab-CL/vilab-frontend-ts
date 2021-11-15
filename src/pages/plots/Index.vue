<template>
  <q-page padding>

    <div class='row q-mb-md justify-between'>

      <ViewSubtitle class='col col-md-2 col-xs-12 ' />

      <ViewProjectTitle class='col col-md-2 col-xs-12' title='Lorem ipsum dolor sit ametsunt tempore ullam voluptatibus.'/>
      <div class='col col-md-2 col-xs-12'>
        <div class='text-bold '>
          <span class='text-green  text-h4'>{{ totalPlots }}</span>
          Proyectos
        </div>
        <div class='text-bold '>
          <span class='text-green  text-h4' style='text-overflow: ellipsis; overflow:hidden'>{{ totalHectare }}</span>
          Hectáreas
        </div>
      </div>

    </div>
    <q-separator />
    <br>
    <div class='row justify-between q-col-gutter-xs'>
      <div class='col-2 col-md-2 col-xs-12'>
        <QSelect label='Temporada' :options='projectOptions.season' map-options dense rounded standout
                 v-model='projectOptionsModel.season' bg-color='grey-3'
                 label-color='black'>
        </QSelect>
      </div>
      <div class='col-2 col-md-2 col-xs-12'>
        <QSelect :options='projectOptions.options' label='Opciones'
                 v-model='projectOptionsModel.options' bg-color='grey-3' label-color='black'
                 multiple
                 rounded
                 standout
                 emit-value
                 map-options
                 dense
        >
          <template v-slot:option='{ itemProps, opt, selected, toggleOption }'>
            <q-item v-bind='itemProps'>
              <q-item-section>
                <q-item-label v-html='opt.label' />
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value='selected' @update:model-value='toggleOption(opt)' />
              </q-item-section>
            </q-item>
          </template>
        </QSelect>
      </div>
    </div>
    <br>

    <q-separator />
    <br>
    <div class='row q-col-gutter-md'>
      <div v-if='showProjectTable' class='col col-3 col-md-3 col-sm-12 col-xs-12'>
        <ProjectsTable style='height:800px;' @go-location='goLocation' />
      </div>
      <div class='col ' style='height:800px;'>
        <l-map ref='mapRef' id='mapRef'
               :options='{  measureControl: true}'
               style='width: 100%' :zoom='zoom' @ready='onLeafletReady'
               @click='onLeafletClick'>
          <template v-if='leafletReady'>
            <l-tile-layer url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                          :max-zoom='20' layer-type='base'>
              <l-popup :lat-lng='mapPopUp.coord' :content='mapPopUp.content'></l-popup>
            </l-tile-layer>
            <l-geo-json :geojson='geoJSONObject' :options='geoJSONOptions' />
            <l-control position='topright'>
              <VButtonIcon round class='bg-white text-blue-7' icon-name='fas fa-map-pin' tooltip='Agregar'>
              </VButtonIcon>
            </l-control>
            <l-control position='topright'>
              <VButtonIcon round class='bg-white text-blue-7 ' icon-name='layers'>
              </VButtonIcon>
            </l-control>
            <l-control position='topright'>
              <VButtonIcon round class='bg-white text-blue-7' icon-name='open_in_full'>
              </VButtonIcon>
            </l-control>
            <l-control position='topright'>
              <VButtonIcon round class='bg-white text-blue-7' icon-name='my_location'
                           @click='navigateToCoord(geolocation.latitude,geolocation.longitude)'>
              </VButtonIcon>
            </l-control>
            <l-control position='topright'>
              <VButtonIcon round class='bg-white text-blue-7' icon-name='fas fa-ruler' tooltip='Medir'>
              </VButtonIcon>
            </l-control>
            <l-control position='topright'>
              <VButtonIcon round class='bg-white text-blue-7' icon-name='fas fa-expand' @click='doFullscreen'
                           tooltip='Pantalla completa'>
              </VButtonIcon>
            </l-control>

            <l-image-overlay v-if="$store.getters['project/getProjectIndexImage'].png"
                             :url="$store.getters['project/getProjectIndexImage'].png"
                             :bounds="$store.getters['project/getProjectIndexImage'].bounds"></l-image-overlay>


            <l-marker v-for='(feature,index) in plotData' :key='index'
                      :lat-lng='[feature.geometry.coordinates[1],feature.geometry.coordinates[0]]'
                      @click='markerClick(feature)'>
              <l-popup>
                <h5><b>{{ feature.properties.pre_nombre }}</b></h5>
                <b>Comuna:</b> {{ feature.properties.comuna }}<br>
                <b>Cultivo:</b> {{ feature.properties.cultivo }}<br>
                <b>Variedad:</b> {{ feature.properties.variedad }}<br>
                <b>Región:</b> {{ feature.properties.region }}<br>
                <b>Provincia:</b> {{ feature.properties.provincia }}
              </l-popup>
            </l-marker>
          </template>
        </l-map>
      </div>
      <div class='col col-3 col-md-3 col-sm-12 col-xs-12'>
          <PropertyCharacteristic />
      </div>
    </div>
  </q-page>
</template>

<script lang='ts'>

import ViewSubtitle from 'components/subtitle/ViewSubtitle.vue';
import HighCharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { LControl, LGeoJson, LImageOverlay, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { defineComponent, nextTick, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import useCustomRoute from 'src/composables/useCustomRoute';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';
import PropertyCharacteristic from 'components/plot/PropertyCharacteristic.vue';
import VButtonIcon from 'components/buttons/VButtonIcon.vue';
import useLandLot from 'src/composables/useLandLot';
import useProjects from 'src/composables/useProjects';
import useGeolocation from 'src/composables/useGeolocation';
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet/dist/leaflet.css';
import ProjectsTable from 'components/plot/ProjectsTable.vue';
import 'src/leaflet.measure.js';
import ViewProjectTitle from 'components/subtitle/ViewProjectTitle.vue';
import { useStore } from 'src/store';

const L = require('leaflet');

HighchartsMore(HighCharts);

const plotColumns = [
  { name: 'plot', align: 'center', label: 'PREDIO', field: row => row.properties.pre_nombre, sortable: true },
  { name: 'crop', align: 'center', label: 'CULTIVO', field: row => row.properties.cultivo, sortable: false }
];

const plotPagination = {
  sortBy: 'desc',
  descending: false,
  rowsPerPage: 15
};

export default defineComponent({
  name: 'PlotIndex',
  components: {
    ViewProjectTitle,
    ViewSubtitle,
    ProjectsTable,
    VButtonIcon,
    PropertyCharacteristic,
    LMap,
    LGeoJson,
    LTileLayer,
    LControl, LPopup,
    LMarker, LImageOverlay
  },
  setup(props) {
    void props;
    const state = reactive({
      fullscreen: false,
      teleport: true,
      pageOnly: false
    });
    let leafletObject = ref<any>(null);
    let leafletReady = ref(false);
    let geoJSONObject = ref<any>(null);
    let geoJSONOptions = reactive({
      pointToLayer: Object,
      style: {
        'color': '#FFFFFF',
        'weight': 2,
        'opacity': 1,
        'fillOpacity': 0
      }
    });
    const plotData = ref();
    const showProjectTable = ref(true);
    const geolocationPlot = ref([
      -32.227609138, -70.824386972]);
    const zoom = ref(7);
    const mapRef = ref();
    const filter = ref();
    const markerPopup = ref();
    const totalPlots = ref();
    const totalHectare = ref();
    const projectKml = ref<any>(null);
    const projectOptions = {
      season: [{ label: 'Temporada actual', value: 1 }],
      options: [
        { label: 'Mostrar lista', value: 1 },
        { label: 'Mostrar marcadores', value: 2 },
        { label: 'Mostrar proyecto', value: 3 }
      ]
    };
    const projectOptionsModel = reactive<any>({
      season: 1,
      options: []
    });

    let plotsFeatureCollection = ref<IFeatureCollectionGeoJson>({});

    const { toRoute } = useCustomRoute();
    const { landLot } = useLandLot();

    const useProject = new useProjects();

    function addPlot() {
      toRoute('plot.add');
    }

    async function checkOptions() {
      if (projectOptionsModel.options.includes(1)) { //desactivar mostrar lista
        showProjectTable.value = true;
      } else if (!projectOptionsModel.options.includes(1)) {
        showProjectTable.value = false;
      }
      if (projectOptionsModel.options.includes(2)) { //desactivar mostrar marcadores

      }
      if (projectOptionsModel.options.includes(3)) { //mostrar predio
        geoJSONObject.value = await useProject.fetchProjectKml(landLot.value?.properties?.pre_id);
      } else if (!projectOptionsModel.options.includes(3)) {
        cleanGeoJSON();
      }
    }

    watch(projectOptionsModel, async (value: any) => {
      void value;
      await checkOptions();
      setTimeout(() => {
        mapRef.value.leafletObject.invalidateSize(true);
      }, 100);
    });
    const { initGeolocationProcess, geolocation } = useGeolocation();
    onMounted(async () => {
      projectOptionsModel.options = [1, 2];//Opciones seleccionadas por defecto
      await useProject.getList();
      const plotResponse = useProject.getPlotResponse();
      totalPlots.value = plotResponse.value.datos_usuario[0].cantidad;
      totalHectare.value = plotResponse.value.datos_usuario[0].hectareas;
      plotsFeatureCollection.value = useProject.getPlotFeatureCollection(); // Obtener FeatureCollection de predios
      plotData.value = plotsFeatureCollection.value.features;
      goToLeafletRoute(plotData.value[0]); // Seleccionar primer valor del array de predios
      initGeolocationProcess();

    });

    function goToLeafletRoute(projectValue) {
      let coord = [projectValue.properties.pre_lat, projectValue.properties.pre_long];
      mapRef.value.leafletObject.setView(coord, 15);
      landLot.value = projectValue;
    }

    function navigateToCoord(lat: number, long: number) {
      mapRef.value.leafletObject.setView([lat, long], 15);
    }


    function cleanGeoJSON() {
      geoJSONObject.value = {
        features: [],
        type: 'FeatureCollection'
      };
    }

    function onLeafletReady() {

      void nextTick(() => {
        leafletObject.value = mapRef.value.leafletObject;
        leafletReady.value = true;
        // L.control.measure({
        //   position: 'topleft'
        // }).addTo(leafletObject.value);

        // let markers = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 10 });

      });
    }

    function doFullscreen() {
      if (!document.fullscreenElement) {
        let map: any = document.getElementById('mapRef');
        void map.requestFullscreen();
        return;
      }

      void document.exitFullscreen();
    }

    function onLeafletClick(e: any) {

      if (e.latlng) {
        console.log(e.latlng);
      }
    }

    const store=useStore()
    async function goLocation(projectObj) {
      geolocationPlot.value = [];
      mapRef.value.leafletObject.setView([projectObj.pre_lat, projectObj.pre_long], 15);
      landLot.value = { properties: projectObj };
      // eslint-disable-next-line @typescript-eslint/await-thenable,@typescript-eslint/no-misused-promises
      setTimeout(await checkOptions, 200);
    }

    function markerClick(obj) {
      landLot.value = {};
      landLot.value = obj;
    }

//Inject to children
    provide('PlotServiceProvider', landLot);

    return {
      doFullscreen,
      addPlot,
      ...toRefs(state),
      plotsFeatureCollection, plotColumns,
      plotData, plotPagination,
      geolocationPlot,
      zoom,
      mapRef,
      filter,
      markerPopup,
      totalPlots,
      totalHectare,
      landLot,
      projectOptions,
      projectOptionsModel,
      projectKml,
      geoJSONObject,
      geoJSONOptions,
      onLeafletReady,
      onLeafletClick,
      leafletReady,
      navigateToCoord,
      geolocation,
      goLocation,
      showProjectTable,
      markerClick
    };
  }
});
</script>

<style>
@import '~leaflet/dist/leaflet.css';
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
@import "~leaflet-measure/dist/leaflet-measure.css";

.vue-highcharts {
  width: 100%;
}
</style>
