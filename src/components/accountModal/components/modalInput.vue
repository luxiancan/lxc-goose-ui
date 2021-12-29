<template>
    <div class="input-wrapper">
        <input :type="type" :placeholder="placeholder" class="xe-input" :value="value" @input="change"/>
        <div class="input-operation" :class="operatePosition">
            <slot name="operation"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'xeInput',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: [String, Number],
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: 'placeholder'
        },
        operatePosition: {
            type: String,
            default: 'padding' // 'padding'：适用于文字，有一定边距，居中显示 'contain'：不设边距显示
        }
    },
    methods: {
        change($event) {
            this.$emit('change', $event.target.value);
        }
    }
};
</script>

<style scoped lang="scss">
.input-wrapper {
    position: relative;
    margin-top: .32rem;
    font-size: 0.3rem;
}
.input-wrapper + .input-wrapper {
    margin-top: .28rem;
}
.xe-input {
    width: 4.62rem;
    padding: .24rem;
    font-size: .28rem;
    outline: 0;
    border: 1px solid #DCDCDC;
    border-radius: .08rem;
    box-sizing: initial;
    -webkit-appearance: none;
}
.xe-input::-webkit-outer-spin-button,
.xe-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.xe-input[type="number"] {
  -moz-appearance: textfield;
}
.xe-input::-ms-reveal {
    display: none;
}
.xe-input::-webkit-input-placeholder { /* WebKit browsers */ 
    color: #c8c8c8;
} 
.xe-input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
    color: #c8c8c8;
} 
.xe-input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
    color: #c8c8c8;
} 
.xe-input:-ms-input-placeholder { /* Internet Explorer 10+ */   
    color: #c8c8c8;
} 
.input-operation {
    position: absolute;

    &.padding {
        right: .24rem;
        bottom: .24rem;
    }
    &.contain {
        top: 0;
        right: 0;
        bottom: 0;
    }
}
</style>