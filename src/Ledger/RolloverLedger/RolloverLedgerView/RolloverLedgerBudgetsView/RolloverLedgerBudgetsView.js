import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  filter,
  flow,
  keyBy,
  map,
  uniq,
} from 'lodash/fp';

import {
  Checkbox,
  Col,
  Loading,
  Row,
} from '@folio/stripes/components';

import { useFundTypesBatch } from '../../../../common/hooks';
import {
  ADD_AVAILABLE_TO_LABEL,
  ROLLOVER_BUDGET_VALUE,
  ROLLOVER_BUDGET_VALUE_LABELS,
  ROLLOVER_LEDGER_BUDGETS_HEAD_LABELS,
} from '../../../constants';
import { RolloverListValue } from '../RolloverListValue';

import css from '../RolloverLedgerView.css';

export const RolloverLedgerBudgetsView = ({ rollover }) => {
  const intl = useIntl();

  const budgetsRollover = useMemo(() => rollover?.budgetsRollover || [], [rollover]);

  const fundTypeIds = useMemo(() => (
    flow(
      map((item) => item?.fundTypeId),
      filter(Boolean),
      uniq,
    )(budgetsRollover)
  ), [budgetsRollover]);

  const { isLoading, fundTypes } = useFundTypesBatch(fundTypeIds);

  const fundTypesMap = useMemo(() => (
    keyBy('id', fundTypes)
  ), [fundTypes]);

  const renderBudgetFields = useCallback((budgetRollover) => {
    const {
      addAvailableTo,
      adjustAllocation,
      allowableEncumbrance,
      allowableExpenditure,
      fundTypeId,
      rolloverAllocation,
      rolloverBudgetValue,
      setAllowances,
    } = budgetRollover;

    return (
      <Row>
        <Col xs={2}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.fundType' })}
            value={fundTypesMap[fundTypeId]?.name || <FormattedMessage id="ui-finance.ledger.rollover.noFundType" />}
          />
        </Col>
        <Col xs={2}>
          <Checkbox
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.allocation' })}
            checked={!!rolloverAllocation}
            disabled
            vertical
          />
        </Col>
        <Col xs={1}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.adjustAllocation' })}
            value={adjustAllocation}
          />
        </Col>
        <Col xs={2}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.rolloverBudgetValue' })}
            value={<FormattedMessage id={ROLLOVER_BUDGET_VALUE_LABELS[rolloverBudgetValue || ROLLOVER_BUDGET_VALUE.none]} />}
          />
        </Col>
        <Col xs={2}>
          <RolloverListValue aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.addAvailableAs' })}>
            <FormattedMessage id={ADD_AVAILABLE_TO_LABEL[addAvailableTo]} />
          </RolloverListValue>
        </Col>
        <Col xs={1}>
          <Checkbox
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.setAllowances' })}
            checked={!!setAllowances}
            disabled
            vertical
          />
        </Col>
        <Col xs={1}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.allowableEncumbrance' })}
            value={allowableEncumbrance}
          />
        </Col>
        <Col xs={1}>
          <RolloverListValue
            aria-label={intl.formatMessage({ id: 'ui-finance.ledger.rollover.allowableExpenditure' })}
            value={allowableExpenditure}
          />
        </Col>
      </Row>
    );
  }, [fundTypesMap, intl]);

  if (isLoading) return <Loading />;

  return (
    <ul className={css.rolloverList}>
      {!!budgetsRollover.length && <li>{ROLLOVER_LEDGER_BUDGETS_HEAD_LABELS}</li>}
      {budgetsRollover.map(
        (budgetRollover, i) => <li key={budgetRollover.fundTypeId || i}>{renderBudgetFields(budgetRollover)}</li>,
      )}
    </ul>
  );
};

RolloverLedgerBudgetsView.propTypes = {
  rollover: PropTypes.object.isRequired,
};
