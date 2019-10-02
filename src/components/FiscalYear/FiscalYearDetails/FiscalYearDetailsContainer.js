import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import {
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
  fiscalYearLedgersResource,
  fiscalYearGroupsResource,
  fiscalYearFundsResource,
} from '../../../common/resources';
import {
  FISCAL_YEAR_ROUTE,
  FISCAL_YEAR_EDIT_ROUTE,
} from '../../../common/const';
import FiscalYearDetails from './FiscalYearDetails';

const FiscalYearDetailsContainer = ({
  mutator,
  resources,
  match,
  onClose,
  history,
}) => {
  const fiscalYearId = match.params.id;

  useEffect(
    () => {
      mutator.fiscalYear.reset();
      mutator.ledgers.reset();
      mutator.funds.reset();
      mutator.groups.reset();

      mutator.fiscalYear.GET();
      mutator.ledgers.GET();
      mutator.funds.GET();
      mutator.groups.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fiscalYearId],
  );

  const fiscalYear = get(resources, ['fiscalYear', 'records', '0']);
  const showToast = useShowToast();

  const editFiscalYear = useCallback(
    () => {
      history.push(`${FISCAL_YEAR_EDIT_ROUTE}${fiscalYearId}`);
    },
    [history, fiscalYearId],
  );

  const openLedger = useCallback(
    (e, ledger) => {
      const path = `/finance/ledger/${ledger.id}/view`;

      history.push(path);
    },
    [history],
  );

  const openGroup = useCallback(
    (e, group) => {
      const path = `/finance/groups/${group.id}/view`;

      history.push(path);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const openFund = useCallback(
    (e, fund) => {
      const path = `/finance/fund/${fund.id}/view`;

      history.push(path);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const removeFiscalYear = useCallback(
    () => {
      mutator.fiscalYear.DELETE(fiscalYear)
        .then(() => {
          showToast('ui-finance.fiscalYear.actions.remove.success');
          history.push(FISCAL_YEAR_ROUTE);
        })
        .catch(() => {
          showToast('ui-finance.fiscalYear.actions.remove.error', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, fiscalYear, mutator.fiscalYear],
  );

  const isLoading = !(
    // get(resources, ['ledgers', 'hasLoaded']) &&
    // get(resources, ['funds', 'hasLoaded']) &&
    // get(resources, ['groups', 'hasLoaded']) &&
    get(resources, ['fiscalYear', 'hasLoaded'])
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  const ledgers = get(resources, ['ledgers', 'records'], []);
  const groups = get(resources, ['groups', 'records'], []);
  const funds = get(resources, ['funds', 'records'], []);

  return (
    <FiscalYearDetails
      fiscalYear={fiscalYear}
      funds={funds}
      groups={groups}
      ledgers={ledgers}
      onClose={onClose}
      onEdit={editFiscalYear}
      onRemove={removeFiscalYear}
      openFund={openFund}
      openGroup={openGroup}
      openLedger={openLedger}
    />
  );
};

FiscalYearDetailsContainer.manifest = Object.freeze({
  fiscalYear: {
    ...fiscalYearResource,
    accumulate: true,
    fetch: false,
  },
  ledgers: fiscalYearLedgersResource,
  groups: fiscalYearGroupsResource,
  funds: fiscalYearFundsResource,
});

FiscalYearDetailsContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default withRouter(FiscalYearDetailsContainer);
