import { TRANSACTION_SOURCE } from '../../../constants';
import { getSourceLink } from './utils';

test('getSourceLink for invoice line source', () => {
  const link = getSourceLink({ source: TRANSACTION_SOURCE.invoice, sourceInvoiceId: 'invoiceId', sourceInvoiceLineId: 'invoiceLineId' });

  expect(link).toBe('/invoice/view/invoiceId/line/invoiceLineId/view');
});

test('getSourceLink for invoice source', () => {
  const link = getSourceLink({ source: TRANSACTION_SOURCE.invoice, sourceInvoiceId: 'invoiceId' });

  expect(link).toBe('/invoice/view/invoiceId');
});

test('getSourceLink for fiscal year source', () => {
  const link = getSourceLink({ source: TRANSACTION_SOURCE.fiscalYear, fiscalYearId: 'fyId' });

  expect(link).toBe('/finance/fiscalyear/fyId/view');
});

test('getSourceLink for poLine source', () => {
  const link = getSourceLink({ source: TRANSACTION_SOURCE.poLine, encumbrance: { sourcePoLineId: 'polId' } });

  expect(link).toBe('/orders/lines/view/polId');
});

test('getSourceLink - source is not specified', () => {
  const link = getSourceLink({});

  expect(link).toBe(null);
});
