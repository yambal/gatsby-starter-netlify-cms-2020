"use strict";
exports.__esModule = true;
var HtmlToSSML = function (channelTitle, cnannelDescription, title, markdown) {
    console.log(cnannelDescription);
    var openning = "\n  <par>\n    <media begin=\"4s\" xml:id=\"openingtalk\">\n      <emphasis level=\"strong\">\n        <prosody rate=\"slow\" pitch=\"+1st\">" + channelTitle + "</prosody>\n      </emphasis>\n      <break time=\"2s\" />\n        " + cnannelDescription + "\n    </media>\n    <media begin=\"1s\" soundLevel=\"-24dB\" fadeOutDur=\"4s\" end=\"openingtalk.end+5s\">\n      <audio src=\"https://www.yambal.net/audio/se/bgm01.mp3\"/>\n    </media>\n  </par>\n  ";
    // <audio src="https://www.yambal.net/audio/se/opening01.mp3"/>
    var header = "\n  <emphasis level=\"strong\">\n      " + title + "\n  </emphasis>\n  <break time=\"3s\" />";
    var ssml = "<speak>\n    <prosody rate=\"125%\">\n      " + openning + "\n      " + header + "\n      " + markdown + "\n    </prosody>\n  </speak>";
    ssml = ssml.split('</p>').join('</p><break time="2s" />');
    ssml = ssml.split('<br>').join('<break time="1s" />');
    // console.log(ssml)
    return ssml;
};
exports["default"] = HtmlToSSML;
// <audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"></audio>
