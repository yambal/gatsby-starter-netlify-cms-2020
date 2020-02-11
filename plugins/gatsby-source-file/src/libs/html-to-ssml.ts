const HtmlToSSML = (channelTitle, cnannelDescription, title, markdown) => {

  console.log(cnannelDescription)
  const openning = `
  <par>
    <media begin="4s" xml:id="openingtalk">
      <emphasis level="strong">
        <prosody rate="slow" pitch="+1st">${channelTitle}</prosody>
      </emphasis>
      <break time="2s" />
        ${cnannelDescription}
    </media>
    <media begin="1s" soundLevel="-24dB" fadeOutDur="4s" end="openingtalk.end+5s">
      <audio src="https://www.yambal.net/audio/se/bgm01.mp3"/>
    </media>
  </par>
  `

  // <audio src="https://www.yambal.net/audio/se/opening01.mp3"/>

  const header = `
  <emphasis level="strong">
      ${title}
  </emphasis>
  <break time="3s" />`

  let ssml = `<speak>
    <prosody rate="125%">
      ${openning}
      ${header}
      ${markdown}
    </prosody>
  </speak>`

  ssml = ssml.split('</p>').join('</p><break time="2s" />');
  ssml = ssml.split('<br>').join('<break time="1s" />');

  // console.log(ssml)

  return ssml
}

export default HtmlToSSML

// <audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"></audio>