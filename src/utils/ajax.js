((function(){
    'use strict';

    var defaultAjaxOptions = {
        method: 'GET',
        url: '',
        data: {},
        async: true,
        success: null,
        error: null
    };

    function ajax (options) {
        _extend(options || {}, defaultAjaxOptions);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    if (options.success) options.success(this.response);
                } else {
                    if (options.error) error.success(this.response);
                }
            }
        };
        if (options.method === 'GET') {
            var params = objToParams(options.data);
            var urlWithParams = options.url + (params ? '?' + params : '');
            xhttp.open(options.method, urlWithParams, options.async);
            xhttp.send();
        } else if (options.method === 'POST') {
            xhttp.open(options.method, options.url, options.async);
            xhttp.send(options.data);
        }
        return xhttp;
    }

    function get (url, data, success) {
        return Ajax.ajax({
            url: url,
            data: data,
            success: success,
            method: 'GET'
        });
    }

    function getJSON (url, data, success) {
        return Ajax.ajax({
            url: url,
            data: data,
            success: function (response) {
                success(JSON.parse(response));
            },
            method: 'GET'
        });
    }

    function post (url, data, success) {
        return Ajax.ajax({
            url: url,
            data: data,
            success: success,
            method: 'POST'
        });
    }

    window.Ajax = {
        ajax: ajax,
        get: get,
        getJSON: getJSON,
        post: post
    };

    function objToParams (obj) {
        var params = '';
        for (var key in obj) {
            var nextParam = key + '=' + encodeURIComponent(obj[key]);
            params += '&' + nextParam;
        }
        return params.slice(1);
    }

    function _extend(options, defaults) {
        for (var prop in defaults) {
            if (prop && defaults.hasOwnProperty(prop)) {
                var value = defaults[prop];
                if (typeof value === 'object') {
                    if (options[prop]) {
                        _extend(options[prop], value);
                    } else
                        options[prop] = value;
                } else if (typeof options[prop] === 'undefined')
                    options[prop] = value;
            }
        }
    }
})());
