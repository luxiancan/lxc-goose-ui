<script>
import Emitter from './emitter';
import Clickoutside from './clickoutside';
import Axios from 'axios';
import SsDropdown from './dropdown';
import SsDropdownMenu from './dropdown/dropdownMenu';
import SsDropdownItem from './dropdown/dropdownItem';

const INPUT = 'input';
const BORDER = 'border';

const CODE_LIST_PATH = '/xe.sms.nation_code.list/1.0.0';

const RegExp = /[^\d]/g;

const validatePhoneNumber = (area, phoneNumber) => {
  if (!RegExp.test(phoneNumber)) {
    return true;
  }
  return false;
};

export default {
  name: 'SsPhoneInput',
  model: {
    prop: 'value',
    event: 'value-change',
  },
  mixins: [Emitter],
  directives: { Clickoutside },
  components: {
    SsDropdown,
    SsDropdownItem,
    SsDropdownMenu,
  },
  props: {
    width: {
      default: '320px',
      type: String,
    },
    theme: {
      default: INPUT,
      validator: theme => [INPUT, BORDER].indexOf(theme) !== -1,
    },
    validate: {
      type: Function,
      default: validatePhoneNumber,
    },
    placeholder: {
      type: String,
      default: '请输入手机号',
    },
    additionalValidate: {
      type: Function,
    },
    showError: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
    },
    baseUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      placement: 'bottomLeft',
      menuWidth: 0,
      codeList: [],
      phoneNumber: '',
      dropdownVisible: false,
      current: {
        nation_name: '中国',
        nation_code: '+86',
      },
      loading: false,
    };
  },
  computed: {
    inputStyle({ width }) {
      return { width };
    },
    formatValue({ current, phoneNumber }) {
      return `${current.nation_code}-${phoneNumber}`;
    },
    themeClass({ theme }) {
      return {
        [INPUT]: 'ss-input-theme',
        [BORDER]: 'ss-border-theme',
      }[theme];
    },
  },
  watch: {
    dropdownVisible(val) {
      this.broadcast('SsDropdownMenu', 'visible', val);
    },
    current(current) {
      this.$emit('code-change', current);
      this.$nextTick(() => {
        this.broadcast('SsDropdownMenu', 'update');
      });
    },
    formatValue(val) {
      this.$emit('value-change', val);
    },
  },
  created() {
    this.initCodeData();
  },
  mounted() {
    this.menuWidth = this.$el.clientWidth;
  },
  methods: {
    initCodeData() {
      this.loading = true;
      Axios.get(`${this.baseUrl}${CODE_LIST_PATH}`)
        .then(({ data }) => {
          const { list } = data.data;
          this.codeList = list;
          this.$emit("fetch-success",list)
        })
        .catch((err) => {
          window.console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getValue() {
      return this.formatValue;
    },
    setCode(code) {
      if (code) {
        const res = this.codeList.find(
          item => code === item.nation_code
        );
        res && (this.current = res);
      }
    },
    setPhone(phone) {
      if (!RegExp.test(phone)) {
        this.phoneNumber = phone;
      }
    },
    handleValidate() {
      const { current, phoneNumber } = this;
      if (this.additionalValidate) {
        return (
          this.validate(current, phoneNumber) &&
                    this.additionalValidate(current, phoneNumber)
        );
      }
      return this.validate(current, phoneNumber);
    },
    handleEnter(e) {
      e.stopPropagation();
      // window.console.log('enter', e);
      this.$emit('enter', this.phoneNumber, e);
    },
    handleChange(e) {
      e.stopPropagation();
      // window.console.log('change', e);
      this.$emit('change', this.phoneNumber, e);
    },
    handleKeyup(e) {
      e.stopPropagation();
      if (e.code === 'Enter') {
        this.handleEnter(e);
      } else {
        this.$emit('keyup', this.phoneNumber, e);
        // window.console.log('keyup', e);
      }
    },
    handleBlur(e) {
      e.stopPropagation();
      // window.console.log('blur', e);
      this.$emit('blur', this.phoneNumber, e);
      if (this.handleValidate()) {
        // window.console.log('校验成功');
      } else {
        // window.console.log('校验失败');
      }
    },
    handleFocus(e) {
      e.stopPropagation();
      // window.console.log('focus', e);
      this.$emit('focus', this.phoneNumber, e);
    },
    handleInput(e) {
      const { phoneNumber } = this;
      if (!RegExp.test(phoneNumber)) {
        // window.console.log('input', e);
        this.$emit('input', phoneNumber, e);
      } else {
        this.phoneNumber = phoneNumber.replace(RegExp, '');
      }
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleClose() {
      this.dropdownVisible = false;
    },
    isRowActive(row) {
      const { current } = this;
      return row.nation_name === current.nation_name;
    },
    handleRowSelect(row) {
      this.current = row;
      this.handleClose();
    },
    renderCodeCell() {
      const { current, dropdownVisible } = this;
      return (
        <div class="code-cell-wrap" on-click={this.toggleDropdown}>
          <div class="code-cell">
            <div class="code">{current.nation_code}</div>
            <i
              class={[
                'icon-icon-down',
                dropdownVisible && 'is-reverse',
              ]}
            ></i>
          </div>
        </div>
      );
    },
    renderCodeRow(row) {
      const text = `${row.nation_code} ${row.nation_name}`;
      return (
        <div
          class="row"
          on-click={() => this.handleRowSelect(row)}
          title={text}
        >
          {text}
          {this.isRowActive(row) && <i class="icon-icon-selected" />}
        </div>
      );
    },
    renderCodeSelection() {
      const { codeList, menuWidth } = this;
      return (
        <ss-dropdown-menu width={menuWidth}>
          {codeList.map(row => (
            <ss-dropdown-item>
              {this.renderCodeRow(row)}
            </ss-dropdown-item>
          ))}
        </ss-dropdown-menu>
      );
    },
    renderInput() {
      const { placeholder } = this;
      return (
        <div class="input-wrap">
          <input
            type="text"
            maxlength="16"
            class="input__inner"
            vModel={this.phoneNumber}
            placeholder={placeholder}
            on-input={e => this.handleInput(e)}
            on-focus={e => this.handleFocus(e)}
            on-blur={e => this.handleBlur(e)}
            on-keyup={e => this.handleKeyup(e)}
            on-change={e => this.handleChange(e)}
          />
        </div>
      );
    },
  },
  render() {
    const { inputStyle, themeClass } = this;
    return (
      <div
        class={['ss-phone-input', themeClass]}
        vClickoutside={this.handleClose}
        style={inputStyle}
      >
        {this.renderCodeCell()}
        {this.renderCodeSelection()}
        {this.renderInput()}
      </div>
    );
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/packages/phone-input.scss";
</style>