import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Button,
  Col,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldSelection,
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

const getLastMenu = (handleSubmit, pristine, submitting) => {
  return (
    <PaneMenu>
      <Button
        data-test-button-save-group
        marginBottom0
        buttonStyle="primary"
        onClick={handleSubmit}
        type="submit"
        disabled={pristine || submitting}
      >
        <FormattedMessage id="ui-finance.save" />
      </Button>
    </PaneMenu>
  );
};

const GroupForm = ({
  onCancel,
  initialValues,
  handleSubmit,
  pristine,
  submitting,
}) => {
  const isEditMode = Boolean(initialValues.id);
  const lastMenu = getLastMenu(handleSubmit, pristine, submitting);

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-group-form"
          onClose={onCancel}
          lastMenu={lastMenu}
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
