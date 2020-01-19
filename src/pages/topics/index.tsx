import React from 'react'
import Layout from '../../components/Layout'
import Container from '../../components/Container'
import { Router, RouteComponentProps } from "@reach/router"
import { Link } from 'gatsby'
import StudyRouterPage from '../../components/morequles/StudyRouterPage'
import styled from 'styled-components'

interface iTopicsIndex {

}

const TopicsIndex: React.FC<iTopicsIndex> = (props) => {
    return(
      <Layout dark>
        <Container>
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </Container>
      </Layout>
    )
  }

export default TopicsIndex
