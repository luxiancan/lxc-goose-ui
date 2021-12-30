// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential', 'airbnb-base'],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  globals: {
    _hmt: true
  },
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    "no-trailing-spaces": 0, // 尾部是否允許多餘的空格
    "comma-dangle": 0, //是否允许对象中出现结尾逗号
    "no-cond-assign": 2, //条件语句的条件中不允许出现赋值运算符
    "no-dupe-args": 2, //函数定义的时候不允许出现重复的参数
    "no-dupe-keys": 2, //对象中不允许出现重复的键
    "no-duplicate-case": 2, //switch语句中不允许出现重复的case标签
    "no-empty": 2, //不允许出现空的代码块
    "no-empty-character-class": 2, //正则表达式中不允许出现空的字符组
    "no-ex-assign": 2, //在try catch语句中不允许重新分配异常变量
    "no-func-assign": 2, //不允许重新分配函数声明
    "no-invalid-regexp": 2, //不允许在RegExp构造函数里出现无效的正则表达式
    "no-irregular-whitespace": 2, //不允许出现不规则的空格
    "no-obj-calls": 2, //不允许把全局对象属性当做函数来调用
    "no-regex-spaces": 2, //正则表达式中不允许出现多个连续空格
    "no-unreachable": 2, //在return，throw，continue，break语句后不允许出现不可能到达的语句
    "use-isnan": 2, //要求检查NaN的时候使用isNaN()
    "block-scoped-var": 2, //将变量声明放在合适的代码块里
    "curly": ["error", "all"], //强制使用花括号的风格
    "eqeqeq": ["error", "smart"], //比较的时候使用严格等于
    "no-alert": 1, //不允许使用alert，confirm，prompt语句
    "no-caller": 2, //不允许使用arguments.callee和arguments.caller属性
    "no-div-regex": 2, //不能使用看起来像除法的正则表达式
    "no-else-return": 0, //如果if语句有return，else里的return不用放在else里
    "no-eq-null": 2, //不允许对null用==或者!=
    "no-eval": 2, //不允许使用eval()
    "no-extend-native": 2, //不允许扩展原生对象
    "no-extra-bind": 2, //不允许不必要的函数绑定
    "no-fallthrough": 2, //不允许switch按顺序全部执行所有case
    "no-floating-decimal": 2, //不允许浮点数缺失数字
    "no-implied-eval": 2, //不允许使用隐式eval()
    "no-iterator": 2, //不允许使用__iterator__属性
    "no-lone-blocks": 2, //不允许不必要的嵌套代码块
    "no-loop-func": 2, //不允许在循环语句中进行函数声明
    "no-multi-spaces": [2, { ignoreEOLComments: true }], //不允许出现多余的空格
    "no-multi-str": 2, //不允许用\来让字符串换行
    "no-global-assign": 2, //不允许重新分配原生对象
    "no-new": 2, //不允许new一个实例后不赋值或者不比较
    "no-new-func": 2, //不允许使用new Function
    "no-new-wrappers": 2, //不允许使用new String，Number和Boolean对象
    "no-octal": 2, //不允许使用八进制字面值
    "no-octal-escape": 2, //不允许使用八进制转义序列
    "no-param-reassign": 0, //不允许重新分配函数参数"no-proto": 2, //不允许使用__proto__属性
    "no-redeclare": 2, //不允许变量重复声明
    "no-return-assign": 2, //不允许在return语句中使用分配语句
    "no-script-url": 2, //不允许使用javascript:void(0)
    "no-self-compare": 2, //不允许自己和自己比较
    "no-sequences": 2, //不允许使用逗号表达式
    "no-throw-literal": 2, //不允许抛出字面量错误 throw "error"
    "no-unused-expressions": 0, //不允许无用的表达式
    "no-void": 2, //不允许void操作符
    "no-warning-comments": [1, {"terms": ["todo", "fixme", "any other term"]}], //不允许警告备注
    "no-with": 2, //不允许使用with语句
    "no-catch-shadow": 2, //不允许try catch语句接受的err变量与外部变量重名
    "no-shadow-restricted-names": 2, //js关键字和保留字不能作为函数名或者变量名
    "no-undef": 2, //不允许未声明的变量
    "no-undef-init": 2, //不允许初始化变量时给变量赋值undefined
    "no-undefined": 0, //不允许把undefined当做标识符使用
    "no-unused-vars": [2, {"vars": "all", "args": "after-used"}], //不允许有声明后未使用的变量或者参数
    "brace-style": [2, "1tbs", { "allowSingleLine": false}], //大括号风格
    "camelcase": [2, {"properties": "never"}], //强制驼峰命名规则
    "comma-style": [2, "last"], //逗号风格
    "consistent-this": [0, "self"], //当获取当前环境的this是用一样的风格
    "new-cap": [2, {"newIsCap": true, "capIsNew": false}], //构造函数名字首字母要大写
    "new-parens": 2, //new时构造函数必须有小括号
    "no-array-constructor": 2, //不允许使用数组构造器
    "no-multiple-empty-lines": [2, {"max": 2}], //空行最多不能超过两行
    "no-new-object": 2, //禁止使用new Object()
    "fun-call-spacing": 0, //函数调用时，函数名与()之间不能有空格
    "no-underscore-dangle": 2, //不允许标识符以下划线开头
    "no-extra-parens": 0, //不允许出现多余的括号
    "operator-assignment": 0, //赋值运算符的风格
    "space-infix-ops": [2, {"int32Hint": true}], //操作符周围的空格
    "keyword-spacing": 2, //关键字前后的空格
    "no-var": 2, //使用let和const代替var
    "semi": [0, "always"], //强制语句分号结尾
    "indent": ["error", 4], //开头的缩进风格
    "linebreak-style": 0, //换行风格
    "eol-last": 0, //文件末尾是否要存在一行空行
    "no-restricted-globals": 0, //禁止使用全局变量
    "no-plusplus": 0, //禁止使用一元操作符
    "array-callback-return": 0, //强制数组方法的回调函数中有 return 语句
    "no-restricted-syntax": 0, //禁止使用特定的语法
    "quote-props": [2, "as-needed"], //要求对象字面量属性名称使用引号，只有需要的时候才用引号
    "object-shorthand": ["error", "always"], //要求对象字面量简写语法
    "func-names": 0, //要求或禁止命名的 function 表达式
    "max-len": [1, {
      'code': 120
    }],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'operator-linebreak': 0,
    'prefer-destructuring': 0
  }
}
