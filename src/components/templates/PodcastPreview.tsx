import React from 'react'
import Content from '../Content'

const PodcastPreview: React.FC<any> = props => {
    const PostContent = props.contentComponent || Content
    const { entry, widgetFor } = props

    const content = widgetFor('body')

    return (
        <PostContent content={content} />
    )

}

export default PodcastPreview