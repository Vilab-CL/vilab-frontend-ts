import { MutationTree } from 'vuex';
import { ExampleStateInterface } from './state';

const mutation: MutationTree<ExampleStateInterface> = {
  setProjectIndexImage (state,payload) {
    state.project_index_image.png=payload.png
    state.project_index_image.bounds=payload.bounds
  },
  setFirstPeriodUtc(state,payload){
    state.selected_period_utc.firstDate=payload
  },
  setSecondPeriodUtc(state,payload){
    state.selected_period_utc.secondDate=payload
  },
  setThirdPeriodUtc(state,payload){
    state.selected_period_utc.thirdDate=payload
  },
  setPeriodAvg(state, payload){
    state.selected_period_utc.avg=payload
  },

  setProjectDescription(state,payload){
    // state.project_description=payload
    Object.assign(state.project_description,payload)
  }
};

export default mutation;
