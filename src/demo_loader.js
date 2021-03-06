(function(window,undefined){

var modules = {} ;
modules['jquery'] = window.$;
var require = function(deps, creator) {
    var args = [];
    var global = { window:window };
    var exports = {};
    for( var i in deps )
    {
        var m = deps[i];
        if( m == 'exports')
        {
            args.push(exports);
        }
        else if( modules[m])
        {
            args.push(modules[m]);
        } else if(m.indexOf( "../") == 0 )
        {
            var mm = m.substr(3);
            if( modules[mm])
            {
                args.push(modules[mm]);
            }
        }
    }
    console.info( args );
    creator.apply( global , args );
}
    modules['require'] = require;

var define = function(what, deps, creator) {

    creator = creator || Object;
    var args = [];
    var creator_this = { window: window};
    var exports = {};
    for( var i in deps )
    {
        var m = deps[i];
        if( m == 'exports')
        {
            args.push(exports);
        }
        else
        {
            console.info( "modules" + modules ) ;
            args.push(modules[m]);
        }
    }
    console.info( "define start " + what);
    var module = creator.apply( creator_this , args );
    modules[what] = exports;
    console.info( "defined end  " + what);
}
    // here goes content
define("StarX/main",["require","exports","jquery"],function(e,t,n){function i(){var e="StarX/main",t=".js",n=location.protocol+"//starx.mit.edu/";location.hostname=="localhost"&&(n="http://localhost:8002/");var r,i=document.getElementsByTagName("script");for(var s=0;s<i.length;s++){var o=i[s];o.getAttribute("data-requiremodule")==e&&(r=o.getAttribute("src"))}return r&&(n=r.substring(0,r.length-e.length-t.length)),n}function o(t,n){try{t=t.replace(new RegExp(n,"g"),'"');var s="{"+t.substr(2,t.length-4)+"}",o={};try{o=JSON.parse(s)}catch(u){return{html:"STARX: ERROR PARSING: "+t.substr(2,t.length-4)+":ERROR PARSING :STARX",callback:function(){}}}var a="STARX_"+Math.round(1e6*Math.random());r[a]=1,o.element_id=a,o.base_url=i(),o.base_url==""&&(o.base_url=document.location.origin);function f(){e(["../"+o.StarX+"/main"],function(e){if(e)try{e.configure?e.configure(o):e[o.StarX]&&(q=new e[o.StarX],q.configure(o))}catch(t){var n=o;document.getElementById(n.element_id).innerHTML=o.StarX+" has an issue. ("+t+")"}else{console.info("Has other");var n=o;document.getElementById(n.element_id).innerHTML="project "+o.StarX+" not found"}})}return{html:"<span id='"+a+"'></span>",callback:f}}catch(u){return"STARX: ERROR PARSING: "+t.substr(2,t.length-4)+":ERROR PARSING :STARX"}}function u(e,t){n(e).parents().filter(".editor").length==0&&t.push(e)}function f(e){l('"',e),l("'",e)}function l(e,t){if(a)return;a=!0;var r=[],i=n("*:contains('{["+e+"StarX"+e+":')",t);console.info("in load "+e+" "),console.info(t),console.info("in load "+i.length);for(var s=1;s<i.length;s++)i[s-1].contains(i[s])||u(i[s-1],r);i.length>0&&u(i[i.length-1],r);var f=[];n(r).each(function(){var t=n(this),r=t.html();if(r!=null&&r.indexOf("]}")!=-1){var i=r.match("(\\{\\["+e+"StarX"+e+":[^\\]]*\\]\\})"),s=r.split(/(\{\['+del+'StarX'+del+':.*\]\})/),u="";for(var a=0;a<s.length;a++)if(s[a].trim().indexOf("{["+e+"StarX"+e+":")==0){var l=o(s[a].trim(),e);u+=l.html,f.push(l.callback)}else u+=s[a];t.html(u).ready(function(){n(f).each(function(){this instanceof Function?this():console.info("Failed to operate on callback:"+this)})})}}),a=!1}function c(e){if(e){if(e.id&&r[e["id"]]==1)return!0;if(e.parentElement)return c(e.parentElement)}return!1}function h(){n("body").bind("DOMNodeInserted",function(e){if(c(e.target))return;f(e.target)}),f(document.body)}function p(){window.STARX_SELECTOR?(n(window.STARX_SELECTOR).each(function(){var e=this,t=n(e),r=t.text();if(t.hasClass("starx_handled"))return;if(r.indexOf("{[")>=0){var i=o(r,'"');t.html(i.html).addClass("starx_handled").ready(function(){i.callback()})}}),window.STARX_NO_BIND||h()):h()}n.noConflict(),window.$||(window.$=n);var r={},s=i(),a=!1;p(),t.load=f,t.init=p}),define("StarTMI/tmi",["require","exports"],function(e,t){var n=function(){function e(){this.debug=!0}return e.prototype.pageview=function(){this.debug&&console.info("TMI:pageview");var e={source:"_Star_TMI_",command:"pageview"};top.window.postMessage(e,"*")},e.prototype.event=function(e,t,n,r){typeof t=="undefined"&&(t=undefined),typeof n=="undefined"&&(n=undefined),typeof r=="undefined"&&(r=0),this.debug&&console.info("TMI:event c:"+e+" a:"+t+" l:"+n+" v:"+r);var i={source:"_Star_TMI_",command:"event",category:e,action:t,label:n,value:r};top.window.postMessage(i,"*")},e}();t.TMI=n}),define("StarSimpleText/main",["require","exports","jquery","StarTMI/tmi"],function(e,t,n,r){var i=new r.TMI,s=function(){function e(){this.timer=null}return e.prototype.last_line_break_index=function(e,t){t=t>0?t-1:t;var n=0,r=e.lastIndexOf("\n",t);r!=-1&&(n=r);var i=e.lastIndexOf("\r",t);return i!=-1&&(n=n>i?n:i),n},e.prototype.last_space_index=function(e,t){var n=e.lastIndexOf(" ",t);return n},e.prototype.process_change=function(e){var t=this,n=document.getElementById(t.textarea_id);if(n){var r=!1,i=n.value,s=i.split(/[\n\r]/),o=[];for(var u in s){var a=s[u];if(a.length<t.config.cols){o.push(a);continue}var f=0,l=!1;while(a.length>=t.config.cols&&f<e){l=!1,f++;var c=t.last_space_index(a,t.config.cols);if(c==-1||c==0){o.push(a),l=!0;break}o.push(a.substr(0,c)),a=a.substr(a.charAt(c)==" "?c+1:c),l=!1}l||o.push(a)}n.value=o.join("\n"),console.info("NEW TEXT"),console.info(n.value)}},e.prototype.process=function(e){var t=this,n=document.getElementById(t.textarea_id);if(n){var r=0,i=!1,s=n.value,o=s.length;n.selectionStart&&(o=n.selectionStart);while(r<e){r++;var u=t.last_line_break_index(s,o);if(o-u<t.config.cols)break;var a=u+t.config.cols,f=t.last_space_index(s,a);if(f==-1)break;s=s.substr(0,f)+"\n"+s.substr(s.charAt(f)==" "?f+1:f),i=!0}i&&(n.value=s,n.selectionStart=o,n.selectionEnd=o,console.info(s))}},e.prototype.keyup=function(e,t){this.process(20),this.save_to_jshidden()},e.prototype.change=function(e,t){this.process_change(1e3),this.save_to_jshidden()},e.prototype.save_to_jshidden=function(){var e=document.getElementById(this.textarea_id),t=e.value,r=n("[name="+this.config.state+"]");this.config.show_length&&r.show().text(t.length+" characters");var i=n("#"+r.attr("inputid"));i.attr("value",encodeURI(t))},e.prototype.get_from_jshidden=function(){var e=n("[name="+this.config.state+"]"),t=n("#"+e.attr("inputid"));try{return decodeURI(t.attr("value"))}catch(r){return console.debug("value can not be decoded, failing back on raw"),t?t.attr("value"):""}},e.prototype.apply_css=function(){var e=document.getElementById(this.textarea_id);n(e).css("min-height","300px")},e.prototype.configure=function(e){i.event("StarSimpleText","Start"),this.config=e;var t=this,r=n("#"+e.element_id),s="";try{s=this.get_from_jshidden()}catch(o){console.info(o)}t.textarea_id=e.element_id+"_textarea",e.cols=e.cols?parseInt(e.cols):80,e.rows=e.rows?parseInt(e.rows):25;var u='<textarea id="'+t.textarea_id+'" cols="'+e.cols+'" rows="'+e.rows+'">'+s+"</textarea>";r.html(u),n("#"+t.textarea_id).off("keyup").off("change").off("blur").on("keyup",function(e){t.keyup(this,e)}).on("change",function(e){t.change(this,e)}).on("blur",function(e){t.change(this,e)}).ready(function(){t.apply_css()})},e}();t.StarSimpleText=s}),define("demo",["StarX/main","StarSimpleText/main"],function(e,t){var n=document.getElementById("insert_here");n.textContent='{["StarX":"StarSimpleText","state":"jshidden"]}',e.load(n),console.info("Hello")}),require(["demo"],function(e){console.info(e)});
    // here goes content

})(window);