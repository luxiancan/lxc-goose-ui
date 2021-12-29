import customerService from '@/components/customerService'

customerService.install = function (Vue) {
  Vue.component(customerService.name, customerService);
};

export default customerService
