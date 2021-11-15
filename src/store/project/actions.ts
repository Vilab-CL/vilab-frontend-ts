import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { ExampleStateInterface } from './state';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  // someAction (/* context */) {
    // your code
  // }

  saveProjectDescription(context,payload){
    context.commit('setProjectDescription',payload)
  }
};

export default actions;
