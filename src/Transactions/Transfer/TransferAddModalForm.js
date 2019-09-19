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

const TRANSFER_FORM = 'transferForm';

const TransferAddModalForm = ({ fundId, handleSubmit, onClose, funds, store, dispatch, change }) => {
  const formValues = getFormValues(TRANSFER_FORM)(store.getState()) || {};
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
      label={<FormattedMessage id="ui-finance.transaction.transfer.title" />}
      footer={footer}
      open
    >
      <form>
        <Row>
          <Col xs>
            <FieldSelect
              dataOptions={optionsFrom}
              label={<FormattedMessage id="ui-finance.transaction.transferFrom" />}
              name="fromFundId"
              onChange={selectFromFund}
              required={isTransferFromReqired}
              {...validateTransferFrom}
            />
          </Col>

          <Col xs>
            <FieldSelect
              dataOptions={optionsTo}
              label={<FormattedMessage id="ui-finance.transaction.transferTo" />}
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
              formName={TRANSFER_FORM}
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

TransferAddModalForm.propTypes = {
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  fundId: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
};

TransferAddModalForm.defaultProps = {
  funds: [],
};

export default stripesForm({
  form: TRANSFER_FORM,
})(TransferAddModalForm);
