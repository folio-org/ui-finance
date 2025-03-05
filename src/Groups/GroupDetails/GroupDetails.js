import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import {
  useStripes,
  IfPermission,
  Pluggable,
  TitleManager,
} from '@folio/stripes/core';
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
  handleKeyCommand,
  useAcqRestrictions,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import FinancialSummary from '../../common/FinancialSummary';
import {
  AllocationToolsMenuSection,
  BatchAllocationModal,
  DownloadAllocationWorksheetModal,
  UploadAllocationWorksheetModal,
} from '../../common/components';
import {
  BATCH_ALLOCATIONS_SOURCE,
  GROUPS_ROUTE,
} from '../../common/const';
import {
  GROUP_ACCORDION,
  GROUP_ACCORDION_LABELS,
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
  onAddFundToGroup,
  onRemoveFundFromGroup,
}) => {
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const [isDownloadAllocationWorksheetModalOpen, toggleDownloadAllocationWorksheetModal] = useModalToggle();
  const [isUploadAllocationWorksheetModalOpen, toggleUploadAllocationWorksheetModal] = useModalToggle();
  const [isBatchAllocationModal, toggleBatchAllocationModal] = useModalToggle();
  const accordionStatusRef = useRef();
  const history = useHistory();
  const stripes = useStripes();
  const isFundGroupRemovable = stripes.hasPerm('finance.funds.item.put');
  const removeFundProp = isFundGroupRemovable ? { onRemoveFundFromGroup } : {};
  const isGroupBatchAllocationEnabled = false;

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(
    group.id, group.acqUnitIds,
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = useCallback(
    ({ onToggle }) => {
      return (
        <>
          <MenuSection id="group-details-actions">
            <DetailsEditAction
              perm="finance.groups.item.put"
              onEdit={editGroup}
              toggleActionMenu={onToggle}
              disabled={isRestrictionsLoading || restrictions.protectUpdate}
            />
            <DetailsRemoveAction
              perm="finance.groups.item.delete"
              toggleActionMenu={onToggle}
              onRemove={toggleRemoveConfirmation}
              disabled={isRestrictionsLoading || restrictions.protectDelete}
            />
          </MenuSection>

          {/* TODO: Temporarily hide this section for groups */}
          {isGroupBatchAllocationEnabled && (
            <AllocationToolsMenuSection
              onDownloadAllocationWorksheet={() => {
                onToggle();
                toggleDownloadAllocationWorksheetModal();
              }}
              onUploadAllocationWorksheet={() => {
                onToggle();
                toggleUploadAllocationWorksheetModal();
              }}
              onBatchAllocate={() => {
                onToggle();
                toggleBatchAllocationModal();
              }}
            />
          )}
        </>
      );
    },
    [
      editGroup,
      isRestrictionsLoading,
      restrictions.protectUpdate,
      restrictions.protectDelete,
      toggleBatchAllocationModal,
      toggleDownloadAllocationWorksheetModal,
      toggleRemoveConfirmation,
      toggleUploadAllocationWorksheetModal,
    ],
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
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.group.create')) {
          history.push(`${GROUPS_ROUTE}/create`);
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (
          stripes.hasPerm('ui-finance.group.edit') &&
          !isRestrictionsLoading &&
          !restrictions.protectUpdate
        ) editGroup();
      }),
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

  const groupFundActions = (
    <IfPermission perm="finance.funds.item.put">
      <Pluggable
        aria-haspopup="true"
        type="find-fund"
        dataKey="group-funds"
        searchButtonStyle="default"
        searchLabel={<FormattedMessage id="ui-finance.groups.actions.addFunds" />}
        addFunds={onAddFundToGroup}
      >
        <span>
          <FormattedMessage id="ui-finance.plugin.findFund.notFound" />
        </span>
      </Pluggable>
    </IfPermission>
  );

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager record={group.name} />
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
              id={GROUP_ACCORDION.information}
              label={GROUP_ACCORDION_LABELS[GROUP_ACCORDION.information]}
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
              id={GROUP_ACCORDION.financialSummary}
              label={GROUP_ACCORDION_LABELS[GROUP_ACCORDION.financialSummary]}
            >
              <FinancialSummary
                data={groupSummary}
                fiscalYearCurrency={selectedFY.currency}
              />
            </Accordion>
            <Accordion
              id={GROUP_ACCORDION.fund}
              label={GROUP_ACCORDION_LABELS[GROUP_ACCORDION.fund]}
              displayWhenOpen={groupFundActions}
            >
              <GroupFund
                currency={selectedFY.currency}
                funds={funds}
                fiscalYearId={selectedFY.id}
                groupId={group.id}
                {...removeFundProp}
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

        {
          isDownloadAllocationWorksheetModalOpen && (
            <DownloadAllocationWorksheetModal
              open
              sourceType={BATCH_ALLOCATIONS_SOURCE.group}
              toggle={toggleDownloadAllocationWorksheetModal}
            />
          )
        }

        {
          isUploadAllocationWorksheetModalOpen && (
            <UploadAllocationWorksheetModal
              open
              sourceType={BATCH_ALLOCATIONS_SOURCE.group}
              toggle={toggleUploadAllocationWorksheetModal}
            />
          )
        }
        {
          isBatchAllocationModal && (
            <BatchAllocationModal
              open
              sourceType={BATCH_ALLOCATIONS_SOURCE.group}
              toggle={toggleBatchAllocationModal}
            />
          )
        }
      </Pane>
    </HasCommand>
  );
};

GroupDetails.propTypes = {
  editGroup: PropTypes.func.isRequired,
  fiscalYearsRecords: PropTypes.shape({
    current: PropTypes.arrayOf(PropTypes.object),
    previous: PropTypes.arrayOf(PropTypes.object),
  }),
  funds: PropTypes.arrayOf(PropTypes.object),
  group: PropTypes.object.isRequired,
  groupSummary: PropTypes.shape({
    allocated: PropTypes.number,
    unavailable: PropTypes.number,
    available: PropTypes.number,
  }),
  onAddFundToGroup: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFundFromGroup: PropTypes.func.isRequired,
  onSelectFY: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired,
  selectedFY: PropTypes.object.isRequired,
};

GroupDetails.defaultProps = {
  groupSummary: {},
  fiscalYearsRecords: { current: [], previous: [] },
  funds: [],
};

export default GroupDetails;
