define(['require', 'exports', 'jquery'], function (require, exports, $) {
    if (!$) {
        $ = jQuery;
    }
    var widget_ids = {};

    function get_base_url() {
        var module = "StarX/main";
        var module_ext = ".js";
        var base_url = location.protocol + '//starx.mit.edu/';
        if (location.hostname == 'localhost') {
            base_url = 'http://localhost:8002/';
        }

        var main_url;
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i];
            if (script.getAttribute('data-requiremodule') == module) {
                main_url = script.getAttribute('src');
            }
        }
        if (main_url) {
            base_url = main_url.substring(0, main_url.length - module.length - module_ext.length);
        }
        return base_url;
    }

    var base_url = get_base_url(); // 'http://localhost:8002/';

    function parse(str, del) {
        try {
            str = str.replace(new RegExp(del, "g"), '"');
            var json = "{" + str.substr(2, str.length - 4) + "}";
            var data = {};
            try {
                data = JSON.parse(json);
            }
            catch (e) {
                return { "html": "STARX: ERROR PARSING: " + str.substr(2, str.length - 4) + ":ERROR PARSING :STARX", callback: function () {
                } }
            }
            var id = "STARX_" + Math.round(1000000 * Math.random());
            widget_ids[id] = 1;

            data.element_id = id;
            data.base_url = get_base_url();
            if (data.base_url == '') {
                data.base_url = document.location.origin;
            }
            var callback;
            console.info( "Parse" , data);
            if (data['editor'] && (data['editor'] == 'true'|| data['editor'] === true)) {
                callback = function () {
                    require(['../' + data.StarX + '/editor'], function (project) {
                        if (project) {
                            try {
                                if (project.configure) {
                                    project.configure(data);
                                }
                                else if (project[data.StarX+"Editor"]) {
                                    q = new project[data.StarX+"Editor"]();
                                    q.configure(data);
                                }
                            } catch (e) {
                                var config = data;
                                document.getElementById(config.element_id).innerHTML = data.StarX + " has an issue. (" + e + ")";
                            }
                        }
                        else {
                            console.info("Has other");
                            var config = data;
                            document.getElementById(config.element_id).innerHTML = "project " + data.StarX + " not found";
                        }
                    });
                };

            }
            else {
                callback = function () {
                    require(['../' + data.StarX + '/main'], function (project) {
                        if (project) {
                            try {
                                if (project.configure) {
                                    project.configure(data);
                                }
                                else if (project[data.StarX]) {
                                    q = new project[data.StarX]();
                                    q.configure(data);
                                }
                            } catch (e) {
                                var config = data;
                                document.getElementById(config.element_id).innerHTML = data.StarX + " has an issue. (" + e + ")";
                            }
                        }
                        else {
                            console.info("Has other");
                            var config = data;
                            document.getElementById(config.element_id).innerHTML = "project " + data.StarX + " not found";
                        }
                    });
                };
            }
            return { html: "<span id='" + id + "'></span>", callback: callback };
        } catch (e) {
            return "STARX: ERROR PARSING: " + str.substr(2, str.length - 4) + ":ERROR PARSING :STARX";
        }
    }

    function test_and_add(element, elements) {
        if ($(element).parents().filter('.editor').length == 0) {
            elements.push(element);
        }
    }

    var in_load = false;

    function load(target) {
        load_delimited('"', target);
        load_delimited("'", target);
    }

    function load_delimited(del, target) {
        if (in_load) {
            return;
        }
        in_load = true;
        var elements = [];
        var list = $("*:contains('{[" + del + "StarX" + del + ":')", target);
        // console.info("in load " + del + " ");
        // console.info(target);
        // console.info("in load " + list.length);
        for (var i = 1; i < list.length; i++) {
            if (!list[i - 1].contains(list[i])) {
                test_and_add(list[i - 1], elements);
            }
        }
        if (list.length > 0) {
            test_and_add(list[list.length - 1], elements);
        }
        var callbacks = [];
        $(elements).each(function () {
            var element = $(this);
            var html = element.html();
            if (html != null && html.indexOf(']}') != -1) {
                var matches = html.match('(\\{\\[' + del + 'StarX' + del + ':[^\\]]*\\]\\})');
                var splits = html.split(/(\{\['+del+'StarX'+del+':.*\]\})/);
                var new_html = '';
                for (var i = 0; i < splits.length; i++) {
                    if (splits[i].trim().indexOf('{[' + del + 'StarX' + del + ':') == 0) {
                        var p = parse(splits[i].trim(), del);
                        new_html += p.html;
                        callbacks.push(p.callback);
                    }
                    else {
                        new_html += splits[i];
                    }
                }
                element.html(new_html).ready(function () {
                    if (callbacks.length != 0) {
                        element.addClass('starx_handled');
                    }
                    $(callbacks).each(function () {
                        if (this instanceof Function) {
                            this();
                        }
                        else {
                            console.info("Failed to operate on callback:" + this);
                        }
                    });
                })
            }

        });
        in_load = false;

    }

    function starx_child(element) {
        if (element) {
            if (element['id'] && widget_ids[ element['id']] == 1) {
                return true;
            }
            if (element.parentElement) {
                return starx_child(element.parentElement);
            }
        }
        return false;
    }

    function bind() {
        $('body').bind('DOMNodeInserted', function (e) {
            if (starx_child(e.target)) {
                return;
            }
            load(e.target);
        });
        load(document.body);
    }

    function init() {
        if (window.STARX_SELECTOR) {
            $(window.STARX_SELECTOR).each(function () {
                var e = this;
                var q = $(e);
                var text = q.text();
                if (q.hasClass('starx_handled')) {
                    return;
                }
                if (text.indexOf("{[") >= 0) {
                    var p = parse(text, '"');

                    q.html(p.html).addClass('starx_handled').ready(function () {
                        p.callback();
                    });
                }
            });
            if (!window.STARX_NO_BIND) {
                bind();
            }
        }
        else {
            bind();
        }
    }

    if (!( require['starx_compiled'] == true )) {
        init();
    }

    exports.load = load;
    exports.init = init;
});
