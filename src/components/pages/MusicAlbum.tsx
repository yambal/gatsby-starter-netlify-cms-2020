import React from 'react'
var _ = require('lodash');
import { Link } from 'gatsby'
import Content from '../Content'
import styled from 'styled-components';
import Container from '../Container';
import Column from '../atoms/Column';
import { Helmet } from 'react-helmet';
import PageTitle from '../atoms/PageTitle';

export const MusicAlbum:React.FC = (props) => {
  return (
    <pre>{JSON.stringify(props, null, 2)}</pre>
  )
}

export default MusicAlbum
