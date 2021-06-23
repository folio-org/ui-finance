import React from 'react';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

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
  it('should call onEdit', () => {
    renderDetailsEditAction();

    user.click(screen.getByTestId('details-edit-action'));

    expect(toggleActionMenuMock).toHaveBeenCalled();
    expect(onEditMock).toHaveBeenCalled();
  });
});
