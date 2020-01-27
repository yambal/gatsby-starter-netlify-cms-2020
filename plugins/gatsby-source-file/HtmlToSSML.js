module.exports = function HtmlToToSSML(title, markdown) {
    var header = "<emphasis level=\"strong\">" + title + "</emphasis><break time=\"3s\" /><audio src=\"https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg\"></audio>";
    var ssml = "<speak>" + header + markdown + "</speak>";
    ssml;
    return ssml;
};
