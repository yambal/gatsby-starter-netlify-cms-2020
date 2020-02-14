import * as marked from 'marked'

export const mdToSsml = (markdown, title?: string, description?: string) => {
  const renderer = new marked.Renderer()



  renderer.heading = function (text, level, raw, slug) {
    // console.log(slug)
    return `<par>
  <media>
    <emphasis level="strong">
    ${text}
    </emphasis>
  </media>
</par>
`};

  // Blockquote
  renderer.blockquote = (text) => {
    return `<p><prosody rate="slow">${text}</prosody></p><break time="2s" />\n`}

  // p
  renderer.paragraph = (text) => {
    return `<p>${text}</p><break time="2s" />\n`}

  // hr
  renderer.hr= () => {
    return `<break time="3s" />\n`}

  // list
  renderer.list = (body: string, ordered: boolean, start: number) => {
    return `<p>${body}</p>`}
  renderer.listitem = (text: string, task: boolean, checked: boolean) => {
    return `<p>${text}</p>`}

  // Strong
  renderer.strong = function (text) {
    return `<emphasis level="strong">${text}</emphasis>`
  };

  // BR
  renderer.br = function () {
    return `<break time="1s" />\n`
  };

  const parsed = marked(markdown, { renderer: renderer })

  const openning = `<emphasis level="strong">
  <prosody rate="slow" pitch="+1st">${title}</prosody>
</emphasis>
<break time="2s" />${description}<break time="2s" />\n`

  return `${openning}${parsed}`
}

// <audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"></audio>