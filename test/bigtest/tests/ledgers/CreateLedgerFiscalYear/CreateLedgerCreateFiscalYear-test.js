import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGERS_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import FiscalYearFormInteractor from '../../../interactors/fiscalYear/FiscalYearForm';
import LedgerFormInteractor from '../../../interactors/ledgers/LedgerForm';

describe('Create Ledger - Fiscal year form', () => {
  setupApplication();

  const fiscalYearForm = new FiscalYearFormInteractor();
  const ledgerForm = new LedgerFormInteractor();

  beforeEach(async function () {
    this.visit(`${LEDGERS_ROUTE}/fiscalyear/create`);

    await fiscalYearForm.whenLoaded();

    await fiscalYearForm.name.fill('Ledger year');
    await fiscalYearForm.code.fill('FY2020');
    await fiscalYearForm.periodStart.fill('2019-01-01');
    await fiscalYearForm.periodEnd.fill('2019-12-31');
    await fiscalYearForm.saveButton.click();

    await ledgerForm.whenLoaded();
  });

  it('should redirect to ledger form after save', () => {
    expect(ledgerForm.isPresent).to.be.true;
  });
});
