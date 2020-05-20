import { TRANSACTION_SOURCE } from '../../../constants';

export function getSourceLink({
  source,
  fiscalYearId,
  sourceInvoiceId,
  sourceInvoiceLineId,
  encumbrance,
}) {
  const invoiceLineLink = sourceInvoiceId && sourceInvoiceLineId && `/invoice/view/${sourceInvoiceId}/line/${sourceInvoiceLineId}/view`;
  const invoiceLink = sourceInvoiceId && `/invoice/view/${sourceInvoiceId}`;

  switch (source) {
    case TRANSACTION_SOURCE.invoice:
      return invoiceLineLink || invoiceLink;
    case TRANSACTION_SOURCE.fiscalYear:
      return fiscalYearId && `/finance/fiscalyear/${fiscalYearId}/view`;
    case TRANSACTION_SOURCE.poLine:
      return encumbrance?.sourcePoLineId && `/orders/lines/view/${encumbrance.sourcePoLineId}`;
    default:
      return null;
  }
}
