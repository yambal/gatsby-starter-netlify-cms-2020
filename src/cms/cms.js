import CMS from 'netlify-cms-app'
import uploadcare from 'netlify-cms-media-library-uploadcare'
import cloudinary from 'netlify-cms-media-library-cloudinary'

import AboutPagePreview from '../components/templates/AboutPagePreview'
import BlogPostPreview from '../components/templates/BlogPostPreview'
import IndexPagePreview from '../components/templates/IndexPagePreview'
import MusicAlbumsPreview from '../components/templates/MusicAlbumsPreview'

CMS.registerMediaLibrary(uploadcare)
CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('BlogPost', BlogPostPreview)
CMS.registerPreviewTemplate('MusicAlbum', MusicAlbumsPreview)
