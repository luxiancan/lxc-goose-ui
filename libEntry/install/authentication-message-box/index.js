import authenticationMessageBox from '@/components/authenticationMessageBox'

authenticationMessageBox.install = function (Vue) {
  Vue.component(authenticationMessageBox.name, authenticationMessageBox);
};

export default authenticationMessageBox