import React from 'react'
import Content from '../Content'
import { ssmlMaxLength } from 'gatsby-plugin-speach-podcast'

const PodcastPreview: React.FC<any> = props => {
  const PostContent = props.contentComponent || Content
  const { entry, widgetFor } = props

  const content = widgetFor('body')

  return (
    <React.Fragment>
      <div>{ssmlMaxLength(content)}</div>
      <PostContent content={content} />
    </React.Fragment>
  )

}

export default PodcastPreview