import React from 'react'

interface iTopicPage {
    topic: any
    page?: number
}

const TopicPage:React.FC<iTopicPage> = props => {
    return (
        <div>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </div>
    )
}

export default TopicPage