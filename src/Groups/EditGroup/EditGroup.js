import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { LoadingView } from '@folio/stripes/components';
import {
  useShowToast,
} from '@folio/stripes-acq-components';

import { GROUPS_ROUTE } from '../../common/const';
import { groupByUrlIdResource } from '../../common/resources';
import { GroupForm } from '../GroupForm';

const EditGroup = ({ resources, mutator, match, history, location }) => {
  const groupId = match.params.id;

  useEffect(
    () => {
      mutator.groupEdit.reset();
      mutator.groupEdit.GET();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId],
  );

  const showToast = useShowToast();

  const closeEdit = useCallback(
    () => {
      history.push({
        pathname: `${GROUPS_ROUTE}/${groupId}/view`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupId, location.search],
  );

  const saveGroup = useCallback(
    async (group) => {
      try {
        const savedGroup = await mutator.groupEdit.PUT(group);

        showToast('ui-finance.groups.actions.save.success');
        setTimeout(() => closeEdit(), 0);

        return savedGroup;
      } catch (response) {
        showToast('ui-finance.groups.actions.save.error', 'error');

        return { id: 'Unable to edit group' };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeEdit, mutator.groupEdit],
  );

  const hasLoaded = get(resources, ['groupEdit', 'hasLoaded']);
  const group = get(resources, ['groupEdit', 'records', '0']);

  return hasLoaded
    ? (
      <GroupForm
        initialValues={group}
        onSubmit={saveGroup}
        onCancel={closeEdit}
      />
    )
    : (
        <LoadingView onClose={closeEdit} />
    );
};

EditGroup.manifest = Object.freeze({
  groupEdit: {
    ...groupByUrlIdResource,
    accumulate: true,
  },
});

EditGroup.propTypes = {
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};

export default withRouter(stripesConnect(EditGroup));
