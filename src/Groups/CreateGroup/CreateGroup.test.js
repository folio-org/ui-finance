import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { GROUPS_ROUTE } from '../../common/const';
import { GroupForm } from '../GroupForm';
import { CreateGroup } from './CreateGroup';

jest.mock('../GroupForm', () => ({
  GroupForm: jest.fn().mockReturnValue('GroupForm'),
}));

const mutatorMock = {
  createGroup: {
    POST: jest.fn(),
  },
};
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const groupId = 'groupId';

const renderCreateGroup = (props) => render(
  <CreateGroup
    location={locationMock}
    history={historyMock}
    mutator={mutatorMock}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('CreateGroup', () => {
  beforeEach(() => {
    GroupForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.createGroup.POST.mockClear();
  });

  it('should display group form', () => {
    renderCreateGroup();

    expect(screen.getByText('GroupForm')).toBeDefined();
  });

  it('should redirect to group list when create is cancelled', () => {
    renderCreateGroup();

    GroupForm.mock.calls[0][0].onCancel();

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(GROUPS_ROUTE);
  });

  it('should redirect to group details when create is completed', () => {
    renderCreateGroup();

    GroupForm.mock.calls[0][0].onCancel(groupId);

    expect(historyMock.push.mock.calls[0][0].pathname).toBe(`${GROUPS_ROUTE}/${groupId}/view`);
  });

  it('should save new group', async () => {
    mutatorMock.createGroup.POST.mockReturnValue(Promise.resolve({ id: groupId }));

    renderCreateGroup();

    await screen.findByText('GroupForm');

    GroupForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.createGroup.POST).toHaveBeenCalled();
  });
});
