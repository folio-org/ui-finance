import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Button,
  Col,
  Icon,
  Paneset,
  MenuSection,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import BudgetFormFields from './BudgetFormFields';
import { BUDGET_FORM } from '../constants';

const getLastMenu = (handleSubmit, pristine, submitting) => {
  return (
    <PaneMenu>
      <Button
        data-test-button-save-budget
        marginBottom0
        type="submit"
        disabled={pristine || submitting}
        buttonStyle="primary"
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-finance.budget.save" />
      </Button>
    </PaneMenu>
  );
};

const BudgetForm = ({
  parentResources,
  handleSubmit,
  initialValues,
  pristine,
  submitting,
  onClose,
}) => {
  const lastMenu = getLastMenu(handleSubmit, pristine, submitting);
  const fiscalYear = get(parentResources, ['fiscalYear', 'records', 0], {});

  const renderActionMenu = () => (
    <MenuSection id="budget-actions">
      <Button
        buttonStyle="dropdownItem"
        data-test-edit-budget-button
      >
        <Icon
          size="small"
          icon="trash"
        >
          <FormattedMessage id="ui-finance.actions.remove" />
        </Icon>
      </Button>
    </MenuSection>
  );

  return (
    <form id="budget-edit-form">
      <Paneset>
        <Pane
          actionMenu={renderActionMenu}
          defaultWidth="fill"
          dismissible
          id="pane-budget"
          lastMenu={lastMenu}
          onClose={onClose}
          paneTitle={initialValues.name}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
            >
              <BudgetFormFields
                budget={initialValues}
                fiscalStart={fiscalYear.periodStart}
                fiscalEnd={fiscalYear.periodEnd}
              />
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

BudgetForm.defaultProps = {};

export default stripesForm({
  form: BUDGET_FORM,
  navigationCheck: true,
})(BudgetForm);
