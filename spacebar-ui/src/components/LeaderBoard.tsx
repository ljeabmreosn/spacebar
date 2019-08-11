import React from 'react';
import { Query } from '@apollo/react-components';
import { QueryResult } from '@apollo/react-common';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import gql from 'graphql-tag';

import * as spacebar from 'types/spacebar';

import 'styles/LeaderBoard.css';


const QUERY_LEADERBOARD = gql`
  query ($numPlayers: Int!) {
    getTopPlayers(numPlayers: $numPlayers) {
      name
      score
      id
    }
  }
`
;

const columnDefs: ColDef[] = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Score', field: 'score' },
  { headerName: 'ID', field: 'id', hide: true },
];

interface Props { }

interface State { }

export default class LeaderBoard extends React.Component<Props, State> {
  onQuery = ({ data, loading, error }: QueryResult<spacebar.Query>) => {
    if (error) return <h3>Error: {error.message}</h3>;
    if (loading) return <h3>Loading ...</h3>;

    const rowData = data!.getTopPlayers;

    return (
      <div className="ag-theme-balham" style={{ width: '100%', height: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
        />
      </div>
    );
  };

  render = () => (
    <Query
      query={QUERY_LEADERBOARD}
      variables={{ numPlayers: 10 }}
      pollInterval={5000}
    >
      {this.onQuery}
    </Query>
  )
}