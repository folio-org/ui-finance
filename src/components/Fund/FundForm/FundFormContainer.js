import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import { Layer } from '@folio/stripes/components';
import {
  LoadingPane,
  useShowToast,
} from '@folio/stripes-acq-components';

import { fundResource } from '../../../common/resources';
import FundForm from './FundForm';

const FundFormContainer = ({ resources, mutator, onCloseEdit, stripes, parentResources }) => {
  const showCallout = useShowToast();
  const saveFund = useCallback(
    (formValues) => {
      const saveMethod = formValues.id ? 'PUT' : 'POST';

      mutator.fund[saveMethod](formValues)
        .then(() => {
          showCallout('ui-finance.fund.hasBeenSaved', 'success');
          onCloseEdit();
        })
        .catch(() => {
          showCallout('ui-finance.fund.hasNotBeenSaved', 'error');
        });
    },
    [],
  );

  const fund = get(resources, ['fund', 'records', 0]);
  const isLoading = !get(resources, ['fund', 'hasLoaded']);

  if (isLoading) {
    return (
      <Layer isOpen>
        <LoadingPane onClose={onCloseEdit} />
      </Layer>
    );
  }

  return (
    <Layer isOpen>
      <FundForm
        initialValues={fund}
        onCancel={onCloseEdit}
        onSubmit={saveFund}
        parentResources={parentResources}
        stripes={stripes}
      />
    </Layer>
  );
};

FundFormContainer.manifest = Object.freeze({
  fund: fundResource,
});

FundFormContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
  onCloseEdit: PropTypes.func.isRequired,
  parentResources: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(FundFormContainer);
