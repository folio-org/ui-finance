import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Checkbox,
  Col,
  RepeatableField,
  Row,
  TextField,
} from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import {
  ADD_AVAILABLE_TO_OPTIONS,
  ROLLOVER_BUDGET_VALUE_OPTIONS,
  ROLLOVER_LEDGER_BUDGETS_HEAD_LABELS,
} from '../constants';

import SetAllowancesField from './SetAllowancesField';

const DEFAULT_FUND_TYPES_MAP = new Map();

const RolloverLedgerBudgets = ({ fundTypesMap = DEFAULT_FUND_TYPES_MAP }) => {
  const intl = useIntl();

  const renderBudgetFields = useCallback((elem, index, fields) => {
    const { setAllowances } = fields.value[index];

    return (
      <Row>
        <Col xs={2}>
          {fundTypesMap.get(fields.value[index].fundTypeId)?.name || <FormattedMessage id="ui-finance.ledger.rollover.noFundType" />}
        </Col>
        <Col xs={2}>
          <Field
            component={Checkbox}
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.allocation' })}
            name={`${elem}.rolloverAllocation`}
            type="checkbox"
            validateFields={[]}
            vertical
          />
        </Col>
        <Col xs={1}>
          <Field
            component={TextField}
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.adjustAllocation' })}
            name={`${elem}.adjustAllocation`}
            type="number"
            validateFields={[]}
          />
        </Col>
        <Col xs={2}>
          <FieldSelectFinal
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.rolloverBudgetValue' })}
            dataOptions={ROLLOVER_BUDGET_VALUE_OPTIONS}
            id={`${elem}.rolloverBudgetValue`}
            name={`${elem}.rolloverBudgetValue`}
            required
            validateFields={[]}
          />
        </Col>
        <Col xs={2}>
          <FieldSelectFinal
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.addAvailableAs' })}
            dataOptions={ADD_AVAILABLE_TO_OPTIONS}
            id={`${elem}.addAvailableTo`}
            name={`${elem}.addAvailableTo`}
            required
            validateFields={[]}
          />
        </Col>
        <Col xs={1}>
          <SetAllowancesField
            elem={elem}
            setAllowances={setAllowances}
          />
        </Col>
        <Col xs={1}>
          <Field
            component={TextField}
            disabled={!setAllowances}
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.allowableEncumbrance' })}
            name={`${elem}.allowableEncumbrance`}
            type="number"
            validateFields={[]}
          />
        </Col>
        <Col xs={1}>
          <Field
            component={TextField}
            disabled={!setAllowances}
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.allowableExpenditure' })}
            name={`${elem}.allowableExpenditure`}
            type="number"
            validateFields={[]}
          />
        </Col>
      </Row>
    );
  }, [fundTypesMap, intl]);

  const fieldArrayProps = useFieldArray('budgetsRollover');

  return (
    <RepeatableField
      headLabels={ROLLOVER_LEDGER_BUDGETS_HEAD_LABELS}
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

export default RolloverLedgerBudgets;
