import React from 'react'
import PropTypes from 'prop-types'
import AboutPagePage from '../pages/AboutPagePage'

const AboutPagePreview = ({ entry, widgetFor }) => (
  <AboutPagePage
    title={entry.getIn(['data', 'title'])}
    content={widgetFor('body')}
  />
)

AboutPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default AboutPagePreview
