<template>
  <q-page class='q-pa-md'>
    <!-- content -->

    <q-btn label="Agregar usuario"  icon='far fa-save' color="secondary" @click="prompt = true" />
    <!--<q-btn label="Agregar proyecto"  icon='far fa-save' color="secondary" @click="plot = true" />-->
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>
          <q-card-section>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input   filled   v-model="id" label="Id" autofocus :rules="[ val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
        <q-input  filled   v-model="mail" label="Correo" autofocus :rules="[ val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input  filled   v-model="password" label="Contraseña" :rules="[ val => val && val.length > 0 || 'Please type something']"/>
        </div>
        <q-input v-model="pass" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle">
  <template v-slot:append>
    <q-icon
      :name="isPwd ? 'visibility_off' : 'visibility'"
      class="cursor-pointer"
      @click="isPwd = !isPwd"
    />
  </template>
</q-input>
      </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn label="agregar usuario" color="secondary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="plot" persistent>

      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Ingreso de proyectos</div>
        </q-card-section>
            <q-card-section>
          <div class='row q-col-gutter-md '>
            <div class='col-12 col-md-5 col-sm-12'>
              <q-input   filled  v-model='Proyecto' label='Proyecto' :rules="[ val => val && val.length > 0 || 'Please type something']" />
            </div>
            <div class='col-12 col-md-5 col-sm-12 '>
              <q-input  filled   v-model='cultivo' label='Tipo de cultivo' :rules="[ val => val && val.length > 0 || 'Please type something']" />
            </div>
            <div class='col-12 col-md-5 col-sm-12'>
              <q-input  filled   v-model='variedades' label='Variedades'  :rules="[ val => val && val.length > 0 || 'Please type something']"/>
            </div>
            <div class='col-12 col-md-5 col-sm-12'>
              <q-input  filled   v-model='area' label='Area (Ha)' type='number' :rules="[ val => val && val.length > 0 || 'Please type something']" />
            </div>
            <div class='col-12 col-md-5 col-sm-12'>
              <q-select  filled   v-model='estacion' label='Estación metereológica' :rules="[ val => val && val.length > 0 || 'Please type something']" />
            </div>
            <div class='col-12 col-md-5 col-sm-12 '>

              <q-input  filled   v-model='escala' label='Escala' type='number' :rules="[ val => val && val.length > 0 || 'Please type something']" />
            </div>
            <div class='col-12 col-md-6 col-sm-12'>
              <q-select
        filled
        v-model="region"
        input-debounce="0"
        label="regiones"
        :options="options"
        style="width: 250px"
        behavior="menu"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
            </div>
            <div class='col-12 col-md-5 col-sm-12 '>
              <q-select  filled   v-model='comuna' label='Comuna' :rules="[ val => val && val.length > 0 || 'Please type something']" />
            </div>
            <div class='col-12 col-md-5 col-sm-12 '>
              <q-select  filled   v-model='estado' label='Estado' :options='["activo","inactivo"]' :rules="[ val => val && val.length > 0 || 'Please type something']"/>
            </div>
      </div>
      <div class='row q-col-gutter-md q-mt-xs'>

        <div class='col-12 col-md-5 col-sm-12 '>
          <q-input  filled   :rules="['date']" label='División' v-model='division'>
            <template v-slot:append>
              <q-icon name='event' class='cursor-pointer'>
                <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                  <q-date v-model='division'>
                    <div class='row items-center justify-end'>
                      <q-btn v-close-popup label='ok' color='primary' flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input  filled   :rules="['date']" label='Fecha de plantación' v-model='plantacion'>
            <template v-slot:append>
              <q-icon name='event' class='cursor-pointer'>
                <q-popup-proxy ref='qDateProxy' transition-show='scale' transition-hide='scale'>
                  <q-date v-model='plantacion'>
                    <div class='row items-center justify-end'>
                      <q-btn v-close-popup label='ok' color='primary' flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <q-card-section>

      </q-card-section>
              </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn label="Cancel"  color="negative" v-close-popup />
        <q-btn label="agregar Proyecto"  color="secondary" v-close-popup />
      </q-card-actions>
      </q-card>
    </q-dialog>
      <GenericTableBackend
        :columns='columns'
        endpoint='http://[::1]/app_vilab/index.php/Nicolas/get_users_axios'
        :filter-enable='true'
        filter-search-placeholder='Ingresar busqueda'
        :filter-search-criteria='["usu_mail"]'
        :edit='edit'
        :remove='remove'
      >
    </GenericTableBackend>


  </q-page>
</template>


<script lang='ts'>
import {ref, onMounted,reactive} from 'vue';
import {useQuasar, date} from 'quasar';
import GenericTableBackend from 'components/tables/GenericTableBackend.vue';
import { api } from 'boot/axios';
import axios from 'axios';
import regiones from './regiones.json';
export default {
  name:'user_table',
  components: { GenericTableBackend },
  setup (){
    //console.log(regiones.regiones);
    const $q = useQuasar();
    const id = ref('');
    const mail = ref('');
    const password = ref('');
    const myform = ref('');
    const info = ref([]);
    const filter = ref('');
    const loading = ref(false);
    const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10
  });
  const prompt = ref(false);
  const plot = ref(false);
  const pass=ref('');
  const proyecto = ref('');
  const cultivo = ref('');
  const area = ref('');
  const estacion = ref('');
  const escala = ref('');
  const comuna = ref('');
  const region = ref(null);
  const estado = ref('');
  const Arr_regiones: string[]=reactive([]);
  const plantacion = ref('2021/02/01');
  const division = ref('2021/02/01');
  function regionarr() {
    for (let i = 0; i < regiones.regiones.length; i++) {
      //console.log(regiones.regiones[i].region)
        Arr_regiones.push(regiones.regiones[i].region);

    }
    //console.log(Arr_regiones)
    return Arr_regiones
  }
  const options=ref(regionarr());
  function edit(row) {

  console.log(row);
  }
  function remove(usu_id) {
    console.log(usu_id);
  }
  function submit() {
    if(id.value =='' || mail.value =='' || password.value ==''){
      $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Debe rellenar todos los campos en rojo'
          })
    }else{
          void axios({
            'method':'POST',
            'url': 'http://[::1]/app_vilab/index.php/Nicolas/add_user_axios',
            'data':JSON.stringify({
              'id':id.value,
              'mail':mail.value,
              'pass':password.value
            })
          }).then(function (response){
            console.log(response.data);
            $q.notify({
                  color: 'green-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Usuario agregado correctamente'
                });
                prompt.value = false;
                setTimeout(() => {
                  //window.location.reload()
                }, 2000);

          })
          .catch(function (error) {
              console.log(error.response);
            });
          //window.location.reload()
    }


  }

      return {
      info,
      filter,
      loading,
      pagination,
      columns:[
        { name: 'actions', align: 'center', label: 'Acciones', field: 'actions', sortable: false},
        { name:'usu_id', label:'user id', field:'usu_id', align:'left', sortable:true,},
        {name:'usu_mail',  label:'user mail',  field:'usu_mail',  align:'left'},
        {name:'usu_pass',  label:'user password',  field:'usu_pass',  align:'left'},
        ],
      edit,
      remove,
      submit,
      id,
      mail,
      password,
      myform,
      $q,
      prompt,
      plot,
      pass,
      isPwd: ref(true),
      proyecto,
      cultivo,
      area,
      estacion,
      escala,
      comuna,
      region,
      estado,
      plantacion,
      division,
      options,
  //onrequest,
    };
  },

}
</script>
