import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import AboutPagePreview from '../components/templates/AboutPagePreview'
import BlogPostPreview from '../components/templates/BlogPostPreview'
import IndexPagePreview from '../components/templates/IndexPagePreview'
import PodcastPreview from '../components/templates/PodcastPreview'

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('blog', BlogPostPreview)
CMS.registerPreviewTemplate('PodCast', PodcastPreview)
