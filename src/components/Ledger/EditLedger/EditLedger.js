import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import {
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import {
  FISCAL_YEAR_ROUTE,
  LEDGER_VIEW_ROUTE,
} from '../../../common/const';
import { ledgerByUrlIdResource } from '../../../common/resources';
import LedgerForm from '../LedgerForm';

const EditLedger = ({ resources, mutator, match, history, location }) => {
  const ledgerId = match.params.id;

  useEffect(
    () => {
      mutator.ledgerEdit.reset();
      mutator.ledgerEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId],
  );

  const showToast = useShowToast();

  const closeEdit = useCallback(
    () => {
      history.push(`${LEDGER_VIEW_ROUTE}${ledgerId}?layer=view`);
    },
    [ledgerId, history],
  );

  const saveLedger = useCallback(
    async (ledgerValues) => {
      try {
        const savedLedger = await mutator.ledgerEdit.PUT(ledgerValues);

        showToast('ui-finance.ledger.actions.save.success');
        setTimeout(() => closeEdit(), 0);

        return savedLedger;
      } catch (response) {
        showToast('ui-finance.ledger.actions.save.error', 'error');

        return { id: 'Unable to edit ledger' };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeEdit, mutator.ledgerEdit],
  );

  const goToCreateFY = useCallback(() => {
    history.push({
      pathname: FISCAL_YEAR_ROUTE,
      search: '?layer=create',
      state: { ledgerId },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledgerId]);

  const isLoading = !get(resources, ['ledgerEdit', 'hasLoaded']);
  const ledger = get(resources, ['ledgerEdit', 'records', '0']);
  const fiscalYearOneId = get(location, 'state.fiscalYearOneId');

  if (isLoading) {
    return (
      <Paneset>
        <LoadingPane onClose={closeEdit} />
      </Paneset>
    );
  }

  if (fiscalYearOneId) ledger.fiscalYearOneId = fiscalYearOneId;

  return (
    <LedgerForm
      goToCreateFY={goToCreateFY}
      initialValues={ledger}
      onCancel={closeEdit}
      onSubmit={saveLedger}
    />
  );
};

EditLedger.manifest = Object.freeze({
  ledgerEdit: {
    ...ledgerByUrlIdResource,
    accumulate: true,
  },
});

EditLedger.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(EditLedger));
