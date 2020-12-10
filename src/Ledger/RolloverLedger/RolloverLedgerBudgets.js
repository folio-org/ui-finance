import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  Checkbox,
  Col,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import { ADD_AVAILABLE_TO_OPTIONS } from '../constants';
import HeadLabel from './HeadLabel';

const headLabels = (
  <Row>
    <HeadLabel translationId="ui-finance.ledger.rollover.fundType" />
    <HeadLabel translationId="ui-finance.ledger.rollover.allocation" />
    <HeadLabel translationId="ui-finance.ledger.rollover.adjustAllocation" />
    <HeadLabel translationId="ui-finance.ledger.rollover.available" />
    <HeadLabel translationId="ui-finance.ledger.rollover.addAvailableAs" />
    <HeadLabel translationId="ui-finance.ledger.rollover.allowableEncumbrance" size={1} />
    <HeadLabel translationId="ui-finance.ledger.rollover.allowableExpenditure" size={1} />
  </Row>
);

const RolloverLedgerBudgets = ({ fundTypesMap }) => {
  const renderBudgetFields = useCallback((elem, index, fields) => {
    return (
      <Row>
        <Col xs={2}>
          {fundTypesMap.get(fields.value[index].fundTypeId)?.name || <FormattedMessage id="ui-finance.ledger.rollover.noFundType" />}
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
  }, [fundTypesMap]);

  const fieldArrayProps = useFieldArray('budgetsRollover');

  return (
    <RepeatableField
      headLabels={headLabels}
      id="budgetsRollover"
      onRemove={false}
      renderField={renderBudgetFields}
      {...fieldArrayProps}
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
