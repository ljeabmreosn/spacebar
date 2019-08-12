import React from 'react';
import { Query } from '@apollo/react-components';
import { QueryResult } from '@apollo/react-common';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
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

interface State {
  hidden: boolean;
}

export default class LeaderBoard extends React.Component<Props, State> {
  api: GridApi | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      hidden: true,
    };
  }

  onGridReady = (event: GridReadyEvent) => {
    this.api = event.api;
    this.api.sizeColumnsToFit();

    this.setState({
      hidden: false,
    })
  }

  onQuery = ({ data, loading, error }: QueryResult<spacebar.Query>) => {
    if (error) return <h3>Error: {error.message}</h3>;

    const rowData = !loading ? data!.getTopPlayers : [];
    const { hidden } = this.state;

    return (
      <div className="ag-theme-balham sb-leaderboard">
        <div id="left"></div>
        <div id="center" className={`${hidden || loading ? 'bp3-skeleton' : ''}`}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={this.onGridReady}
          />
        </div>
        <div id="right"></div>
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