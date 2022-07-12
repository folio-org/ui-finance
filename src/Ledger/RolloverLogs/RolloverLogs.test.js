import { render, screen } from '@testing-library/react';

import { RolloverLogs } from './RolloverLogs';

const renderRolloverLogs = () => render(
  <RolloverLogs />,
);

describe('renderRolloverLogs', () => {
  it('should render rollover logs view', () => {
    renderRolloverLogs();

    expect(screen.getByText('Rollover logs')).toBeInTheDocument();
  });
});
