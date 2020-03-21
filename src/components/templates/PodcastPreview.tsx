import React from 'react'
import Content from '../Content'
import { ssmlMaxLength } from 'gatsby-plugin-speach-podcast'

const PodcastPreview: React.FC<any> = props => {
  const PostContent = props.contentComponent || Content
  const { entry, widgetFor } = props

  const content: string = widgetFor('body')
  console.log(ssmlMaxLength(content))

  return (
    <React.Fragment>
      <pre>{JSON.stringify(ssmlMaxLength, null,2)}</pre>
      <PostContent content={content} />
    </React.Fragment>
  )

}

export default PodcastPreview