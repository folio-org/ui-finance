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
  validateRequired,
} from '@folio/stripes-acq-components';

import { validateFund } from '../../common/utils';

const CreateTransactionModal = ({
  fundId,
  handleSubmit,
  onClose,
  funds,
  title,
  isRequiredTransferFrom,
  values: formValues,
}) => {
  const transferTo = formValues.toFundId;
  const hasToFundIdProperty = 'toFundId' in formValues;
  const hasFromFundIdProperty = 'fromFundId' in formValues;
  const isTransferFromReqired = isRequiredTransferFrom || (hasToFundIdProperty ? transferTo !== fundId : false);
  const validateTransferFrom = isTransferFromReqired ? { validate: validateRequired } : {};

  const optionsFrom = (
    (!hasToFundIdProperty ||
    formValues.toFundId === fundId)
      ? funds
      : funds.filter(f => f.value === fundId)
  );

  const optionsTo = (
    (!hasFromFundIdProperty ||
    formValues.fromFundId === fundId)
      ? funds
      : funds.filter(f => f.value === fundId)
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
          <Col xs>
            <FieldSelectFinal
              dataOptions={optionsFrom}
              label={<FormattedMessage id="ui-finance.transaction.from" />}
              name="fromFundId"
              required={isTransferFromReqired}
              {...validateTransferFrom}
            />
          </Col>

          <Col xs>
            <FieldSelectFinal
              dataOptions={optionsTo}
              label={<FormattedMessage id="ui-finance.transaction.to" />}
              name="toFundId"
              required
              validate={validateFund}
            />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Field
              component={TextField}
              label={<FormattedMessage id="ui-finance.transaction.amount" />}
              name="amount"
              type="number"
              required
              validate={validateRequired}
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
  funds: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.node.isRequired,
  isRequiredTransferFrom: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,
};

CreateTransactionModal.defaultProps = {
  funds: [],
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(CreateTransactionModal);
