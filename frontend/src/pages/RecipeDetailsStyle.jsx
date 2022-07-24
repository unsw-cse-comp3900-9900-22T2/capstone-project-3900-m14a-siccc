import styled from 'styled-components';

export const Image = styled.img`
  height: 140px;
  width: auto;
  @media screen and (max-width: 960px) {
    width: 200px;
  }
`;

export const ImageMaxWidth = styled.div`
  width: 300px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  @media screen and (max-width: 960px) {
    min-width: 300px;
  }
`

export const CenterImage = styled.div`
  text-align: center;
`;

import * as React from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';



