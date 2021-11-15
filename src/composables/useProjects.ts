import { api } from 'boot/axios';
import { reactive, Ref } from 'vue';
import { IPlotResponse } from 'src/interfaces/IPlotResponse';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';
import { IPlotPaginateResponse } from 'src/interfaces/IPlotPaginateResponse';
import qs from 'qs';
import { IProjectIndexImage } from 'src/interfaces/IProjectIndexImage';

export default class useProjects {

  protected plot: Ref<IPlotResponse>;
  protected plotPaginate: Ref<IPlotPaginateResponse>;
  protected projectIndexImage: Ref<IProjectIndexImage>;
  protected projectKml: Ref<any>;
  protected projectDescription: Ref<any>;
  protected projectWeather: Ref<any>;

  // private plots: Ref<Array<any>>;

  constructor() {
    this.plot = reactive<any>({});
    this.plotPaginate = reactive<any>({});
    this.projectIndexImage = reactive<any>({});
    this.projectKml = reactive<any>({});
    this.projectDescription = reactive<any>({});
    this.projectWeather = reactive<any>({});
  }


  async getList() {
    const { data } = await api.get('predios');
    this.plot.value = data;

  }

  getPlotFeatureCollection(): IFeatureCollectionGeoJson {
    return this.plot.value?.geojson_predios;
  }

  getPlotResponse() {
    return this.plot;
  }

  // await useProject.fetchProjectListPaginate(15, 55, 1, 'asc', ''); // Obtener predios por paginacion
  async fetchProjectListPaginate(length, start, order_column, order_dir, search_value) {
    const { data } = await api.post('predios/predios_ajax', qs.stringify({
      length,
      start,
      order_column,
      order_dir,
      search_value
    }));
    this.plotPaginate.value = data;
    return data;
  }

  async fetchProjectKml(project_id) {
    if (project_id) {
      const { data } = await api.post('predios/encontrar_kml_predio', qs.stringify({
        pre_id: project_id
      }));
      this.projectKml.value = data.predio_kml;
      return data.predio_kml;
    }
  }

  async fetchProjectById(project_id) {
    if (project_id) {
      const { data } = await api.post('predios/encontrar_datos_predio', qs.stringify({
        pre_id: project_id
      }));
      this.projectDescription.value = data;
      return data;
    }
  }


  async fetchWeather(project_id, type, graphic_type, inf, sup) {

    if (project_id && type && graphic_type && inf && sup) {
      const { data } = await api.post('predios/clima', qs.stringify({
        pre_id: project_id,
        tipo: type,
        tipo_grafico: graphic_type,
        inf: inf,
        sup: sup
      }));
      this.projectWeather.value = data;
      return data;
    }
  }

}
