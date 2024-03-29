import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import DetailsRemoveAction from './DetailsRemoveAction';

const toggleActionMenuMock = jest.fn();
const onRemoveMock = jest.fn();

const renderDetailsRemoveAction = () => (render(
  <DetailsRemoveAction
    toggleActionMenu={toggleActionMenuMock}
    onRemove={onRemoveMock}
    perm="perm"
  />,
));

describe('DetailsRemoveAction component', () => {
  it('should call onRemove', async () => {
    renderDetailsRemoveAction();

    await user.click(screen.getByTestId('details-remove-action'));

    expect(toggleActionMenuMock).toHaveBeenCalled();
    expect(onRemoveMock).toHaveBeenCalled();
  });
});
