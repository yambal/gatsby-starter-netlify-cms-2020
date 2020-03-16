import React from 'react'
import BlogPostPage from '../pages/BlogPostPage'

const BlogPostPreview = ({ entry, widgetFor }) => (
  <BlogPostPage
    content={widgetFor('body')}
    description={entry.getIn(['data', 'description'])}
    tags={entry.getIn(['data', 'tags'])}
    title={entry.getIn(['data', 'title'])}
  />
)

export default BlogPostPreview
