import React from 'react'
import PropTypes from 'prop-types'
import BlogPostPage from '../pages/BlogPostPage'

const BlogPostPreview = ({ entry, widgetFor }) => (
  <BlogPostPage
    content={widgetFor('body')}
    description={entry.getIn(['data', 'description'])}
    tags={entry.getIn(['data', 'tags'])}
    title={entry.getIn(['data', 'title'])}
  />
)

BlogPostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default BlogPostPreview
