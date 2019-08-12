import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-components';

import Game from 'components/Game';


const client = new ApolloClient({
  uri: 'http://localhost:9000',
});


const SpacebarMainPage = () => (
  <ApolloProvider client={client}>
    <Game />
  </ApolloProvider>
);

export default SpacebarMainPage;