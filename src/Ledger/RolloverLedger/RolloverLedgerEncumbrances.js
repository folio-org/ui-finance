import React, { useCallback } from 'react';
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

import {
  BASED_ON_OPTIONS,
  ORDER_TYPE_LABEL,
} from '../constants';
import HeadLabel from './HeadLabel';

const headLabels = (
  <Row>
    <HeadLabel translationId="ui-finance.ledger.rollover.orderType" />
    <HeadLabel translationId="ui-finance.ledger.rollover.rollover" />
    <HeadLabel translationId="ui-finance.ledger.rollover.basedOn" />
    <HeadLabel translationId="ui-finance.ledger.rollover.increaseBy" />
  </Row>
);

const RolloverLedgerEncumbrances = () => {
  const renderFields = useCallback((elem, index, fields) => {
    const { orderType, rollover } = fields.value[index];

    return (
      <Row>
        <Col xs={2}>
          {ORDER_TYPE_LABEL[orderType]}
        </Col>
        <Col xs={2}>
          <Field
            component={Checkbox}
            label={null}
            name={`${elem}.rollover`}
            type="checkbox"
            validateFields={[]}
            vertical
          />
        </Col>
        <Col xs={2}>
          <FieldSelectFinal
            dataOptions={BASED_ON_OPTIONS}
            disabled={!rollover}
            id="based-on"
            name={`${elem}.basedOn`}
            required={!!rollover}
            validateFields={[]}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            disabled={!rollover}
            label={null}
            name={`${elem}.increaseBy`}
            type="number"
            validateFields={[]}
          />
        </Col>
      </Row>
    );
  }, []);

  const fieldArrayProps = useFieldArray('encumbrancesRollover');

  return (
    <RepeatableField
      headLabels={headLabels}
      id="encumbrances-rollover"
      onRemove={false}
      renderField={renderFields}
      {...fieldArrayProps}
    />
  );
};

RolloverLedgerEncumbrances.propTypes = {
};

RolloverLedgerEncumbrances.defaultProps = {
};

export default RolloverLedgerEncumbrances;
