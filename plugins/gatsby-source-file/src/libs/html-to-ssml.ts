
const HtmlToSSML = (channelTitle, cnannelDescription, title, markdown) => {

  // console.log(markdown)

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
  <break time="2s" />`

  let ssml = `<speak>
    <prosody rate="125%">
      ${openning}
      ${header}
      ${markdown}
    </prosody>
  </speak>`

  // H1
  ssml = ssml.split('<h1>').join(`
    <par>
      <media begin="1.2s">
        <emphasis level="strong">`)
  ssml = ssml.split('</h1>').join(`
        </emphasis>
      </media>
      <media begin="0s" soundLevel="-10dB">
        <audio src="https://www.yambal.net/audio/se/title01.mp3"/>
      </media>
    </par><break time="2s" />`)

  // H2
  ssml = ssml.split('<h2>').join(`
    <par>
      <media begin="1.2s">
        <emphasis level="strong">`)
  ssml = ssml.split('</h2>').join(`
        </emphasis>
      </media>
      <media begin="0s" soundLevel="-20dB">
        <audio src="https://www.yambal.net/audio/se/title01.mp3"/>
      </media>
    </par><break time="1.75s" />`)


  // H3
  ssml = ssml.split('<h3>').join('<emphasis level="strong">')
  ssml = ssml.split('</h3>').join('</emphasis><break time="1.5s" />')

  // H4
  ssml = ssml.split('<h4>').join('<emphasis level="strong">')
  ssml = ssml.split('</h4>').join('</emphasis><break time="1.25s" />')

  // H5
  ssml = ssml.split('<h5>').join('<emphasis level="strong">')
  ssml = ssml.split('</h5>').join('</emphasis><break time="1s" />')

  ssml = ssml.split('</p>').join('</p><break time="2s" />');
  ssml = ssml.split('<br>').join('<break time="1s" />');

  // console.log(ssml)

  return ssml
}

export default HtmlToSSML

// <audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"></audio>