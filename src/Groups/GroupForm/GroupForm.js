import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Col,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldSelection,
  FormFooter,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  CREATE_UNITS_PERM,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import { GROUP_STATUS_OPTIONS } from '../constants';

const GROUP_FORM = 'groupForm';

const CREATE_GROUP_TITLE = <FormattedMessage id="ui-finance.groups.form.title.create" />;
const EDIT_GROUP_TITLE = <FormattedMessage id="ui-finance.groups.form.title.edit" />;

const GroupForm = ({
  onCancel,
  initialValues,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const isEditMode = Boolean(initialValues.id);

  const paneFooter = (
    <FormFooter
      label={<FormattedMessage id="ui-finance.saveAndClose" />}
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
        >
          <Row>
            <Col xs={12} md={8} mdOffset={2}>
              <Row>
                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-finance.groups.item.information.name" />}
                    name="name"
                    type="text"
                    required
                    validate={validateRequired}
                  />
                </Col>

                <Col xs={3}>
                  <Field
                    component={TextField}
                    label={<FormattedMessage id="ui-finance.groups.item.information.code" />}
                    name="code"
                    type="text"
                    required
                    validate={validateRequired}
                  />
                </Col>

                <Col xs={3}>
                  <FieldSelection
                    dataOptions={GROUP_STATUS_OPTIONS}
                    id="group-status"
                    labelId="ui-finance.groups.item.information.status"
                    name="status"
                    required
                    validate={validateRequired}
                  />
                </Col>

                <Col xs={3}>
                  <AcqUnitsField
                    name="acqUnitIds"
                    perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
                    id="group-acq-units"
                    isEdit={isEditMode}
                    preselectedUnits={initialValues.acqUnitIds}
                  />
                </Col>

                <Col xs={6}>
                  <Field
                    component={TextArea}
                    label={<FormattedMessage id="ui-finance.groups.item.information.description" />}
                    name="description"
                    type="text"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

GroupForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
};

GroupForm.defaultProps = {
  initialValues: {},
};

export default stripesForm({
  form: GROUP_FORM,
  navigationCheck: true,
})(GroupForm);
