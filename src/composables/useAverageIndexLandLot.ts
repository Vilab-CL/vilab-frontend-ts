import { ref } from 'vue';
import { api } from 'boot/axios';
import qs from 'qs';

export default function() {

  const avgIndex = ref([]);

  async function getAvgIndex(landlot_id, index) {
    if (landlot_id && index) {
      try {
        const { data } = await api.post('predios/promedios', qs.stringify({
          pre_id: landlot_id,
          indice: index
        }));
        if (data){
          avgIndex.value = data;
          return data
        }
      } catch (e) {
        console.log(e);
      }
    }
    return ;
  }

  return {
    avgIndex,
    getAvgIndex
  };

}
