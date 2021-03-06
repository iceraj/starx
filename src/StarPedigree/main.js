/// <reference path="../StarX/lib/require.d.ts" />
/// <reference path="../StarX/lib/jquery.d.ts" />
define(["require", "exports", 'jquery', 'StarTMI/tmi', "StarX/edXintegration", "StarPedigree/Assignment", "StarPedigree/Model", "StarPedigree/Widget"], function(require, exports, $, StarTMI, integration, model, data, ui) {
    

    var tmi = new StarTMI.TMI();

    var StarPedigree = (function () {
        function StarPedigree() {
        }
        StarPedigree.prototype.configure = function (config) {
            tmi.event('StarPedigree', 'Start');
            var edX = new integration.Integration(config);
            edX.configRaven();
            this.config = config;
            var self = this;
            var top = $('#' + config.element_id);
            var text = '';
            top.html("Welcome to " + this.config.StarX);
            if (config.model && config.model.indexOf('/') != -1) {
                top.html("Load:" + config.model);
                $.getJSON(config.model, function (json, textStatus, jqXHR) {
                    console.info("data", json, "textStatus", textStatus, "jqXHR", jqXHR);
                    top.html("Loaded:" + config.model);

                    this.assignment = new model.Assignment(json);
                    window['__StarX'] = this.assignment;
                    this.widget = new ui.Widget(config, this.assignment);
                    this.widget.run();
                });
            } else if (data[config.model]) {
                this.assignment = new model.Assignment(data[config.model]);
                window['__StarX'] = this.assignment;
                this.widget = new ui.Widget(config, this.assignment);
                this.widget.run();
            } else {
                this.assignment = new model.Assignment(data.model1);
                window['__StarX'] = this.assignment;
                this.widget = new ui.Widget(config, this.assignment);
                this.widget.run();
            }
            //        top.html("Welcome to " + this.config.StarX + "!");
        };
        return StarPedigree;
    })();
    exports.StarPedigree = StarPedigree;
});
//# sourceMappingURL=main.js.map
