<template>
  <q-dialog v-model='model'>
    <q-card style='min-width: 350px'>
      <q-card-section>
        <div class='text-h6'>Información general :
          <b>{{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.pre_nombre }}</b></div>

      </q-card-section>

      <q-card-section class='q-pt-none'>
        <ul>
          <li><span
            class='text-bold '>Cultivo:</span>{{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.cultivo
            }}
          </li>
          <li><span
            class='text-bold '>Variedad: </span>{{
              $store.getters['project/getProjectDescription'].geojson?.features[0].properties.variedad??'-'
            }}
          </li>
          <li><span
            class='text-bold '>Estación: </span>{{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.estacion
            }}
          </li>
          <li><span class='text-bold '> Ubicación:</span>
            <ul>
              <li><span class='text-bold '>Región:</span>
                {{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.region }}
              </li>
              <li><span class='text-bold '>Provincia:</span>
                {{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.provincia }}
              </li>
              <li><span class='text-bold '>Comuna:</span>
                {{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.comuna }}
              </li>
            </ul>
          </li>
          <li><span
            class='text-bold '>Area:</span>
              {{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.area }} [Mt2],
              {{Math.round(($store.getters['project/getProjectDescription'].geojson?.features[0].properties.area/10000)*100)/100}} [Ha]
              <br>
          </li>
          <li><span
            class='text-bold '>Fecha de plantación:</span>
            {{ $store.getters['project/getProjectDescription'].geojson?.features[0].properties.fecha_plantacion ?? 'No definido'}}
          </li>
        </ul>
      </q-card-section>
      <q-card-actions align='right' class='text-primary'>
        <q-btn flat label='Ok' v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  // name: 'ComponentName',
  props: {
    value: Boolean,
    data: Object
  },
  setup(props, { emit }) {

    const model = ref(props.value);


    const store = useStore();

    store.watch(
      () => store.getters['project/getProjectDescription']
      , value => {
        console.log(value);
      }
    )

    watch(model, (value) => {
      emit('update:value', value);
    });

    return {
      model
    };
  }
});
</script>
