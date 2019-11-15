import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { ConfirmationModal, Layer } from '@folio/stripes/components';
import {
  ERROR_CODE_GENERIC,
  LoadingPane,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  fundResource,
} from '../../../common/resources';
import FundForm from './FundForm';
import { fetchFundsByName } from './fetchFunds';

const FundFormContainer = ({
  intl,
  match,
  mutator,
  onCancel,
  onCloseEdit,
  onSubmit,
  parentMutator,
  parentResources,
  resources,
  stripes,
}) => {
  const showCallout = useShowCallout();
  const { params: { id } } = match;

  useEffect(
    () => {
      mutator.fund.reset();
      if (id) {
        mutator.fund.GET();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id],
  );
  const [isNotUniqueNameOpen, toggleNotUniqueName] = useModalToggle();
  const [forceSaveValues, setForceSaveValues] = useState();
  const closeScreen = onCancel || onCloseEdit;
  const isCreate = !id;

  // eslint-disable-next-line consistent-return
  const saveFund = async (formValues) => {
    const saveMethod = formValues.fund.id ? 'PUT' : 'POST';

    if (!forceSaveValues) {
      const existingFunds = await fetchFundsByName(
        parentMutator.fundsByName, formValues.fund.id, formValues.fund.name, formValues.fund.ledgerId,
      );

      if (existingFunds.length) {
        toggleNotUniqueName();
        setForceSaveValues(formValues);

        return {};
      }
    }

    try {
      const savedFund = await mutator.fund[saveMethod](formValues);

      showCallout({ messageId: 'ui-finance.fund.hasBeenSaved', type: 'success' });
      if (isCreate) {
        onSubmit(savedFund);
      } else {
        setTimeout(onCloseEdit);
      }
    } catch (e) {
      let errorCode = null;

      try {
        const responseJson = await e.json();

        errorCode = get(responseJson, 'errors.0.code', ERROR_CODE_GENERIC);
      } catch (parsingException) {
        errorCode = ERROR_CODE_GENERIC;
      }
      const message = (
        <FormattedMessage
          id={`ui-finance.fund.actions.save.error.${errorCode}`}
          defaultMessage={intl.formatMessage({ id: `ui-finance.fund.actions.save.error.${ERROR_CODE_GENERIC}` })}
        />
      );

      showCallout({
        message,
        type: 'error',
      });

      return { [FORM_ERROR]: 'FY was not saved' };
    }
  };

  const fund = get(resources, 'fund.records.0');
  const isLoading = id && !get(resources, ['fund', 'hasLoaded']);
  const isLoadingNode = <LoadingPane onClose={closeScreen} />;

  if (isLoading) {
    return isCreate
      ? isLoadingNode
      : (
        <Layer isOpen>
          {isLoadingNode}
        </Layer>
      );
  }

  const formNode = (
    <Fragment>
      <FundForm
        initialValues={fund}
        onCancel={onCancel || onCloseEdit}
        onSubmit={saveFund}
        parentResources={parentResources}
        parentMutator={parentMutator}
        systemCurrency={stripes.currency}
      />
      {
        isNotUniqueNameOpen && (
          <ConfirmationModal
            id="fund-name-is-not-unique-confirmation"
            heading={<FormattedMessage id="ui-finance.fund.actions.nameIsNotUnique.confirmation.heading" />}
            message={<FormattedMessage id="ui-finance.fund.actions.nameIsNotUnique.confirmation.message" />}
            onCancel={() => {
              toggleNotUniqueName();
              setForceSaveValues(null);
            }}
            onConfirm={() => saveFund(forceSaveValues)}
            open
          />
        )
      }
    </Fragment>
  );

  return isCreate
    ? formNode
    : (
      <Layer isOpen>
        {formNode}
      </Layer>
    );
};

FundFormContainer.manifest = Object.freeze({
  fund: {
    ...fundResource,
    accumulate: true,
    fetch: false,
    clientGeneratePk: false,
  },
});

FundFormContainer.propTypes = {
  intl: intlShape.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onCloseEdit: PropTypes.func,
  onSubmit: PropTypes.func,
  parentMutator: PropTypes.object.isRequired,
  parentResources: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default withRouter(stripesConnect(injectIntl(FundFormContainer)));
