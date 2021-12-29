<template>
    <van-picker
        ref="picker"
        :columns="displayColumns"
        @confirm="onConfirm"
        @change="onChange"
        @cancel="onCancel"
        show-toolbar
        value-key="name"
    />
</template>

<script>
import { Picker } from 'vant';

function isOverseaCode(code) {
    return code[0] === '9';
}
export default {
    components: { [Picker.name]: Picker },
    props: {
        value: String,
        areaList: {
            type: Array,
            default: () => [],
        },
        columnsNum: {
            type: [Number, String],
            default: 3,
        },
        isOverseaCode: {
            type: Function,
            default: isOverseaCode,
        },
        columnsPlaceholder: {
            type: Array,
            default: function _default() {
                return [];
            },
        },
    },
    data: function data() {
        return {
            code: this.value,
            columns: [
                {
                    values: [],
                },
                {
                    values: [],
                },
                {
                    values: [],
                },
            ],
            areaMap: {
                areaMap: {},
            },
        };
    },
    computed: {
        displayColumns: function displayColumns() {
            return this.columns.slice(0, +this.columnsNum);
        },
        placeholderMap: function placeholderMap() {
            return {
                province: this.columnsPlaceholder[0] || "",
                city: this.columnsPlaceholder[1] || "",
                county: this.columnsPlaceholder[2] || "",
            };
        },
    },
    watch: {
        value: function value(val) {
            this.setColumns();
        },
        areaList: {
            deep: true,
            handler: function() {
                this.formatedArea();
                this.setColumns();
            },
        },
        columnsNum: function columnsNum() {
            var _this = this;

            this.$nextTick(function () {
                _this.setValues();
            });
        },
    },
    mounted() {
        this.formatedArea();
        this.setColumns();
    },
    methods: {
        formatedArea() {
            // 这里外国跟省份一个级别
            this.areaList.forEach((province) => {
                this.areaMap[province.region_id] = {
                    children: province.cities,
                    areaMap: {},
                };

                this.areaMap.areaMap[province.region_id] = province.name;

                let cityMap = this.areaMap[province.region_id].areaMap;

                province.cities.forEach((city) => {
                    this.areaMap[city.region_id] = {
                        children: city.counties,
                        areaMap: {},
                    };

                    cityMap[city.region_id] = city.name;

                    let countyMap = this.areaMap[city.region_id].areaMap;

                    city.counties.forEach((county) => {
                        countyMap[county.region_id] = county.name;
                    });
                });
            });
        },
        parseOutputValues: function parseOutputValues(values) {
            var _this2 = this;

            return values.map(function (value, index) {
                // save undefined value
                if (!value) return value;
                value = JSON.parse(JSON.stringify(value));

                if (
                    !value.code ||
                    value.name === _this2.columnsPlaceholder[index]
                ) {
                    value.code = "";
                    value.name = "";
                }

                return value;
            });
        },
        onChange: function onChange(picker, values, index) {
            this.setColumns(index, values[index].code);
            var parsedValues = this.parseOutputValues(picker.getValues());
            this.$emit("change", picker, parsedValues, index);
        },
        onCancel: function onCancel() {
            this.$emit("cancel");
        },
        onConfirm: function onConfirm(values, index) {
            values = this.parseOutputValues(values);
            this.$emit("confirm", values, index);
        },
        setColumns(changedIndex, code) {
            if (!this.areaList.length) {
                return ;
            }
            let values = this.value.split(";");
            let picker = this.$refs.picker;
            let province = this.areaMap.areaMap;
            let provinceIndex = 0,
                cityIndex = 0,
                countyIndex = 0;
            let isMounted = false;

            if (!code) {
                isMounted = true;
                provinceIndex = Object.keys(province).findIndex((key) => {
                    return province[key] === values[0];
                });
                code = Object.keys(province)[Math.max(provinceIndex, 0)];
            }

            let city;

            if (changedIndex == undefined) {
                picker.setColumnValues(0, this.formatColumnValues(province));
            }
            if (changedIndex == undefined || changedIndex < 1) {
                city = this.areaMap[code].areaMap;
                picker.setColumnValues(1, this.formatColumnValues(city));

                if (isMounted) {
                    cityIndex = Object.keys(city).findIndex((key) => {
                        return city[key] === values[1];
                    });
                }

                code = Object.keys(city)[Math.max(0, cityIndex)];
                picker.setColumnValues(
                    2,
                    this.formatColumnValues(code && this.areaMap[code].areaMap)
                );
            } else if (changedIndex === 1) {
                picker.setColumnValues(
                    2,
                    this.formatColumnValues(this.areaMap[code].areaMap)
                );
            }

            if (isMounted) {
                let county = (code && this.areaMap[code].areaMap) || [];
                countyIndex = Object.keys(county).findIndex((key) => {
                    return county[key] === values[2];
                });
                picker.setIndexes([provinceIndex, cityIndex, countyIndex]);
            }
        },
        formatColumnValues(values) {
            if (!values) {
                return [];
            }
            return Object.keys(values).map((value) => {
                return {
                    code: value,
                    name: values[value],
                };
            });
        },
        getValues: function getValues() {
            var picker = this.$refs.picker;
            var getValues = picker
                ? picker.getValues().filter(function (value) {
                      return !!value;
                  })
                : [];
            getValues = this.parseOutputValues(getValues);
            return getValues;
        },
        getArea: function getArea() {
            var values = this.getValues();
            var area = {
                code: "",
                country: "",
                province: "",
                city: "",
                county: "",
            };

            if (!values.length) {
                return area;
            }

            var names = values.map(function (item) {
                return item.name;
            });
            var validValues = values.filter(function (value) {
                return !!value.code;
            });
            area.code = validValues.length
                ? validValues[validValues.length - 1].code
                : "";

            if (this.isOverseaCode(area.code)) {
                area.country = names[1] || "";
                area.province = names[2] || "";
            } else {
                area.province = names[0] || "";
                area.city = names[1] || "";
                area.county = names[2] || "";
            }

            return area;
        },
        // @exposed-api
        reset: function reset(code) {
            this.code = code || "";
            this.setValues();
        },
    },
};
</script>