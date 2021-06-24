import React from 'react';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';

import NoPermissionsMessage from './NoPermissionsMessage';

const renderNoPermissionsMessage = () => (render(
  <NoPermissionsMessage />,
  { wrapper: MemoryRouter },
));

describe('NoPermissionsMessage', () => {
  it('should display message', () => {
    const { getByText } = renderNoPermissionsMessage();

    expect(getByText('ui-finance.noPermissionsMessage')).toBeDefined();
  });
});
