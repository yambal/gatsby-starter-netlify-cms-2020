import React from 'react'

const PodcastPreview = (props) => (
<pre>{JSON.stringify(props, null, 2)}</pre>
)

export default PodcastPreview