module.exports = function HtmlToToSSML(title, markdown) {

    const header = `<emphasis level="strong">${title}</emphasis><break time="3000ms"/>`

    const ssml = `<speak>${header}${markdown}</speak>`
    console.log(ssml)
    return ssml
}