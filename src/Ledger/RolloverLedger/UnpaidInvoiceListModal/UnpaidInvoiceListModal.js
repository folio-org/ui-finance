import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Headline,
  Layout,
  Loading,
  Modal,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedDate,
  ModalFooter,
  PrevNextPagination,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useUnpaidInvoices,
  useUnpaidInvoicesExport,
} from '../hooks';

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
      showBrackets={invoice.total < 0}
    />
  ),
};

const UnpaidInvoiceListModal = ({ onContinue, onCancel, fiscalYear }) => {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const {
    isFetching,
    invoices,
    totalRecords,
    query,
    pagination,
    setPagination,
  } = useUnpaidInvoices(fiscalYear);
  const { isLoading, runExportCSV } = useUnpaidInvoicesExport();
  const modalLabel = intl.formatMessage({ id: 'ui-finance.invoice.unpaidInvoices' });

  const onExport = useCallback(() => {
    showCallout({ messageId: 'ui-finance.invoice.unpaidInvoices.exportCSV.started' });
    runExportCSV({ query })
      .catch(() => showCallout({
        messageId: 'ui-finance.invoice.unpaidInvoices.exportCSV.error',
        type: 'error',
      }));
  }, [query, runExportCSV, showCallout]);

  const start = (
    <Button
      onClick={onCancel}
      marginBottom0
    >
      <FormattedMessage id="ui-finance.cancel" />
    </Button>
  );

  const end = (
    <>
      <Layout className="flex">
        {isLoading && <Loading />}
      </Layout>
      <Button
        onClick={onExport}
        marginBottom0
        disabled={isLoading}
      >
        <FormattedMessage id="ui-finance.invoice.unpaidInvoices.exportCSV" />
      </Button>
      <Button
        onClick={onContinue}
        buttonStyle="primary"
        marginBottom0
      >
        <FormattedMessage id="ui-finance.continue" />
      </Button>
    </>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
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
      <Headline tag="h1" margin="none" weight="regular">
        <FormattedMessage id="ui-finance.invoice.unpaidInvoices.header" />
      </Headline>
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
