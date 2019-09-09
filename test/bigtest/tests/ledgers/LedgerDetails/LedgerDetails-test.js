import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { LEDGER_VIEW_ROUTE } from '../../../../../src/common/const';

import setupApplication from '../../../helpers/setup-application';
import LedgerDetailsInteractor from '../../../interactors/ledgers/LedgerDetailsInteractor';

describe('Ledger details', () => {
  setupApplication();

  const ledgerDetails = new LedgerDetailsInteractor();

  beforeEach(async function () {
    const ledger = this.server.create('ledger');

    this.visit(`${LEDGER_VIEW_ROUTE}${ledger.id}`);
    await ledgerDetails.whenLoaded();
  });

  it('should show details pane', () => {
    expect(ledgerDetails.isPresent).to.be.true;
  });

  describe('close action', () => {
    beforeEach(async function () {
      await ledgerDetails.closePane.click();
    });

    it('should close details pane', () => {
      expect(ledgerDetails.isPresent).to.be.false;
    });
  });
});
