import React from 'react';
import { render, screen } from '@testing-library/react';

import { ControlledVocab } from '@folio/stripes/smart-components';

import FundTypeSettings from './FundTypeSettings';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn().mockReturnValue('ControlledVocab'));

const stripes = { hasPerm: () => true };
const renderFundTypeSettings = () => render(<FundTypeSettings stripes={stripes} resources={{}} mutator={{}} />);

describe('FundTypeSettings component', () => {
  it('should display setting', async () => {
    renderFundTypeSettings();

    await screen.findByText('ControlledVocab');
    const { actionSuppressor } = ControlledVocab.mock.calls[0][0];

    expect(actionSuppressor.edit()).toBeFalsy();
    expect(actionSuppressor.delete()).toBeFalsy();
    expect(screen.getByText('ControlledVocab')).toBeDefined();
  });
});
