<template>

  <div style='max-width: 100%'>
    <q-list bordered>

      <q-item-label class='text-h5' header><b>Proyectos</b>

      </q-item-label>
      <q-item class='row'>
        <QInput class='col-md' filled v-model='projectListAtts.searchValue' dense label='Buscar' clearable
                @change='searchValue'
                @keypress.enter='searchValue'>
          <template v-slot:append>
            <q-btn round dense flat icon='fas fa-search' @click='searchValue' />
          </template>
        </QInput>
      </q-item>
      <q-separator />

      <q-item v-for='(value,index) in projectListItems' :key='index' clickable v-ripple @click='goToProject(value)'>
        <q-item-section avatar class='item-section__png' @click='viewTooltip'>
          <q-avatar rounded>
            <q-tooltip>Click para ver descripción</q-tooltip>
            <img :src="'data:image/png;base64,'+value.png">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class='text-blue-6'>{{ value.pre_nombre }}</q-item-label>
          <q-item-label caption>
            Cultivo: <b>{{ value.cul_nombre }}</b>
            <span v-if='value.var_nombre'> Variedad: <b>{{ value.var_nombre }}</b></span>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item>
        <q-item-section>
          <q-item-label caption>
            Mostrando {{ projectListExtra.selected }} de un total de {{ projectListExtra.total }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div class='q-pa-lg flex flex-center'>
      <q-pagination
        direction-links
        v-model='currentPage'
        color='grey-9'
        :max='maxPages'
        :max-pages='4'
        boundary-numbers
      />
    </div>
  </div>
  <TooltipProjectInfo v-model='tooltipOpen' />

</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, watch } from 'vue';
import useProjects from 'src/composables/useProjects';
import TooltipProjectInfo from 'components/dialogs/TooltipProjectInfo.vue';
import { useStore } from 'src/store';

export interface IProjectItem {
  cul_nombre: '',
  pre_culid: '',
  pre_cul_type: '',
  pre_id: '',
  pre_lat: '',
  pre_long: '',
  pre_nombre: '',
  var_nombre: '',
  png: ''
}

export default defineComponent({
  name: 'ProjectsTable',
  components: { TooltipProjectInfo },
  setup(props, { emit }) {
    void props;
    const projectListAtts = reactive({
      length: 10,
      start: 0,
      orderColumn: 1,
      orderDir: 'desc',
      searchValue: ''
    });

    const projectListItems = ref<Array<IProjectItem>>([]);
    const projectListExtra = reactive({
      total: 0,
      totalFiltered: 0,
      selected: 0,
      textFiltered: ''
    });
    const currentPage = ref(1);
    const maxPages = ref(0);

    const tooltipOpen = ref(false);

    const useProject = new useProjects;
    onMounted(() => {
      void updateProjectData();
    });

    watch(currentPage, (value) => {
      Object.assign(projectListAtts, {
        start: (value - 1) * projectListAtts.length
      });
      void updateProjectData();

    });

    watch(projectListAtts, (value) => {
      if (value.searchValue === '')
        void updateProjectData();
    });

    async function updateProjectData() {
      const data = await useProject.fetchProjectListPaginate(
        projectListAtts.length,
        projectListAtts.start,
        projectListAtts.orderColumn,
        projectListAtts.orderDir,
        projectListAtts.searchValue);

      projectListItems.value = data.data;
      projectListExtra.selected = data.data.length;
      projectListExtra.total = data.recordsTotal;
      projectListExtra.totalFiltered = data.recordsFiltered;
      projectListExtra.textFiltered = data.aux_busqueda;
      if (projectListExtra.totalFiltered < projectListAtts.length) {
        maxPages.value = calculatePagesCount(projectListAtts.length, projectListExtra.totalFiltered);
      } else {
        maxPages.value = calculatePagesCount(projectListExtra.selected, data.recordsTotal);
      }

    }

    let goToProjectEnabled = true;
    const store = useStore();

    function goToProject(projectObject: any) {
      if (goToProjectEnabled) {
        emit('go-location', projectObject);
        void useProject.fetchProjectById(projectObject.pre_id).then((r) => {
          void store.dispatch('project/saveProjectDescription', r);
        });
        goToProjectEnabled = false;
      }
    }

    setInterval(() => {
      goToProjectEnabled = true;
    }, 3000);

    function calculatePagesCount(pageSize, totalCount) {
      return totalCount < pageSize ? 1 : Math.ceil(totalCount / pageSize);
    }

    function searchValue() {

      projectListAtts.start = 0;
      void updateProjectData();
    }

    const orderModel = ref('desc');

    watch(projectListAtts, value => {
      if (value.searchValue) {
        searchValue();
      }
    });
    watch(orderModel, (value) => {
      projectListAtts.orderDir = value;
      void updateProjectData();
    });

    async function viewTooltip(projectObject) {
      if (goToProjectEnabled) {
        let data = await useProject.fetchProjectById(projectObject.pre_id);
        await store.dispatch('project/saveProjectDescription', data);
        tooltipOpen.value = true;
      }
    }

    return {
      projectListItems,
      projectListExtra,
      goToProject,
      currentPage,
      maxPages,
      orderModel,
      projectListAtts,
      searchValue,
      viewTooltip,
      tooltipOpen
    };
  }
});
</script>

<style scoped lang='scss'>
.item-section__png {
  &:hover {
    transform: scale(2.1);
  }
}


</style>
