import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
  Col,
  Row,
  ExpandAllButton,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { useAccordionToggle } from '@folio/stripes-acq-components';

import { SECTIONS_BUDGET } from '../constants';
import BudgetSummary from './BudgetSummary';
import BudgetInformation from './BudgetInformation';

const BudgetView = ({ budget, fiscalStart, fiscalEnd, fiscalYearCurrency }) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();

  return (
    <>
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>
      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
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
      </AccordionSet>
    </>
  );
};

BudgetView.propTypes = {
  budget: PropTypes.object,
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
