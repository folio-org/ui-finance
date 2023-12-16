import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { FundLocationsListItem } from './FundLocationsListItem';

const defaultProps = {
  location: { id: 'location-id', name: 'Loc 1', code: 'l1' },
  index: 0,
  onRemove: jest.fn(),
};

const renderFundLocationsListItem = (props = {}) => render(
  <FundLocationsListItem
    {...defaultProps}
    {...props}
  />,
);

describe('FundLocationsListItem', () => {
  beforeEach(() => {
    defaultProps.onRemove.mockClear();
  });

  it('should render fund location item', () => {
    renderFundLocationsListItem();

    expect(screen.getByText('Loc 1 (l1)')).toBeInTheDocument();
  });

  it('should call \'onRemove\' when \'X\' icon button clicked', async () => {
    renderFundLocationsListItem();

    await user.click(screen.getByLabelText('ui-finance.fund.information.locations.action.remove: Loc 1 (l1)'));

    expect(defaultProps.onRemove).toHaveBeenCalledWith(defaultProps.location);
  });
});
