import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';

import { stripesConnect } from '@folio/stripes/core';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import { FISCAL_YEAR_ROUTE, LEDGERS_ROUTE } from '../../common/const';
import { ledgersResource } from '../../common/resources';
import LedgerForm from '../LedgerForm';

const INITIAL_LEDGER = {};

const CreateLedger = ({ mutator, location, history }) => {
  const showCallout = useShowCallout();

  const closeForm = useCallback(
    (id) => {
      history.push({
        pathname: id ? `${LEDGERS_ROUTE}/${id}/view` : LEDGERS_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const goToCreateFY = useCallback(() => {
    history.push({
      pathname: FISCAL_YEAR_ROUTE,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveLedger = useCallback(
    async (ledgerValues) => {
      try {
        const savedLedger = await mutator.createLedger.POST(ledgerValues);

        showCallout({
          messageId: 'ui-finance.ledger.actions.save.success',
        });
        setTimeout(() => closeForm(savedLedger.id), 0);

        return savedLedger;
      } catch (response) {
        let errorCode = null;

        try {
          const responseJson = await response.json();

          errorCode = get(responseJson, 'errors.0.code', 'genericError');
        } catch (parsingException) {
          errorCode = 'genericError';
        }
        showCallout({
          messageId: `ui-finance.ledger.actions.save.error.${errorCode}`,
          type: 'error',
        });
        throw new SubmissionError({
          _error: 'Ledger was not saved',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <LedgerForm
      goToCreateFY={goToCreateFY}
      initialValues={INITIAL_LEDGER}
      onSubmit={saveLedger}
      onCancel={closeForm}
    />
  );
};

CreateLedger.manifest = Object.freeze({
  createLedger: {
    ...ledgersResource,
    fetch: true,
  },
});

CreateLedger.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(stripesConnect(CreateLedger));
