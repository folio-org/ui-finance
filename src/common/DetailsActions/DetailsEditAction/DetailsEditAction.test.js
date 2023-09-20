import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import DetailsEditAction from './DetailsEditAction';

const toggleActionMenuMock = jest.fn();
const onEditMock = jest.fn();

const renderDetailsEditAction = () => (render(
  <DetailsEditAction
    toggleActionMenu={toggleActionMenuMock}
    onEdit={onEditMock}
    perm="perm"
  />,
));

describe('DetailsEditAction component', () => {
  it('should call onEdit', async () => {
    renderDetailsEditAction();

    await user.click(screen.getByTestId('details-edit-action'));

    expect(toggleActionMenuMock).toHaveBeenCalled();
    expect(onEditMock).toHaveBeenCalled();
  });
});
