import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import {
  stripesConnect,
  useOkapiKy,
} from '@folio/stripes/core';
import { LoadingPane } from '@folio/stripes/components';
import {
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  fiscalYearResource,
  fundsResource,
  releaseEncumbranceResource,
  transactionByUrlIdResource,
} from '../../common/resources';
import {
  FISCAL_YEARS_API,
  UNRELEASE_ENCUMBRANCE_API,
} from '../../common/const';
import TransactionDetails from './TransactionDetails';

const TransactionDetailsContainer = ({
  baseUrl,
  history,
  match,
  location,
  mutator,
  fundId,
}) => {
  const transactionId = match.params.id;

  const ky = useOkapiKy();
  const showCallout = useShowCallout();

  const [transaction, setTransaction] = useState();
  const [transactionFunds, setTransactionFunds] = useState();
  const [fiscalYear, setFiscalYear] = useState();

  const onClose = useCallback(
    () => {
      history.push({
        pathname: baseUrl,
        search: location.search,
      });
    },
    [location.search, history, baseUrl],
  );

  useEffect(
    () => {
      setTransaction();
      setTransactionFunds();
      setFiscalYear();

      mutator.transactionDetails.GET()
        .then(transactionResponse => {
          setTransaction(transactionResponse);

          const { fromFundId, toFundId, fiscalYearId } = transactionResponse;
          const funds = [fromFundId, toFundId].filter(Boolean);
          const fundsQuery = funds.map(id => `id == ${id}`).join(' OR ');

          const fiscalYearPromise = mutator.fiscalYear.GET({
            path: `${FISCAL_YEARS_API}/${fiscalYearId}`,
          });
          const transactionFundsPromise = mutator.transactionFunds.GET({ params: { query: fundsQuery } });

          return Promise.all([fiscalYearPromise, transactionFundsPromise]);
        })
        .then(([fiscalYearResp, transactionFundsResp]) => {
          setFiscalYear(fiscalYearResp);
          setTransactionFunds(transactionFundsResp);
        })
        .catch(() => showCallout({
          messageId: 'ui-finance.transaction.actions.load.error',
          type: 'error',
        }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactionId],
  );

  const refreshTransaction = useCallback(() => {
    return mutator.transactionDetails.GET().then(setTransaction);
  }, [mutator.transactionDetails]);

  const releaseTransaction = useCallback(() => {
    setTransaction();

    return mutator.releaseEncumbrance.POST({ id: transactionId }).then(
      () => {
        showCallout({
          messageId: 'ui-finance.transaction.releaseEncumbrance.success',
          type: 'success',
        });
        refreshTransaction();
      },
      async (response) => {
        let errorCode = null;

        try {
          const { errors } = await response.clone().json();

          errorCode = errors?.[0]?.code || 'default';
        } catch (e) {
          errorCode = 'default';
        }

        showCallout({
          messageId: `ui-finance.transaction.releaseEncumbrance.error.${errorCode}`,
          type: 'error',
        });
      },
    );
  }, [mutator.releaseEncumbrance, refreshTransaction, showCallout, transactionId]);

  const unreleaseTransaction = useCallback(() => {
    setTransaction();

    return ky.post(`${UNRELEASE_ENCUMBRANCE_API}/${transactionId}`)
      .json()
      .then(() => showCallout({ messageId: 'ui-finance.transaction.unreleaseEncumbrance.success' }))
      .then(refreshTransaction)
      .catch(async (response) => {
        const errorCode = await getErrorCodeFromResponse(response);

        showCallout({
          messageId: `ui-finance.transaction.unreleaseEncumbrance.error.${errorCode}`,
          type: 'error',
        });
      });
  }, [ky, refreshTransaction, showCallout, transactionId]);

  const isLoading = !(transaction && transactionFunds && fiscalYear);

  if (isLoading) {
    return (
      <LoadingPane
        id="pane-transaction-details"
        onClose={onClose}
        dismissible
      />
    );
  }

  const fromFund = transactionFunds.find(({ id }) => id === transaction.fromFundId);
  const fromFundName = fromFund && `${fromFund.name} (${fromFund.code})`;
  const toFund = transactionFunds.find(({ id }) => id === transaction.toFundId);
  const toFundName = toFund && `${toFund.name} (${toFund.code})`;

  return (
    <TransactionDetails
      fiscalYearCode={fiscalYear.code}
      fromFundName={fromFundName}
      fundId={fundId}
      onClose={onClose}
      releaseTransaction={releaseTransaction}
      unreleaseTransaction={unreleaseTransaction}
      toFundName={toFundName}
      transaction={transaction}
    />
  );
};

TransactionDetailsContainer.manifest = Object.freeze({
  transactionFunds: {
    ...fundsResource,
    fetch: false,
    accumulate: true,
  },
  transactionDetails: {
    ...transactionByUrlIdResource,
    accumulate: true,
    fetch: false,
  },
  fiscalYear: {
    ...fiscalYearResource,
    fetch: false,
    accumulate: true,
  },
  releaseEncumbrance: releaseEncumbranceResource,
});

TransactionDetailsContainer.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
  fundId: PropTypes.string.isRequired,
};

export default withRouter(stripesConnect(TransactionDetailsContainer));
