import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import {
  getErrorCodeFromResponse,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  GROUPS_ROUTE,
} from '../../common/const';
import {
  groupsResource,
} from '../../common/resources';
import { GROUP_STATUS } from '../constants';
import { GroupForm } from '../GroupForm';

const INITIAL_GROUP = {
  status: GROUP_STATUS.active,
};

const CreateGroup = ({ mutator, location, history }) => {
  const showCallout = useShowCallout();
  const intl = useIntl();

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
        closeForm(savedGroup.id);

        return undefined;
      } catch (response) {
        const errorCode = await getErrorCodeFromResponse(response);
        const errorMessage = (
          <FormattedMessage
            id={`ui-finance.groups.actions.save.error.${errorCode}`}
            defaultMessage={intl.formatMessage({ id: 'ui-finance.groups.actions.save.error.genericError' })}
          />
        );

        showCallout({
          message: errorMessage,
          type: 'error',
        });

        return { [FORM_ERROR]: 'Group was not saved' };
      }
    },
    [closeForm, showCallout],
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
