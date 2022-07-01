import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import { useUnpaidInvoices } from '../hooks';

const visibleColumns = ['vendorInvoiceNo', 'vendor', 'invoiceDate', 'status', 'invoiceTotal'];
const columnMapping = {
  vendorInvoiceNo: <FormattedMessage id="ui-finance.invoice.vendorInvoiceNo" />,
  vendor: <FormattedMessage id="ui-finance.invoice.vendor" />,
  invoiceDate: <FormattedMessage id="ui-finance.invoice.invoiceDate" />,
  status: <FormattedMessage id="ui-finance.invoice.status" />,
  invoiceTotal: <FormattedMessage id="ui-finance.invoice.invoiceTotal" />,
};
const resultsFormatter = {
  vendor: invoice => invoice?.vendor?.name || <NoValue />,
  invoiceDate: invoice => <FolioFormattedDate value={invoice.invoiceDate} />,
  status: invoice => (
    <FormattedMessage id={`ui-finance.invoice.status.${invoice.status}`} defaultMessage={invoice.status} />
  ),
  invoiceTotal: invoice => (
    <AmountWithCurrencyField
      amount={invoice.total}
      currency={invoice.currency}
    />
  ),
};

const UnpaidInvoiceListModal = ({ onContinue, onCancel, fiscalYear }) => {
  const intl = useIntl();
  const { isFetching, invoices, totalRecords, pagination, setPagination } = useUnpaidInvoices(fiscalYear);
  const modalLabel = intl.formatMessage({ id: 'ui-finance.invoice.unpaidInvoices' });

  const footer = (
    <ModalFooter>
      <Button
        onClick={onContinue}
        buttonStyle="primary"
      >
        <FormattedMessage id="ui-finance.continue" />
      </Button>

      <Button
        onClick={onCancel}
      >
        <FormattedMessage id="ui-finance.cancel" />
      </Button>

    </ModalFooter>
  );

  const onPageChange = newPagination => {
    setPagination({ ...newPagination, timestamp: new Date() });
  };

  return (
    <Modal
      aria-label={modalLabel}
      dismissible
      footer={footer}
      id="unpaid-invoice-list-modal"
      label={modalLabel}
      onClose={onCancel}
      open
    >
      <MultiColumnList
        columnIdPrefix="unpaid-invoices"
        columnMapping={columnMapping}
        contentData={invoices}
        formatter={resultsFormatter}
        loading={isFetching}
        id="unpaid-invoices-list"
        interactive={false}
        totalCount={totalRecords}
        visibleColumns={visibleColumns}
      />

      {invoices.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalRecords}
          disabled={isFetching}
          onChange={onPageChange}
        />
      )}
    </Modal>
  );
};

UnpaidInvoiceListModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  fiscalYear: PropTypes.object.isRequired,
};

export default UnpaidInvoiceListModal;
