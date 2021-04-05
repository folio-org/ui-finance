import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  MenuSection,
  Pane,
  Row,
} from '@folio/stripes/components';
import {
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import FinancialSummary from '../../common/FinancialSummary';
import { GROUPS_ROUTE } from '../../common/const';
import {
  GROUP_ACCORDTION,
  GROUP_ACCORDTION_LABELS,
} from '../constants';
import GroupInformation from './GroupInformation';
import GroupFund from './GroupFund';
import { GroupExpenseClasses } from './GroupExpenseClasses';

const GroupDetails = ({
  group,
  groupSummary,
  fiscalYearsRecords,
  funds,
  onClose,
  editGroup,
  removeGroup,
  selectedFY,
  onSelectFY,
}) => {
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const accordionStatusRef = useRef();
  const history = useHistory();

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = useCallback(
    ({ onToggle }) => {
      return (
        <MenuSection id="group-details-actions">
          <DetailsEditAction
            perm="finance.groups.item.put"
            onEdit={editGroup}
            toggleActionMenu={onToggle}
          />
          <DetailsRemoveAction
            perm="finance.groups.item.delete"
            toggleActionMenu={onToggle}
            onRemove={toggleRemoveConfirmation}
          />
        </MenuSection>
      );
    },
    [editGroup, toggleRemoveConfirmation],
  );

  const onRemove = useCallback(
    () => {
      toggleRemoveConfirmation();
      removeGroup();
    },
    [removeGroup, toggleRemoveConfirmation],
  );

  const shortcuts = [
    {
      name: 'new',
      handler: () => history.push(`${GROUPS_ROUTE}/create`),
    },
    {
      name: 'edit',
      handler: editGroup,
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Pane
        id="pane-group-details"
        defaultWidth="fill"
        dismissible
        actionMenu={renderActionMenu}
        paneTitle={group.name}
        onClose={onClose}
      >
        <AccordionStatus ref={accordionStatusRef}>
          <Row end="xs">
            <Col xs={12}>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion
              id={GROUP_ACCORDTION.information}
              label={GROUP_ACCORDTION_LABELS[GROUP_ACCORDTION.information]}
            >
              <GroupInformation
                metadata={group.metadata}
                name={group.name}
                code={group.code}
                status={group.status}
                description={group.description}
                acqUnitIds={group.acqUnitIds}
                fiscalYears={fiscalYearsRecords}
                selectedFiscalYearId={selectedFY.id}
                onSelectFY={onSelectFY}
              />
            </Accordion>
            <Accordion
              id={GROUP_ACCORDTION.financialSummary}
              label={GROUP_ACCORDTION_LABELS[GROUP_ACCORDTION.financialSummary]}
            >
              <FinancialSummary
                data={groupSummary}
                fiscalYearCurrency={selectedFY.currency}
              />
            </Accordion>
            <Accordion
              id={GROUP_ACCORDTION.fund}
              label={GROUP_ACCORDTION_LABELS[GROUP_ACCORDTION.fund]}
            >
              <GroupFund
                currency={selectedFY.currency}
                funds={funds}
                fiscalYearId={selectedFY.id}
                groupId={group.id}
              />
            </Accordion>
            <GroupExpenseClasses
              fiscalYearId={selectedFY.id}
              groupId={group.id}
              currency={selectedFY.currency}
            />
          </AccordionSet>
        </AccordionStatus>

        {isRemoveConfirmation && (
          <ConfirmationModal
            id="group-remove-confirmation"
            confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
            heading={<FormattedMessage id="ui-finance.groups.actions.remove.heading" />}
            message={<FormattedMessage id="ui-finance.groups.actions.remove.message" />}
            onCancel={toggleRemoveConfirmation}
            onConfirm={onRemove}
            open
          />
        )}
      </Pane>
    </HasCommand>
  );
};

GroupDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired,
  group: PropTypes.object.isRequired,
  groupSummary: PropTypes.shape({
    allocated: PropTypes.number,
    unavailable: PropTypes.number,
    available: PropTypes.number,
  }),
  fiscalYearsRecords: PropTypes.arrayOf(PropTypes.object),
  funds: PropTypes.arrayOf(PropTypes.object),
  selectedFY: PropTypes.object.isRequired,
  onSelectFY: PropTypes.func.isRequired,
};

GroupDetails.defaultProps = {
  groupSummary: {},
  fiscalYearsRecords: [],
  funds: [],
};

export default GroupDetails;
