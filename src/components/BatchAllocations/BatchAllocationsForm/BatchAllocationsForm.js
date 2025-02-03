import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Headline,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
} from '@folio/stripes/components';

import { getBatchAllocationColumnMapping } from './utils';
import { useBatchAllocationColumnValues } from '../hooks';
import {
  BATCH_ALLOCATION_COLUMNS,
  BATCH_ALLOCATION_FIELDS,
} from '../constants';

const BatchAllocationsForm = ({
  handleSubmit,
  headline,
  initialValues: { budgetsFunds },
  onCancel,
  paneSub,
  paneTitle,
  pristine,
  submitting,
  sortingField,
  sortingDirection,
  changeSorting,
}) => {
  const intl = useIntl();
  const closeForm = useCallback(() => onCancel(), [onCancel]);
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const formatter = useBatchAllocationColumnValues(intl);

  const start = (
    <Button
      buttonStyle="default mega"
      onClick={closeForm}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );

  const end = (
    <div>
      <Button
        buttonStyle="default mega"
        disabled={pristine || submitting}
        onClick={() => {}}
        type="submit"
      >
        <FormattedMessage id="ui-finance.allocation.batch.form.footer.recalculate" />
      </Button>
      <Button
        buttonStyle="primary mega"
        disabled={pristine || submitting}
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    </div>
  );

  const paneFooter = (
    <PaneFooter
      renderStart={start}
      renderEnd={end}
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
          paneTitle={paneTitle}
          paneSub={paneSub}
        >
          <Headline
            size="large"
            tag="h2"
            data-test-header-title
          >
            {headline}
          </Headline>
          <MultiColumnList
            contentData={budgetsFunds}
            columnMapping={columnMapping}
            formatter={formatter}
            id="batch-allocation-list-item"
            onHeaderClick={changeSorting}
            sortDirection={sortingDirection}
            sortedColumn={sortingField || BATCH_ALLOCATION_FIELDS.fundName}
            visibleColumns={BATCH_ALLOCATION_COLUMNS}
          />
        </Pane>
      </Paneset>
    </form>
  );
};

BatchAllocationsForm.propTypes = {
  changeSorting: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  headline: PropTypes.string,
  initialValues: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  paneSub: PropTypes.string.isRequired,
  paneTitle: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  sortingField: PropTypes.string,
  sortingDirection: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

BatchAllocationsForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(BatchAllocationsForm);
