import React from 'react'
import MusicAlbum from '../pages/MusicAlbum'

const MusicAlbumsPreview = ({ entry, getAsset }) => {
  const data = entry.getIn(['data']).toJS()

  if (data) {
    return (
        <pre>{JSON.stringify(data, null, 2)}</pre>
    )
  } else {
    return <div>Loading...</div>
  }
}

export default MusicAlbumsPreview