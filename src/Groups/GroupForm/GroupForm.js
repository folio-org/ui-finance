import React, { useCallback, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useHistory } from 'react-router';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  Col,
  HasCommand,
  Pane,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldSelectionFinal,
  FormFooter,
  handleKeyCommand,
  OptimisticLockingBanner,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  CREATE_UNITS_PERM,
  GROUPS_ROUTE,
  MANAGE_UNITS_PERM,
} from '../../common/const';
import { getFormattedOptions } from '../../common/utils';
import { GROUP_STATUS_OPTIONS } from '../constants';

const CREATE_GROUP_TITLE = <FormattedMessage id="ui-finance.groups.form.title.create" />;
const EDIT_GROUP_TITLE = <FormattedMessage id="ui-finance.groups.form.title.edit" />;

const GroupForm = ({
  onCancel,
  initialValues,
  handleSubmit,
  pristine,
  submitting,
  errorCode,
}) => {
  const intl = useIntl();
  const history = useHistory();
  const closeForm = useCallback(() => onCancel(), [onCancel]);

  const groupStatusOptions = useMemo(() => getFormattedOptions(intl, GROUP_STATUS_OPTIONS), [intl]);

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

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(closeForm),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push(GROUPS_ROUTE)),
    },
  ];

  return (
    <form>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
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
                <OptimisticLockingBanner
                  errorCode={errorCode}
                  latestVersionLink={`${GROUPS_ROUTE}/${initialValues.id}/view`}
                />
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
                    <FieldSelectionFinal
                      dataOptions={groupStatusOptions}
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
                      isFinal
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
      </HasCommand>
    </form>
  );
};

GroupForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
  errorCode: PropTypes.string,
};

GroupForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
})(GroupForm);
