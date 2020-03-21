import React from 'react'
import Content from '../Content'
import { ssmlMaxLength } from 'gatsby-plugin-speach-podcast'

const PodcastPreview: React.FC<any> = props => {
  const PostContent = props.contentComponent || Content
  const { entry, widgetFor } = props

  const content: any = widgetFor('body')
  console.log(10, content)

  let maxLexgth = 0
  if (content && content.props && content.props.value) {
    maxLexgth = ssmlMaxLength(content.props.value)
  }

  return (
    <React.Fragment>
      <pre>{maxLexgth}</pre>
      <PostContent content={content} />
    </React.Fragment>
  )

}

export default PodcastPreview