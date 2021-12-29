import alertModel from '@/components/alertModel'

alertModel.install = function (Vue) {
  Vue.component(alertModel.name, alertModel);
};

export default alertModel
