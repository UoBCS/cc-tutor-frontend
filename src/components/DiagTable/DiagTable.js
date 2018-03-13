import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { For, Choose } from 'react-extras';
import DataPlaceholder from 'components/DataPlaceholder/DataPlaceholder';
import './DiagTable.css';

export default class DiagTable extends Component {

  renderers = {
    columnHeader: (col, idx) => (
      <Table.HeaderCell key={idx}>{col}</Table.HeaderCell>
    ),

    row: (contents, cols) => (row, idx) => (
      <Table.Row key={idx}>
        <For of={cols} render={this.renderers.col(contents, idx)}/>
      </Table.Row>
    ),

    col: (contents, rowIdx) => (col, colIdx) => (
      <Table.Cell key={colIdx}>
        <Choose>
          <Choose.When condition={colIdx > rowIdx}>
            {contents[rowIdx] ? contents[rowIdx][colIdx - (rowIdx + 1)] + '' : null}
          </Choose.When>

          <Choose.Otherwise disabled>
            -
          </Choose.Otherwise>
        </Choose>
      </Table.Cell>
    )
  }

  render() {
    const { data } = this.props;

    return (
      <Choose>
        <Choose.When condition={data === null}>
          <DataPlaceholder
            title='Table'
            subtitle='Table of all pair of states'
            icon='book'
          />
        </Choose.When>

        <Choose.Otherwise>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <For of={data ? data.cols : []} render={this.renderers.columnHeader}/>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <For of={data ? data.rows : []} render={this.renderers.row(data ? data.contents : [], data ? data.cols : [])}/>
            </Table.Body>
          </Table>
        </Choose.Otherwise>
      </Choose>
    );
  }

}
