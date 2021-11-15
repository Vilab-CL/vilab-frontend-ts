import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import VueHighcharts from 'vue3-highcharts';
import HighCharts from 'highcharts';
import StockCharts from 'highcharts/modules/stock';


import messages from 'src/i18n';
import VueFullscreen from 'vue-fullscreen';

const i18n = createI18n({
  locale: 'en-US',
  messages
});

export default boot(({ app }) => {
  // Set i18n instance on app
  StockCharts(HighCharts);
  app.use(i18n);
  app.use(VueHighcharts);
  app.use(VueFullscreen, {
    name: 'fs'
  });

});

export { i18n };
