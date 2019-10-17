import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import { ConfirmationModal, Layer } from '@folio/stripes/components';
import {
  LIMIT_MAX,
  LoadingPane,
  useShowToast,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  fundResource,
  groupFundFiscalYears,
  groupsResource,
} from '../../../common/resources';
import { FUND_GROUPS_FIELD_NAME } from '../constants';
import FundForm from './FundForm';
import { fetchFundsByName } from './fetchFunds';

const FundFormContainer = ({
  match,
  mutator,
  onCancel,
  onCloseEdit,
  onSubmit,
  parentMutator,
  parentResources,
  resources,
}) => {
  const showCallout = useShowToast();
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
    const saveMethod = formValues.id ? 'PUT' : 'POST';

    if (!forceSaveValues) {
      const existingFunds = await fetchFundsByName(
        parentMutator.fundsByName, formValues.id, formValues.name, formValues.ledgerId,
      );

      if (existingFunds.length) {
        toggleNotUniqueName();
        setForceSaveValues(formValues);

        return {};
      }
    }

    const fundData = { fund: formValues };

    try {
      const savedFund = await mutator.fund[saveMethod](fundData);

      showCallout('ui-finance.fund.hasBeenSaved', 'success');
      if (isCreate) {
        onSubmit(savedFund);
      } else {
        setTimeout(onCloseEdit);
      }
    } catch (e) {
      showCallout('ui-finance.fund.hasNotBeenSaved', 'error');
    }
  };

  const fund = get(resources, 'fund.records.0') || {};
  const isLoading = id && !(get(resources, ['fund', 'hasLoaded']) && get(resources, 'gffy.hasLoaded'));
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
  gffy: groupFundFiscalYears,
  groupsDict: groupsResource,
});

FundFormContainer.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
  onCloseEdit: PropTypes.func,
  onSubmit: PropTypes.func,
  parentMutator: PropTypes.object.isRequired,
  parentResources: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(FundFormContainer));
