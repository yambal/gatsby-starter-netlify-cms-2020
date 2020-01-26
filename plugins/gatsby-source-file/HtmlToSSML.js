module.exports = function HtmlToToSSML(title, markdown) {

    

    const header = `<emphasis level="strong">${title}</emphasis><break time="3s" /><audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"></audio>`

    const ssml = `<speak>${header}${markdown}</speak>`
    console.log(ssml)
    return ssml
}