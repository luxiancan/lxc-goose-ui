<template>
    <div class="modal-template-wrapper" @mousemove.stop>
        <div class="modal-template-container">
            <div class="modal-template-body">
                <div class="modal-template-title">{{title}}</div>
                <slot name="title-below"></slot>
                <div class="modal-template-form">
                    <slot name="form-inputs"></slot>
                </div>
            </div>
            <div class="modal-template-footer">
                <div class="modal-template-cancel modal-template-btn" v-if="showCancel" @click="cancel">{{cancelText}}</div>
                <div class="modal-template-confirm modal-template-btn theme-customize-font" v-if="showConfirm" @click="confirm">{{confirmText}}</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        tips: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: '标题'
        },
        showConfirm: {
            type: Boolean,
            default: true
        },
        showCancel: {
            type: Boolean,
            default: true
        },
        confirmText: {
            type: String,
            default: '确定'
        },
        cancelText: {
            type: String,
            default: '取消'
        }
    },
    components: {
    },
    data() {
        return {
        };
    },
    computed: {
    },

    created() {
    },
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        confirm() {
            this.$emit('confirm');
        }
    }
};
</script>

<style scoped lang="scss">
.modal-template-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 100vh;
    z-index: 105;
    font-size: 0.32rem;
    background: rgba($color: #000000, $alpha: .6);
}
.modal-template-container {
    border-radius: .08rem;
    align-self: center;
    background-color: #FFFFFF;
}

.modal-template-title {
    padding: .4rem 0 0;
    font-weight: 500;
    text-align: center;
}

.modal-template-form {
    padding: 0 .4rem;
}

.modal-template-footer {
    display: flex;
    margin-top: .4rem;
    font-size: 0.32rem;
    border-top: 1px solid #EEEEEE;
}

.modal-template-btn {
    flex: 1;
    padding: .26rem 0;
    text-align: center;
}

.modal-template-btn + .modal-template-btn {
    border-left: 1px solid #EEEEEE;
}

.modal-template-cancel {
    color: #888888;
}

.modal-template-confirm {
    color: #2fcf63;
}
</style>