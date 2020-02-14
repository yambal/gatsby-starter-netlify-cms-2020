"use strict";
exports.__esModule = true;
var marked = require("marked");
exports.mdToSsml = function (markdown, title, description) {
    var renderer = new marked.Renderer();
    renderer.heading = function (text, level, raw, slug) {
        // console.log(slug)
        return "<par>\n  <media>\n    <emphasis level=\"strong\">\n    " + text + "\n    </emphasis>\n  </media>\n</par>\n";
    };
    // Blockquote
    renderer.blockquote = function (text) {
        return "<p><prosody rate=\"slow\">" + text + "</prosody></p><break time=\"2s\" />\n";
    };
    // p
    renderer.paragraph = function (text) {
        return "<p>" + text + "</p><break time=\"2s\" />\n";
    };
    // hr
    renderer.hr = function () {
        return "<break time=\"3s\" />\n";
    };
    // list
    renderer.list = function (body, ordered, start) {
        return "<p>" + body + "</p>";
    };
    renderer.listitem = function (text, task, checked) {
        return "<p>" + text + "</p>";
    };
    // Strong
    renderer.strong = function (text) {
        return "<emphasis level=\"strong\">" + text + "</emphasis>";
    };
    // BR
    renderer.br = function () {
        return "<break time=\"1s\" />\n";
    };
    var parsed = marked(markdown, { renderer: renderer });
    var openning = "<emphasis level=\"strong\">\n  <prosody rate=\"slow\" pitch=\"+1st\">" + title + "</prosody>\n</emphasis>\n<break time=\"2s\" />" + description + "<break time=\"2s\" />\n";
    return "" + openning + parsed;
};
// <audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"></audio>
