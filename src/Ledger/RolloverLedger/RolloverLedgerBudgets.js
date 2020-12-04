import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Checkbox,
  Col,
  Label,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import { ADD_AVAILABLE_TO_OPTIONS } from '../constants';

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
    <Col xs={2}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.adjustAllocation" />
      </Label>
    </Col>
    <Col xs={2}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.available" />
      </Label>
    </Col>
    <Col xs={2}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.addAvailableTo" />
      </Label>
    </Col>
    <Col xs={1}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.allowableEncumbrance" />
      </Label>
    </Col>
    <Col xs={1}>
      <Label>
        <FormattedMessage id="ui-finance.ledger.rollover.allowableExpenditure" />
      </Label>
    </Col>
  </Row>
);

const RolloverLedgerBudgets = ({ fundTypesMap }) => {
  const renderBudgetFields = (elem, index, fields) => {
    return (
      <Row>
        <Col xs={2}>
          {fundTypesMap.get(fields.value[index].fundTypeId)?.name}
        </Col>
        <Col xs={2}>
          <Field
            component={Checkbox}
            label={null}
            name={`${elem}.rolloverAllocation`}
            type="checkbox"
            validateFields={[]}
            vertical
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            label={null}
            name={`${elem}.adjustAllocation`}
            type="number"
            validateFields={[]}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={Checkbox}
            label={null}
            name={`${elem}.rolloverAvailable`}
            type="checkbox"
            validateFields={[]}
            vertical
          />
        </Col>
        <Col xs={2}>
          <FieldSelectFinal
            dataOptions={ADD_AVAILABLE_TO_OPTIONS}
            id="add-available-to"
            name={`${elem}.addAvailableTo`}
            required
            validateFields={[]}
          />
        </Col>
        <Col xs={1}>
          <Field
            component={TextField}
            label={null}
            name={`${elem}.allowableEncumbrance`}
            type="number"
            validateFields={[]}
          />
        </Col>
        <Col xs={1}>
          <Field
            component={TextField}
            label={null}
            name={`${elem}.allowableExpenditure`}
            type="number"
            validateFields={[]}
          />
        </Col>
      </Row>
    );
  };

  return (
    <FieldArray
      component={RepeatableField}
      headLabels={headLabels}
      id="budgetsRollover"
      name="budgetsRollover"
      onRemove={false}
      renderField={renderBudgetFields}
    />
  );
};

RolloverLedgerBudgets.propTypes = {
  fundTypesMap: PropTypes.object,
};

RolloverLedgerBudgets.defaultProps = {
  fundTypesMap: new Map(),
};

export default RolloverLedgerBudgets;
