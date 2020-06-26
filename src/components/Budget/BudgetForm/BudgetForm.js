import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Icon,
  Paneset,
  MenuSection,
  Pane,
  AccordionSet,
  Accordion,
  Col,
  Row,
  ExpandAllButton,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { IfPermission } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FormFooter,
  useAccordionToggle,
} from '@folio/stripes-acq-components';

import { BUDGET_FORM, SECTIONS_BUDGET } from '../constants';
import BudgetSummary from '../BudgetView/BudgetSummary';
import BudgetInformationFields from './BudgetInformationFields';

const BudgetForm = ({
  parentResources,
  handleSubmit,
  initialValues,
  pristine,
  submitting,
  onClose,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const fiscalYear = get(parentResources, ['fiscalYear', 'records', 0], {});
  const { periodStart, periodEnd } = fiscalYear;

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
      <IfPermission perm="ui-finance.fund-budget.delete">
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

  return (
    <form id="budget-edit-form">
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
                  {initialValues.metadata && <ViewMetaData metadata={initialValues.metadata} />}
                  <BudgetSummary
                    budget={initialValues}
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
              </AccordionSet>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>

  );
};

BudgetForm.propTypes = {
  parentResources: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onClose: PropTypes.bool.isRequired,
};

export default stripesForm({
  form: BUDGET_FORM,
  navigationCheck: true,
})(BudgetForm);
