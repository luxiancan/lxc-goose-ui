import actionBar from '@/components/ActionBar'

actionBar.install = function (Vue) {
    Vue.component(actionBar.name, actionBar);
};

export default actionBar
