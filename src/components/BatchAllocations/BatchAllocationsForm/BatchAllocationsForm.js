import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Col,
  Pane,
  Paneset,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';
import { FormFooter } from '@folio/stripes-acq-components';

import { getBatchAllocationColumnMapping } from './utils';
import { useBatchAllocationColumnValues } from '../hooks';
import { BATCH_ALLOCATION_COLUMNS } from '../constants';

const CREATE_GROUP_TITLE = <FormattedMessage id="ui-finance.groups.form.title.create" />;
const EDIT_GROUP_TITLE = <FormattedMessage id="ui-finance.groups.form.title.edit" />;

const BatchAllocationsForm = ({
  onCancel,
  initialValues,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const intl = useIntl();
  const closeForm = useCallback(() => onCancel(), [onCancel]);
  const columnMapping = useMemo(() => {
    return getBatchAllocationColumnMapping({ intl });
  }, [intl]);

  const columnValues = useBatchAllocationColumnValues(Object.values(initialValues), intl);
  const isEditMode = Boolean(initialValues.id);

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
          id="pane-group-form"
          onClose={closeForm}
          paneTitle={isEditMode ? EDIT_GROUP_TITLE : CREATE_GROUP_TITLE}
          paneSub="One-time"
        >
          <Row>
            <Col
              xs={12}
              md={10}
              mdOffset={1}
            >
              <MultiColumnList
                visibleColumns={BATCH_ALLOCATION_COLUMNS}
                columnMapping={columnMapping}
                contentData={columnValues}
                id="list-item-funds"
                interactive={false}
              />
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

BatchAllocationsForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
};

BatchAllocationsForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(BatchAllocationsForm);
