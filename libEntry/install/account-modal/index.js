import accountModal from '@/components/accountModal'

accountModal.install = function (Vue) {
  Vue.component(accountModal.name, accountModal);
};

export default accountModal
