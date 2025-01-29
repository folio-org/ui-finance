import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Headline,
  MultiColumnList,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { FormFooter } from '@folio/stripes-acq-components';

import { getBatchAllocationColumnMapping } from './utils';
import { useBatchAllocationColumnValues } from '../hooks';
import { BATCH_ALLOCATION_COLUMNS } from '../constants';

const BatchAllocationsForm = ({
  fiscalYear,
  handleSubmit,
  headline,
  initialValues: { budgetsFunds },
  onCancel,
  pristine,
  submitting,
}) => {
  const intl = useIntl();
  const closeForm = useCallback(() => onCancel(), [onCancel]);
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  console.log('fiscalYear');
  console.log(fiscalYear);

  const formatter = useBatchAllocationColumnValues(intl);

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="stripes-components.saveAndClose" />}
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      onCancel={closeForm}
    />
  );

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          footer={paneFooter}
          id="batch-allocation-form"
          onClose={closeForm}
          paneTitle={fiscalYear.code}
          paneSub="One-time"
        >
          <Headline
            size="large"
            tag="h2"
            data-test-header-title
          >
            {headline}
          </Headline>
          <MultiColumnList
            formatter={formatter}
            visibleColumns={BATCH_ALLOCATION_COLUMNS}
            columnMapping={columnMapping}
            contentData={budgetsFunds}
            id="batch-allocation-list-item"
            interactive={false}
          />
        </Pane>
      </Paneset>
    </form>
  );
};

BatchAllocationsForm.propTypes = {
  fiscalYear: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  headline: PropTypes.string,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

BatchAllocationsForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(BatchAllocationsForm);
