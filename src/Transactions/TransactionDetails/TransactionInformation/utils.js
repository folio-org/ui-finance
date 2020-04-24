import { TRANSACTION_SOURCE } from '../../constants';

export function getSourceLink(source, fiscalYearId = '', invoiceId = '', invoiceLineId = '', poLineId = '') {
  switch (source) {
    case TRANSACTION_SOURCE.invoice: return invoiceId && invoiceLineId ? `/invoice/view/${invoiceId}/line/${invoiceLineId}` : '';
    case TRANSACTION_SOURCE.fiscalYear: return fiscalYearId ? `/finance/fiscalyear/${fiscalYearId}/view` : '';
    case TRANSACTION_SOURCE.poLine: return poLineId ? `/orders/lines/view/${poLineId}` : '';
    default: return '';
  }
}
