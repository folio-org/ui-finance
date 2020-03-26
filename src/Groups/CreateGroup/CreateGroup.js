import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { SubmissionError } from 'redux-form';

import { stripesConnect } from '@folio/stripes/core';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  GROUPS_ROUTE,
} from '../../common/const';
import {
  groupsResource,
} from '../../common/resources';
import { GroupForm } from '../GroupForm';

const INITIAL_GROUP = {};

const CreateGroup = ({ mutator, location, history }) => {
  const showCallout = useShowCallout();

  const closeForm = useCallback(
    (id) => {
      history.push({
        pathname: id ? `${GROUPS_ROUTE}/${id}/view` : GROUPS_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const saveGroup = useCallback(
    async (groupValues) => {
      try {
        const savedGroup = await mutator.createGroup.POST(groupValues);

        showCallout({
          messageId: 'ui-finance.groups.actions.save.success',
        });
        setTimeout(() => closeForm(savedGroup.id), 0);

        return savedGroup;
      } catch (response) {
        showCallout({
          messageId: 'ui-finance.groups.actions.save.error',
          type: 'error',
        });
        throw new SubmissionError({
          _error: 'Group was not saved',
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeForm],
  );

  return (
    <GroupForm
      initialValues={INITIAL_GROUP}
      onSubmit={saveGroup}
      onCancel={closeForm}
    />
  );
};

CreateGroup.manifest = Object.freeze({
  createGroup: {
    ...groupsResource,
    fetch: true,
  },
});

CreateGroup.propTypes = {
  mutator: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(stripesConnect(CreateGroup));
