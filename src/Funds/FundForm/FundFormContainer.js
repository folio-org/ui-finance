import { FORM_ERROR } from 'final-form';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import {
  ConfirmationModal,
  LoadingView,
} from '@folio/stripes/components';
import {
  ERROR_CODE_CONFLICT,
  ERROR_CODE_GENERIC,
  useModalToggle,
  useShowCallout,
  fundsManifest,
} from '@folio/stripes-acq-components';

import {
  fundResource,
  fundTypesResource,
  ledgersResource,
} from '../../common/resources';
import { FUND_STATUSES } from '../constants';
import FundForm from './FundForm';
import { fetchFundsByName } from './fetchFunds';

const INITIAL_FUND_VALUES = {
  fundStatus: FUND_STATUSES.ACTIVE,
  restrictByLocations: false,
};

const FundFormContainer = ({
  match,
  mutator,
  onCancel,
}) => {
  const showCallout = useShowCallout();
  const { params: { id } } = match;
  const [fund, setFund] = useState();
  const [funds, setFunds] = useState([]);
  const [fundTypes, setFundTypes] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState();

  useEffect(() => {
    mutator.fundFormFunds.GET().then(setFunds);

    mutator.fundFormFundTypes.GET().then(setFundTypes);

    mutator.fundFormLedgers.GET().then(setLedgers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => {
      if (id) {
        setIsLoading(true);
        mutator.fundFormFund.GET()
          .then(setFund)
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setFund({
          fund: INITIAL_FUND_VALUES,
          groupIds: [],
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );
  const [isNotUniqueNameOpen, toggleNotUniqueName] = useModalToggle();
  const [forceSaveValues, setForceSaveValues] = useState();
  const intl = useIntl();

  // eslint-disable-next-line consistent-return
  const saveFund = useCallback(async (formValues) => {
    const saveMethod = formValues.fund.id ? 'PUT' : 'POST';

    if (!forceSaveValues) {
      const existingFunds = await fetchFundsByName(
        mutator.fundFormFunds, formValues.fund.id, formValues.fund.name, formValues.fund.ledgerId,
      );

      if (existingFunds.length) {
        toggleNotUniqueName();
        setForceSaveValues(formValues);

        return {};
      }
    }

    try {
      const savedFund = await mutator.fundFormFund[saveMethod](formValues);

      showCallout({ messageId: 'ui-finance.fund.hasBeenSaved', type: 'success' });

      setTimeout(() => onCancel(savedFund.fund.id));
    } catch (e) {
      let respErrorCode = null;

      try {
        const responseJson = await e.json();

        respErrorCode = get(responseJson, 'errors.0.code', ERROR_CODE_GENERIC);
      } catch (parsingException) {
        respErrorCode = ERROR_CODE_GENERIC;
      }

      if (respErrorCode === ERROR_CODE_CONFLICT) {
        setErrorCode(respErrorCode);
      } else {
        const message = (
          <FormattedMessage
            id={`ui-finance.fund.actions.save.error.${respErrorCode}`}
            defaultMessage={intl.formatMessage({ id: `ui-finance.fund.actions.save.error.${ERROR_CODE_GENERIC}` })}
          />
        );

        showCallout({
          message,
          type: 'error',
        });
      }

      return { [FORM_ERROR]: 'FY was not saved' };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceSaveValues, intl, onCancel, showCallout, toggleNotUniqueName]);

  if (isLoading) {
    return (
      <LoadingView onClose={onCancel} />
    );
  }

  return (
    <>
      <FundForm
        initialValues={fund}
        onCancel={onCancel}
        onSubmit={saveFund}
        funds={funds}
        fundTypes={fundTypes}
        ledgers={ledgers}
        errorCode={errorCode}
      />
      {
        isNotUniqueNameOpen && (
          <ConfirmationModal
            id="fund-name-is-not-unique-confirmation"
            heading={<FormattedMessage id="ui-finance.fund.actions.nameIsNotUnique.confirmation.heading" />}
            message={<FormattedMessage id="ui-finance.fund.actions.nameIsNotUnique.confirmation.message" />}
            onCancel={() => {
              toggleNotUniqueName();
              setForceSaveValues();
            }}
            onConfirm={() => saveFund(forceSaveValues)}
            open
          />
        )
      }
    </>
  );
};

FundFormContainer.manifest = Object.freeze({
  fundFormFund: {
    ...fundResource,
    accumulate: true,
    fetch: false,
    clientGeneratePk: false,
  },
  fundFormFunds: {
    ...fundsManifest,
    accumulate: true,
    fetch: false,
  },
  fundFormFundTypes: {
    ...fundTypesResource,
    accumulate: true,
    fetch: false,
  },
  fundFormLedgers: {
    ...ledgersResource,
    accumulate: true,
    fetch: false,
  },
});

FundFormContainer.propTypes = {
  match: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
};

export default withRouter(stripesConnect(FundFormContainer));
