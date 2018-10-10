import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Row, Col } from '@folio/stripes/components';
import css from './css/BudgetOverview.css';

class BudgetOverview extends Component {
  static propTypes = {
    initialValues: PropTypes.object
  }


  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { initialValues } = this.props;
    const allocation = Number(_.get(initialValues, ['allocation'], ''));
    const awaitingPayment = Number(_.get(initialValues, ['awaiting_payment'], ''));
    const encumbered = Number(_.get(initialValues, ['encumbered'], ''));
    const unavailableSlot = Number(awaitingPayment + encumbered).toFixed(2);
    const availableSlot = Number((allocation - awaitingPayment) - encumbered).toFixed(2);


    return (
      <div className={css.BudgetOverview}>
        <Row center="xs">
          <Col xs={4} className={css.colGrid}>
            <div className={css.lbl}>Allocated</div>
            <div className={[css.num, css.darkgray].join(' ')}>{allocation}</div>
          </Col>
          <Col xs={4} className={css.colGrid}>
            <div className={css.lbl}>Unavailable</div>
            <div className={[css.num, css.red].join(' ')}>{unavailableSlot}</div>
          </Col>
          <Col xs={4} className={css.colGrid}>
            <div className={css.lbl}>Available</div>
            <div className={[css.num, css.green].join(' ')}>{availableSlot}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BudgetOverview;
