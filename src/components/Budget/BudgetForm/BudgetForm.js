import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  MenuSection,
  Pane,
  Paneset,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FormFooter,
} from '@folio/stripes-acq-components';

import FinancialSummary from '../../../common/FinancialSummary';
import { FUNDS_ROUTE } from '../../../common/const';
import { SECTIONS_BUDGET } from '../constants';
import BudgetInformationFields from './BudgetInformationFields';
import BudgetExpenseClassesFields from './BudgetExpenseClassesFields';

const BudgetForm = ({
  expenseClasses,
  fiscalYear,
  handleSubmit,
  initialValues,
  onClose,
  pristine,
  submitting,
  values,
}) => {
  const accordionStatusRef = useRef();
  const history = useHistory();
  const { periodStart, periodEnd, currency } = fiscalYear;

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="ui-finance.saveAndClose" />}
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      onCancel={onClose}
    />
  );

  const renderActionMenu = () => (
    <MenuSection id="budget-actions">
      <IfPermission perm="finance.budgets.item.delete">
        <Button
          buttonStyle="dropdownItem"
          data-test-remove-budget-button
        >
          <Icon
            size="small"
            icon="trash"
          >
            <FormattedMessage id="ui-finance.actions.remove" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: onClose,
    },
    {
      name: 'save',
      handler: handleSubmit,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: () => history.push(FUNDS_ROUTE),
    },
  ];

  return (
    <form id="budget-edit-form">
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            actionMenu={renderActionMenu}
            defaultWidth="fill"
            dismissible
            footer={paneFooter}
            id="pane-budget"
            onClose={onClose}
            paneTitle={initialValues.name}
          >
            <Row>
              <Col
                xs={12}
                md={8}
                mdOffset={2}
              >
                <AccordionStatus ref={accordionStatusRef}>
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
                      <ViewMetaData metadata={initialValues.metadata} />
                      <FinancialSummary
                        data={initialValues}
                        fiscalYearCurrency={currency}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-finance.budget.information.title" />}
                      id={SECTIONS_BUDGET.INFORMATION}
                    >
                      <BudgetInformationFields
                        fiscalEnd={periodEnd}
                        fiscalStart={periodStart}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-finance.budget.expenseClasses.title" />}
                      id={SECTIONS_BUDGET.EXPENSE_CLASSES}
                    >
                      <BudgetExpenseClassesFields
                        expenseClasses={expenseClasses}
                        formValues={values}
                      />
                    </Accordion>
                  </AccordionSet>
                </AccordionStatus>
              </Col>
            </Row>
          </Pane>
        </Paneset>
      </HasCommand>
    </form>

  );
};

BudgetForm.propTypes = {
  expenseClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
  fiscalYear: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(BudgetForm);
