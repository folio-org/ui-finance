import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Col,
  Modal,
  ModalFooter,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  FieldTags,
  validateRequiredPositiveAmount,
} from '@folio/stripes-acq-components';

import { validateTransactionForm } from '../../common/utils';

const CreateTransactionModal = ({
  fundId,
  handleSubmit,
  onClose,
  fundsOptions = [],
  title,
  values: formValues,
  isFundDisabled = false,
  isFromFundVisible = true,
  isToFundVisible = true,
  fundLabelId,
}) => {
  const hasToFundIdProperty = 'toFundId' in formValues;
  const hasFromFundIdProperty = 'fromFundId' in formValues;

  const optionsFrom = (
    (!hasToFundIdProperty ||
    formValues.toFundId === fundId)
      ? fundsOptions
      : fundsOptions.filter(f => f.value === fundId)
  );

  const optionsTo = (
    (!hasFromFundIdProperty ||
    formValues.fromFundId === fundId)
      ? fundsOptions
      : fundsOptions.filter(f => f.value === fundId)
  );

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        data-test-add-transfer-save
        onClick={handleSubmit}
      >
        <FormattedMessage id="ui-finance.transaction.button.confirm" />
      </Button>
      <Button
        data-test-add-transfer-cancel
        onClick={onClose}
      >
        <FormattedMessage id="ui-finance.transaction.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      id="add-transfer-modal"
      label={title}
      footer={footer}
      open
    >
      <form>
        <Row>
          {isFromFundVisible && (
            <Col xs>
              <FieldSelectFinal
                dataOptions={optionsFrom}
                label={<FormattedMessage id={fundLabelId || 'ui-finance.transaction.from'} />}
                name="fromFundId"
                disabled={isFundDisabled}
              />
            </Col>
          )}

          {isToFundVisible && (
            <Col xs>
              <FieldSelectFinal
                dataOptions={optionsTo}
                label={<FormattedMessage id={fundLabelId || 'ui-finance.transaction.to'} />}
                name="toFundId"
                disabled={isFundDisabled}
              />
            </Col>
          )}
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-finance.transaction.amount" />}
              name="amount"
              type="number"
              required
              validate={validateRequiredPositiveAmount}
            />
          </Col>

          <Col xs>
            <FieldTags name="tags.tagList" />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextArea}
              label={<FormattedMessage id="ui-finance.transaction.description" />}
              name="description"
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

CreateTransactionModal.propTypes = {
  fundId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  fundsOptions: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.node.isRequired,
  values: PropTypes.object.isRequired,
  isFundDisabled: PropTypes.bool,
  isFromFundVisible: PropTypes.bool,
  isToFundVisible: PropTypes.bool,
  fundLabelId: PropTypes.string,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  validate: validateTransactionForm,
})(CreateTransactionModal);
