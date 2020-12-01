import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Label,
  Row,
  RepeatableField,
} from '@folio/stripes/components';

const headLabels = (
  <Row>
    <Col xs={2}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.fundType" />
      </Label>
    </Col>

    <Col xs={2}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.allocation" />
      </Label>
    </Col>
  </Row>
);

const RolloverLedgerBudgets = () => {
  const renderBudgetFields = (elem, index, fields) => {
    return (
      undefined
    );
  };

  return (
    <FieldArray
      headLabels={headLabels}
      component={RepeatableField}
      id="budgets"
      name="budgets"
      renderField={renderBudgetFields}
    />
  );
};

RolloverLedgerBudgets.propTypes = {
};

RolloverLedgerBudgets.defaultProps = {
};

export default RolloverLedgerBudgets;
