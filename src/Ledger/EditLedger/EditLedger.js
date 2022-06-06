import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';
import {
  ERROR_CODE_CONFLICT,
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  LEDGERS_ROUTE,
} from '../../common/const';
import { ledgerByUrlIdResource } from '../../common/resources';
import LedgerForm from '../LedgerForm';

export const EditLedger = ({ resources, mutator, match, history, location }) => {
  const [errorCode, setErrorCode] = useState();
  const ledgerId = match.params.id;
  const intl = useIntl();

  useEffect(
    () => {
      mutator.ledgerEdit.reset();
      mutator.ledgerEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ledgerId],
  );

  const showToast = useShowCallout();

  const closeEdit = useCallback(
    () => {
      history.push({
        pathname: `${LEDGERS_ROUTE}/${ledgerId}/view`,
        search: location.search,
      });
    },
    [history, location.search, ledgerId],
  );

  const saveLedger = useCallback(
    async (ledgerValues) => {
      try {
        const savedLedger = await mutator.ledgerEdit.PUT(ledgerValues);

        showToast({ messageId: 'ui-finance.ledger.actions.save.success' });
        closeEdit();

        return savedLedger;
      } catch (response) {
        const respErrorCode = await getErrorCodeFromResponse(response);

        if (respErrorCode === ERROR_CODE_CONFLICT) {
          setErrorCode(respErrorCode);
        } else {
          const errorMessage = (
            <FormattedMessage
              id={`ui-finance.ledger.actions.save.error.${respErrorCode}`}
              defaultMessage={intl.formatMessage({ id: 'ui-finance.ledger.actions.save.error' })}
            />
          );

          showToast({
            message: errorMessage,
            type: 'error',
          });
        }

        return { id: 'Unable to edit ledger' };
      }
    },
    [closeEdit, mutator.ledgerEdit, showToast],
  );

  const goToCreateFY = useCallback(() => {
    history.push({
      pathname: `${LEDGERS_ROUTE}/${ledgerId}/fiscalyear/create`,
      search: location.search,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, ledgerId]);

  const isLoading = !get(resources, ['ledgerEdit', 'hasLoaded']);
  const ledger = get(resources, ['ledgerEdit', 'records', '0']);
  const fiscalYearOneId = get(location, 'state.fiscalYearOneId');

  if (isLoading) {
    return (
      <LoadingView onClose={closeEdit} />
    );
  }

  if (fiscalYearOneId) ledger.fiscalYearOneId = fiscalYearOneId;

  return (
    <LedgerForm
      goToCreateFY={goToCreateFY}
      initialValues={ledger}
      onCancel={closeEdit}
      onSubmit={saveLedger}
      errorCode={errorCode}
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
