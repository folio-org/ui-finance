import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Headline,
  Pane,
  PaneFooter,
  Paneset,
} from '@folio/stripes/components';

import { BatchAllocationList } from './BatchAllocationList';

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
  const closeForm = useCallback(() => onCancel(), [onCancel]);

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
          <FieldArray
            id="batch-allocation-list"
            name="budgetsFunds"
            component={BatchAllocationList}
            props={{
              onHeaderClick: changeSorting,
              sortDirection: sortingDirection,
              sortedColumn: sortingField,
            }}
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
  sortingField: PropTypes.string.isRequired,
  sortingDirection: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
};

BatchAllocationsForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(BatchAllocationsForm);
