/**
 * Created by Neo on 2017/9/30.
 */
// 序列化参数的方法，等同于zepto的$.param


let paramForm = {};


paramForm.init = (function () {
    // var paramForm = {};

    var escape = encodeURIComponent;

    var isArray = Array.isArray || function(object){ return object instanceof Array; };


    function isFunction(value) { return getType(value) == "function"; }
    function isWindow(obj) { return obj != null && obj == obj.window; }
    function isObject(obj) { return getType(obj) == "object"; }
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }
    function likeArray(obj) {
        var length = !!obj && 'length' in obj && obj.length,
            type = getType(obj);

        return type != 'function' && !isWindow(obj) && (
                type == 'array' || length === 0 ||
                (typeof length == 'number' && length > 0 && (length - 1) in obj)
            );
    }
    function foreach(elements, callback){
        var i, key;
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                {if (callback.call(elements[i], i, elements[i]) === false) {return elements;}}
        } else {
            for (key in elements)
                {if (callback.call(elements[key], key, elements[key]) === false) {return elements;}}
        }

        return elements;
    }
    //判别数据类型
    var class2type = {};
    foreach("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });
    function getType(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object";
    }

    //序列化
    function serialize(params, obj, traditional, scope){
        var type, array = isArray(obj), hash = isPlainObject(obj);
        foreach(obj, function(key, value) {
            type = getType(value);
            if (scope) {key = traditional ? scope :
                scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';}
            // handle data in serializeArray() format
            if (!scope && array) {params.add(value.name, value.value);}
            // recurse into nested objects
            else if (type == "array" || (!traditional && type == "object"))
                {serialize(params, value, traditional, key);}
            else {params.add(key, value);}
        });
    }

    return function(obj, traditional){
        var params = [];
        params.add = function(key, value) {
            if (isFunction(value)) {value = value();}
            if (value == null) {value = "";}
            this.push(escape(key) + '=' + escape(value));
        };
        serialize(params, obj, traditional);
        return params.join('&').replace(/%20/g, '+');
    };
})();

export default {
  paramForm
}
