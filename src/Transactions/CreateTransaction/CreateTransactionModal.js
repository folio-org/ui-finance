import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
  getFormValues,
} from 'redux-form';

import stripesForm from '@folio/stripes/form';
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
  FieldSelect,
  FieldTags,
  validateRequired,
} from '@folio/stripes-acq-components';

const TRANSACTION_FORM = 'transactionForm';

const CreateTransactionModal = ({ fundId, handleSubmit, onClose, funds, store, dispatch, change, title }) => {
  const formValues = getFormValues(TRANSACTION_FORM)(store.getState()) || {};
  const transferFrom = formValues.fromFundId;
  const transferTo = formValues.toFundId;
  const hasToFundIdProperty = 'toFundId' in formValues;
  const hasFromFundIdProperty = 'fromFundId' in formValues;
  const isTransferFromReqired = hasToFundIdProperty ? transferTo !== fundId : false;
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

  const selectFromFund = useCallback(
    (e, id) => {
      dispatch(change('fromFundId', id));

      if (transferFrom !== fundId) {
        dispatch(change('toFundId', fundId));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundId, transferFrom],
  );

  const selectToFund = useCallback(
    (e, id) => {
      dispatch(change('toFundId', id));

      if (transferTo !== fundId) {
        dispatch(change('fromFundId', fundId));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundId, transferTo],
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
            <FieldSelect
              dataOptions={optionsFrom}
              label={<FormattedMessage id="ui-finance.transaction.from" />}
              name="fromFundId"
              onChange={selectFromFund}
              required={isTransferFromReqired}
              {...validateTransferFrom}
            />
          </Col>

          <Col xs>
            <FieldSelect
              dataOptions={optionsTo}
              label={<FormattedMessage id="ui-finance.transaction.to" />}
              name="toFundId"
              onChange={selectToFund}
              required
              validate={validateRequired}
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
            <FieldTags
              formName={TRANSACTION_FORM}
              name="tags.tagList"
            />
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
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  fundId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.node.isRequired,
};

CreateTransactionModal.defaultProps = {
  funds: [],
};

export default stripesForm({
  form: TRANSACTION_FORM,
})(CreateTransactionModal);
