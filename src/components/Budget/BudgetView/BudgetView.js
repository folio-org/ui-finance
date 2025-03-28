import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Col,
  ExpandAllButton,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import ExpenseClasses from '../../../common/ExpenseClasses';
import FinancialSummary from '../../../common/FinancialSummary';
import { SECTIONS_BUDGET } from '../constants';
import BudgetInformation from './BudgetInformation';

const BudgetView = forwardRef(({
  budget,
  expenseClassesTotals,
  fiscalStart,
  fiscalEnd,
  fiscalYearCurrency,
}, ref) => {
  return (
    <AccordionStatus ref={ref}>
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton />
        </Col>
      </Row>
      <AccordionSet>
        <Accordion
          label={<FormattedMessage id="ui-finance.budget.summary.title" />}
          id={SECTIONS_BUDGET.SUMMARY}
        >
          {budget.metadata && <ViewMetaData metadata={budget.metadata} />}
          <FinancialSummary
            data={budget}
            fiscalYearCurrency={fiscalYearCurrency}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-finance.budget.information.title" />}
          id={SECTIONS_BUDGET.INFORMATION}
        >
          <BudgetInformation
            allowableEncumbrance={budget.allowableEncumbrance}
            allowableExpenditure={budget.allowableExpenditure}
            budgetStatus={budget.budgetStatus}
            expenditures={budget.expenditures}
            fiscalEnd={fiscalEnd}
            fiscalStart={fiscalStart}
            fiscalYearCurrency={fiscalYearCurrency}
            name={budget.name}
            id={budget.id}
          />
        </Accordion>

        {Boolean(expenseClassesTotals.length) && (
          <Accordion
            label={<FormattedMessage id="ui-finance.budget.expenseClasses.title" />}
            id={SECTIONS_BUDGET.EXPENSE_CLASSES}
          >
            <ExpenseClasses
              currency={fiscalYearCurrency}
              expenseClassesTotals={expenseClassesTotals}
              id="budget-expense-classes"
            />
          </Accordion>
        )}
      </AccordionSet>
    </AccordionStatus>
  );
});

BudgetView.propTypes = {
  budget: PropTypes.object.isRequired,
  expenseClassesTotals: PropTypes.arrayOf(PropTypes.object).isRequired,
  fiscalStart: PropTypes.string,
  fiscalEnd: PropTypes.string,
  fiscalYearCurrency: PropTypes.string,
};

BudgetView.defaultProps = {
  fiscalStart: '',
  fiscalEnd: '',
};

export default BudgetView;
