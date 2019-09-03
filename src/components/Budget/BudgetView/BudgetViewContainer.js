import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
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
import { stripesConnect } from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes-acq-components';

import {
  budgetResource,
  fiscalYearResource,
} from '../../../common/resources';
import { FISCAL_YEARS_API } from '../../../common/const';
import BudgetView from './BudgetView';

const renderActionMenu = () => (
  <MenuSection id="budget-actions">
    <Button
      buttonStyle="dropdownItem"
      data-test-edit-budget-button
    >
      <Icon
        size="small"
        icon="edit"
      >
        <FormattedMessage id="ui-finance.actions.edit" />
      </Icon>
    </Button>
  </MenuSection>
);

const lastMenu = (
  <PaneMenu>
    <Button
      marginBottom0
      buttonStyle="primary"
    >
      <FormattedMessage id="ui-finance.actions.edit" />
    </Button>
  </PaneMenu>
);

const BudgetViewContainer = ({ history, resources }) => {
  const budget = get(resources, ['budget', 'records', 0]);
  const fiscalYear = get(resources, ['fiscalYear', 'records', 0], {});
  const isLoading = !get(resources, ['budget', 'hasLoaded']) && !get(resources, ['fiscalYear', 'hasLoaded']);

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={history.goBack} />
      </Paneset>
    );
  }

  return (
    <Paneset>
      <Pane
        actionMenu={renderActionMenu}
        defaultWidth="fill"
        dismissible
        id="pane-budget"
        lastMenu={lastMenu}
        onClose={history.goBack}
        paneTitle={budget.name}
      >
        <Row>
          <Col
            xs={12}
            md={8}
            mdOffset={2}
          >
            <BudgetView
              budget={budget}
              fiscalStart={fiscalYear.periodStart}
              fiscalEnd={fiscalYear.periodEnd}
            />
          </Col>
        </Row>
      </Pane>
    </Paneset>
  );
};

BudgetViewContainer.manifest = Object.freeze({
  budget: budgetResource,
  fiscalYear: {
    ...fiscalYearResource,
    path: (queryParams, pathComponents, resourceData, logger, props) => {
      const fiscalYearId = get(props, ['resources', 'budget', 'records', 0, 'fiscalYearId']);

      return fiscalYearId ? `${FISCAL_YEARS_API}/${fiscalYearId}` : null;
    },
  },
});

BudgetViewContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(BudgetViewContainer);
