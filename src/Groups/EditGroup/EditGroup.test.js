import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { GroupForm } from '../GroupForm';
import { EditGroup } from './EditGroup';

jest.mock('../GroupForm', () => ({
  GroupForm: jest.fn().mockReturnValue('GroupForm'),
}));

const mutatorMock = {
  groupEdit: {
    PUT: jest.fn(),
    GET: jest.fn(),
    reset: jest.fn(),
  },
};
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
};
const groupId = 'groupId';

const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: groupId }, path: 'path', url: 'url' },
  location: { hash: 'hash', pathname: 'pathname', search: 'search' },
  history: historyMock,
  resources: {
    groupEdit: {
      hasLoaded: true,
      records: [{ id: groupId }],
    },
  },
};

const renderEditGroup = (props = defaultProps) => render(
  <EditGroup
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('EditGroup', () => {
  beforeEach(() => {
    GroupForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.groupEdit.PUT.mockClear();
  });

  it('should display group form', () => {
    renderEditGroup();

    expect(screen.getByText('GroupForm')).toBeDefined();
  });

  it('should redirect to group details when edit is cancelled', () => {
    renderEditGroup();

    GroupForm.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should save group', async () => {
    mutatorMock.groupEdit.PUT.mockReturnValue(Promise.resolve({}));

    renderEditGroup();

    await screen.findByText('GroupForm');

    GroupForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.groupEdit.PUT).toHaveBeenCalled();
  });
});
