exports.onPostBuild = require("./on-post-build");
exports.setFieldsOnGraphQLNodeType = require("./set-fields-on-graphql-node-type");
exports.createPages = require("./create-pages");

/*
const nodeHtmlToImage = require('node-html-to-image')

nodeHtmlToImage({
  output: './image.png',
  html: `<html>
    <head>
      <style>
        body {
          width: 2480px;
          height: 3508px;
        }
      <style>
      </style>
    </head>
    <body>Hello world!</body>
  </html>
  `
})
  .then(() => console.log('The image was created successfully!'))
*/