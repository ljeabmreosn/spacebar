import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-components';

import LeaderBoard from 'components/LeaderBoard';


const client = new ApolloClient({
  uri: 'http://localhost:9000',
});


const SpacebarMainPage = () => (
  <ApolloProvider client={client}>
    <LeaderBoard />
  </ApolloProvider>
);

export default SpacebarMainPage;