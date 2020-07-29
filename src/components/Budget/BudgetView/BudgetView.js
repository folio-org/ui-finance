import React from 'react';
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
import { SECTIONS_BUDGET } from '../constants';
import BudgetSummary from './BudgetSummary';
import BudgetInformation from './BudgetInformation';

const BudgetView = ({ budget, expenseClassesTotals, fiscalStart, fiscalEnd, fiscalYearCurrency }) => {
  return (
    <>
      <AccordionStatus>
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
            <BudgetSummary
              budget={budget}
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
              awaitingPayment={budget.awaitingPayment}
              budgetStatus={budget.budgetStatus}
              encumbered={budget.encumbered}
              expenditures={budget.expenditures}
              fiscalEnd={fiscalEnd}
              fiscalStart={fiscalStart}
              fiscalYearCurrency={fiscalYearCurrency}
              name={budget.name}
              id={budget.id}
              overEncumbrance={budget.overEncumbrance}
              overExpended={budget.overExpended}
            />
          </Accordion>

          {Boolean(expenseClassesTotals.length) && (
            <Accordion
              label={<FormattedMessage id="ui-finance.budget.expenseClasses.title" />}
              id={SECTIONS_BUDGET.EXPENSE_CLASSES}
            >
              <ExpenseClasses
                expenseClassesTotals={expenseClassesTotals}
                id="budget-expense-classes"
              />
            </Accordion>
          )}
        </AccordionSet>
      </AccordionStatus>
    </>
  );
};

BudgetView.propTypes = {
  budget: PropTypes.object,
  expenseClassesTotals: PropTypes.arrayOf(PropTypes.object),
  fiscalStart: PropTypes.string,
  fiscalEnd: PropTypes.string,
  fiscalYearCurrency: PropTypes.string,
};

BudgetView.defaultProps = {
  budget: {},
  fiscalStart: '',
  fiscalEnd: '',
};

export default BudgetView;
