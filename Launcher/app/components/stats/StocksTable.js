import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import styles from './GameProfile.scss';

import * as moveUtils from '../../utils/moves';
import * as animationUtils from '../../utils/animations';
import * as timeUtils from '../../utils/time';

export default class StocksTable extends Component {
  props: {
    game: object,
    playerDisplay: object,
    playerIndex: number,
  };

  generateStockRow = (stock) => {
    let start = timeUtils.convertFrameCountToDurationString(stock.startFrame);
    let end = <span className={styles['secondary-text']}>–</span>;
    let death = <span className={styles['secondary-text']}>N/A</span>;

    const isFirstFrame = stock.startFrame === timeUtils.frames.START_FRAME;
    if (isFirstFrame) {
      start = <span className={styles['secondary-text']}>–</span>;
    }

    if (stock.endFrame) {
      end = timeUtils.convertFrameCountToDurationString(stock.endFrame);

      const killedBy = moveUtils.getMoveName(stock.moveKilledBy) || `Unknown (${stock.moveKilledBy})`;
      const deathDirection = animationUtils.getDeathDirection(stock.deathAnimation);
      const deathPercent = `${Math.trunc(stock.endPercent)}%`;

      death = `${killedBy} · ${deathDirection} · ${deathPercent}`;
    }

    return (
      <Table.Row key={`${stock.playerIndex}-stock-${stock.startFrame}`}>
        <Table.Cell>{start}</Table.Cell>
        <Table.Cell>{end}</Table.Cell>
        <Table.Cell>{death}</Table.Cell>
      </Table.Row>
    );
  };

  renderHeaderPlayer() {
    // TODO: Make generating the player display better
    return (
      <Table.Row>
        <Table.HeaderCell colSpan={3}>
          {this.props.playerDisplay}
        </Table.HeaderCell>
      </Table.Row>
    );
  }

  renderHeaderColumns() {
    return (
      <Table.Row>
        <Table.HeaderCell>Start</Table.HeaderCell>
        <Table.HeaderCell>End</Table.HeaderCell>
        <Table.HeaderCell>Death</Table.HeaderCell>
      </Table.Row>
    );
  }

  renderStocksRows() {
    const stats = this.props.game.getStats() || {};
    const stocks = _.get(stats, ['events', 'stocks']) || [];
    const stocksByPlayer = _.groupBy(stocks, 'playerIndex');
    const playerStocks = stocksByPlayer[this.props.playerIndex] || [];

    return playerStocks.map(this.generateStockRow);
  }

  render() {
    return (
      <Table
        className={styles['stats-table']}
        celled={true}
        inverted={true}
        selectable={true}
      >
        <Table.Header>
          {this.renderHeaderPlayer()}
          {this.renderHeaderColumns()}
        </Table.Header>

        <Table.Body>
          {this.renderStocksRows()}
        </Table.Body>
      </Table>
    );
  }
}
