import taxSign from '@/components/taxSign'
import Vue from 'vue';

const TaxSignConstructor = Vue.extend(taxSign);

let instance;
let lastProps;

const initInstance = (options) => {
    lastProps = options.propsData;
    // 实例化vue实例
    instance = new TaxSignConstructor(options);
    document.body.appendChild(instance.$mount().$el);
};

const resetInstance = (options) => {
    document.body.removeChild(instance.$el);

    initInstance(options);
}

function taxSignConfirm(options) {
    if (!instance) {
        initInstance({
            propsData: options
        });
    } else if (options) {
        const keys = Object.keys(lastProps);
        const optionKeys = Object.keys(options);
        if (!(keys.length === optionKeys.length && keys.every(key => options[key] && lastProps[key] === options[key]))) {
            resetInstance({
                propsData: options
            });
        }
    }

    return instance.taxSignConfirm();
}

taxSign.install = function ($Vue) {
    $Vue.component(taxSign.name, taxSign);

    $Vue.prototype.$taxSignConfirm = taxSignConfirm;
};

export default taxSign;