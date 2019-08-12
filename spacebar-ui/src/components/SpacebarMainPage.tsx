import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-components';
import dotenv from 'dotenv';

import Game from 'components/Game';


dotenv.config();

const { REACT_APP_GQL_HOST = 'localhost', REACT_APP_GQL_PORT = 9000 } = process.env;

const client = new ApolloClient({
  uri: `http://${REACT_APP_GQL_HOST}:${REACT_APP_GQL_PORT}`,
});


const SpacebarMainPage = () => (
  <ApolloProvider client={client}>
    <Game />
  </ApolloProvider>
);

export default SpacebarMainPage;