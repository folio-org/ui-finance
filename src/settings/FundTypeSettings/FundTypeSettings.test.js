import React from 'react';
import { render, screen } from '@testing-library/react';

import FundTypeSettings from './FundTypeSettings';

jest.mock('@folio/stripes-smart-components/lib/ControlledVocab', () => jest.fn().mockReturnValue('ControlledVocab'));

const renderFundTypeSettings = () => render(<FundTypeSettings stripes={{}} resources={{}} mutator={{}} />);

describe('FundTypeSettings component', () => {
  it('should display setting', async () => {
    renderFundTypeSettings();

    await screen.findByText('ControlledVocab');

    expect(screen.getByText('ControlledVocab')).toBeDefined();
  });
});
