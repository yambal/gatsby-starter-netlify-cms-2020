'use strict';
exports.__esModule = true;
var versions = ['2.5', 'x', '2', '1'];
var layers = ['x', '3', '2', '1'];
var bitRates = {
    'V1Lx': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'V1L1': [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    'V1L2': [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    'V1L3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
    'V2Lx': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'V2L1': [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
    'V2L2': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    'V2L3': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    'VxLx': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'VxL1': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'VxL2': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    'VxL3': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
};
var sampleRates = {
    'x': [0, 0, 0],
    '1': [44100, 48000, 32000],
    '2': [22050, 24000, 16000],
    '2.5': [11025, 12000, 8000]
};
var samples = {
    x: {
        x: 0,
        1: 0,
        2: 0,
        3: 0
    },
    1: {
        x: 0,
        1: 384,
        2: 1152,
        3: 1152
    },
    2: {
        x: 0,
        1: 384,
        2: 1152,
        3: 576
    }
};
exports.getBuffer = function (buffer) {
    var scratch = Buffer.alloc(100);
    var bytesRead = buffer.copy(scratch, 0, 0, 100);
    if (bytesRead < 100)
        return 0;
    var offset = skipID3(scratch);
    var duration = 0;
    while (offset < buffer.length) {
        var bytesRead_1 = buffer.copy(scratch, 0, offset, offset + 10);
        if (bytesRead_1 < 10)
            return round(duration);
        // looking for 1111 1111 111 (frame synchronization bits)
        if (scratch[0] === 0xff && (scratch[1] & 0xe0) === 0xe0) {
            var header = parseFrameHeader(scratch);
            if (header.frameSize && header.samples) {
                offset += header.frameSize;
                duration += (header.samples / header.sampleRate);
            }
            else {
                offset++; // corrupt file?
            }
        }
        else if (scratch[0] === 0x54 && scratch[1] === 0x41 && scratch[2] === 0x47) { // TAG
            offset += 128; // skip over id3v1 tag size
        }
        else {
            offset++; // corrupt file?
        }
    }
    return round(duration);
};
function skipID3(buffer) {
    // http://id3.org/d3v2.3.0
    if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) { // ID3
        var id3v2Flags = buffer[5];
        var footerSize = (id3v2Flags & 0x10) ? 10 : 0;
        // ID3 size encoding is crazy (7 bits in each of 4 bytes)
        var z0 = buffer[6];
        var z1 = buffer[7];
        var z2 = buffer[8];
        var z3 = buffer[9];
        if (((z0 & 0x80) === 0) && ((z1 & 0x80) === 0) && ((z2 & 0x80) === 0) && ((z3 & 0x80) === 0)) {
            var tagSize = ((z0 & 0x7f) * 2097152) + ((z1 & 0x7f) * 16384) + ((z2 & 0x7f) * 128) + (z3 & 0x7f);
            return 10 + tagSize + footerSize;
        }
    }
    return 0;
}
function frameSize(samples, layer, bitRate, sampleRate, paddingBit) {
    if (layer === 1) {
        return (((samples * bitRate * 125 / sampleRate) + paddingBit * 4)) | 0;
    }
    else { // layer 2, 3
        return (((samples * bitRate * 125) / sampleRate) + paddingBit) | 0;
    }
}
function parseFrameHeader(header) {
    var b1 = header[1];
    var b2 = header[2];
    var versionBits = (b1 & 0x18) >> 3;
    var version = versions[versionBits];
    var simpleVersion = (version === '2.5' ? 2 : version);
    var layerBits = (b1 & 0x06) >> 1;
    var layer = layers[layerBits];
    var bitRateKey = 'V' + simpleVersion + 'L' + layer;
    var bitRateIndex = (b2 & 0xf0) >> 4;
    var bitRate = bitRates[bitRateKey][bitRateIndex] || 0;
    var sampleRateIdx = (b2 & 0x0c) >> 2;
    var sampleRate = sampleRates[version][sampleRateIdx] || 0;
    var sample = samples[simpleVersion][layer];
    var paddingBit = (b2 & 0x02) >> 1;
    return {
        bitRate: bitRate,
        sampleRate: sampleRate,
        frameSize: frameSize(sample, layer, bitRate, sampleRate, paddingBit),
        samples: sample
    };
}
function round(duration) {
    return Math.round(duration * 1000); // round to nearest ms
}
