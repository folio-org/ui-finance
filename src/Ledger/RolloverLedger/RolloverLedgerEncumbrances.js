import { useCallback } from 'react';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';
import { useIntl } from 'react-intl';

import {
  Col,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import {
  BASED_ON_OPTIONS,
  ORDER_TYPE_LABEL,
  ROLLOVER_ENCUMBRANCES_HEAD_LABELS,
} from '../constants';

import RolloverField from './RolloverField';

const RolloverLedgerEncumbrances = () => {
  const intl = useIntl();

  const renderFields = useCallback((elem, index, fields) => {
    const { orderType, rollover } = fields.value[index];

    return (
      <Row>
        <Col xs={2}>
          {ORDER_TYPE_LABEL[orderType]}
        </Col>
        <Col xs={2}>
          <RolloverField
            elem={elem}
            rollover={rollover}
          />
        </Col>
        <Col xs={2}>
          <FieldSelectFinal
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.basedOn' })}
            dataOptions={BASED_ON_OPTIONS}
            disabled={!rollover}
            id={`${elem}.basedOn`}
            name={`${elem}.basedOn`}
            required={!!rollover}
            validateFields={[]}
          />
        </Col>
        <Col xs={2}>
          <Field
            component={TextField}
            disabled={!rollover}
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.increaseBy' })}
            name={`${elem}.increaseBy`}
            type="number"
            validateFields={[]}
          />
        </Col>
      </Row>
    );
  }, [intl]);

  const fieldArrayProps = useFieldArray('encumbrancesRollover');

  return (
    <RepeatableField
      headLabels={ROLLOVER_ENCUMBRANCES_HEAD_LABELS}
      id="encumbrances-rollover"
      onRemove={false}
      renderField={renderFields}
      {...fieldArrayProps}
    />
  );
};

export default RolloverLedgerEncumbrances;
