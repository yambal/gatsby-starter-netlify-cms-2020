"use strict";
exports.__esModule = true;
exports.getChannelOption = function (channel, option) {
    var channelOptions = option.channels;
    return channel && channel !== 'null' && channelOptions[channel]
        ? channelOptions[channel]
        : channelOptions["default"] ? channelOptions["default"] : null;
};
exports.getSiteUrl = function (option) {
    return option.siteURL;
};
exports.getAudioPath = function (option) {
    return option.audioDir;
};
exports.getChannelTitle = function (channel, option) {
    var channelOption = exports.getChannelOption(channel, option);
    return channelOption ? channelOption.title : 'channel title is not set';
};
