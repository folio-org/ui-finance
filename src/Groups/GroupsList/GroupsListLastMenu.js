import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router';

import {
  Button,
  MenuSection,
  Icon,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { GROUPS_ROUTE } from '../../common/const';
import { IS_GROUP_BATCH_ALLOCATION_ENABLED } from '../constants';

const GroupsListLastMenu = () => {
  const location = useLocation();

  return (
    <MenuSection id="group-list-actions">
      <IfPermission perm="finance.groups.item.post">
        <FormattedMessage id="stripes-smart-components.addNew">
          {ariaLabel => (
            <Button
              id="clickable-newGroup"
              data-testid="create-group-button"
              aria-label={ariaLabel}
              to={{
                pathname: `${GROUPS_ROUTE}/create`,
                search: location.search,
              }}
              buttonStyle="dropdownItem"
            >
              <Icon size="small" icon="plus-sign">
                <FormattedMessage id="stripes-smart-components.new" />
              </Icon>
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>
      {IS_GROUP_BATCH_ALLOCATION_ENABLED && (
        <IfPermission perm="ui-finance.fund-update-logs.view">
          <FormattedMessage id="ui-finance.actions.allocations.batch.logs">
            {ariaLabel => (
              <Button
                id="clickable-batch-allocation-logs"
                data-testid="view-batch-allocation-logs-button"
                aria-label={ariaLabel}
                to={{
                  pathname: `${GROUPS_ROUTE}/batch-allocations/logs`,
                  state: { ...location },
                }}
                buttonStyle="dropdownItem"
              >
                <Icon size="small" icon="report">
                  <FormattedMessage id="ui-finance.actions.allocations.batch.logs" />
                </Icon>
              </Button>
            )}
          </FormattedMessage>
        </IfPermission>
      )}
    </MenuSection>
  );
};

export default GroupsListLastMenu;
