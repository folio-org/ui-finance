import React, {
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  Label,
  MenuSection,
  Pane,
  Row,
} from '@folio/stripes/components';
import {
  IfPermission,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  handleKeyCommand,
  useAcqRestrictions,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsExportAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import FinancialSummary from '../../common/FinancialSummary';
import {
  AllocationToolsMenuSection,
  DownloadAllocationWorksheetModal,
  UploadAllocationWorksheetModal,
} from '../../common/components';
import {
  BATCH_ALLOCATIONS_SOURCE,
  LEDGERS_ROUTE,
} from '../../common/const';
import {
  LEDGER_ACCORDION,
  LEDGER_ACCORDION_LABELS,
} from '../constants';
import LedgerInformation from './LedgerInformation';
import LedgerGroups from './LedgerGroups';
import LedgerFunds from './LedgerFunds';
import RolloverErrorsLink from './RolloverErrorsLink';
import { ExportSettingsModal } from './ExportSettingsModal';

const LedgerDetails = ({
  ledger,
  fiscalYear,
  onClose,
  onEdit,
  onDelete,
  onRollover,
  onRolloverLogs,
  funds,
  rolloverErrors,
  rolloverToFY,
}) => {
  const [isExportConfirmation, toggleExportConfirmation] = useModalToggle();
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const [isDownloadAllocationWorksheetModalOpen, toggleDownloadAllocationWorksheetModal] = useModalToggle();
  const [isUploadAllocationWorksheetModalOpen, toggleUploadAllocationWorksheetModal] = useModalToggle();
  const accordionStatusRef = useRef();
  const history = useHistory();
  const stripes = useStripes();

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(
    ledger.id,
    ledger.acqUnitIds,
  );

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = useCallback(
    ({ onToggle }) => {
      return (
        <>
          <MenuSection id="ledger-details-actions">
            <DetailsEditAction
              perm="finance.ledgers.item.put"
              onEdit={onEdit}
              toggleActionMenu={onToggle}
              disabled={isRestrictionsLoading || restrictions.protectUpdate}
            />
            <DetailsExportAction
              perm="ui-finance.exportCSV"
              onExportCSV={toggleExportConfirmation}
              toggleActionMenu={onToggle}
            />
            <DetailsRemoveAction
              perm="finance.ledgers.item.delete"
              toggleActionMenu={onToggle}
              onRemove={toggleRemoveConfirmation}
              disabled={isRestrictionsLoading || restrictions.protectDelete}
            />
            <IfPermission perm="ui-finance.ledger.rollover.execute">
              <Button
                buttonStyle="dropdownItem"
                data-test-ledger-rollover-action
                onClick={() => {
                  onRollover();
                  onToggle();
                }}
              >
                <Icon
                  size="small"
                  icon="calendar"
                >
                  <FormattedMessage id="ui-finance.actions.rollover" />
                </Icon>
              </Button>

              <Button
                data-testid="action-rollover-logs"
                buttonStyle="dropdownItem"
                onClick={onRolloverLogs}
              >
                <Icon
                  size="small"
                  icon="calendar"
                >
                  <FormattedMessage id="ui-finance.actions.rolloverLogs" />
                </Icon>
              </Button>
            </IfPermission>
          </MenuSection>

          <AllocationToolsMenuSection
            onDownloadAllocationWorksheet={() => {
              onToggle();
              toggleDownloadAllocationWorksheetModal();
            }}
            onUploadAllocationWorksheet={() => {
              onToggle();
              toggleUploadAllocationWorksheetModal();
            }}
          />
        </>
      );
    },
    [
      isRestrictionsLoading,
      onEdit,
      onRollover,
      onRolloverLogs,
      restrictions,
      toggleExportConfirmation,
      toggleDownloadAllocationWorksheetModal,
      toggleRemoveConfirmation,
      toggleUploadAllocationWorksheetModal,
    ],
  );

  const onRemove = useCallback(
    () => {
      toggleRemoveConfirmation();
      onDelete();
    },
    [onDelete, toggleRemoveConfirmation],
  );

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-finance.ledger.create')) {
          history.push(`${LEDGERS_ROUTE}/create`);
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (
          stripes.hasPerm('ui-finance.ledger.edit') &&
          !isRestrictionsLoading &&
          !restrictions.protectUpdate
        ) onEdit();
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

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager record={ledger.name} />
      <Pane
        id="pane-ledger-details"
        defaultWidth="fill"
        dismissible
        actionMenu={renderActionMenu}
        paneTitle={ledger.name}
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
              id={LEDGER_ACCORDION.information}
              label={LEDGER_ACCORDION_LABELS[LEDGER_ACCORDION.information]}
            >
              <LedgerInformation
                metadata={ledger.metadata}
                name={ledger.name}
                code={ledger.code}
                status={ledger.ledgerStatus}
                description={ledger.description}
                acqUnitIds={ledger.acqUnitIds}
                fiscalYearCode={fiscalYear.code}
                restrictEncumbrance={ledger.restrictEncumbrance}
                restrictExpenditures={ledger.restrictExpenditures}
              />
            </Accordion>
            <Accordion
              id={LEDGER_ACCORDION.financialSummary}
              label={LEDGER_ACCORDION_LABELS[LEDGER_ACCORDION.financialSummary]}
            >
              <FinancialSummary
                data={ledger}
                fiscalYearCurrency={fiscalYear.currency}
              />
            </Accordion>
            <Accordion
              id={LEDGER_ACCORDION.group}
              label={LEDGER_ACCORDION_LABELS[LEDGER_ACCORDION.group]}
            >
              <LedgerGroups
                funds={funds}
                currency={fiscalYear.currency}
                ledgerId={ledger.id}
                fiscalYearId={fiscalYear.id}
              />
            </Accordion>
            <Accordion
              id={LEDGER_ACCORDION.fund}
              label={LEDGER_ACCORDION_LABELS[LEDGER_ACCORDION.fund]}
            >
              <LedgerFunds
                funds={funds}
                fiscalYearId={fiscalYear.id}
                currency={fiscalYear.currency}
                ledgerId={ledger.id}
              />
            </Accordion>
            {!rolloverErrors.length ? null : (
              <Accordion
                id={LEDGER_ACCORDION.rolloverErrors}
                label={LEDGER_ACCORDION_LABELS[LEDGER_ACCORDION.rolloverErrors]}
              >
                <Label>
                  <FormattedMessage id="ui-finance.ledger.rolloverErrorsLabel" />
                </Label>
                <RolloverErrorsLink
                  errors={rolloverErrors}
                  ledgerName={ledger.name}
                  toYearCode={rolloverToFY.code}
                />
              </Accordion>
            )}
          </AccordionSet>
        </AccordionStatus>

        {isRemoveConfirmation && (
          <ConfirmationModal
            id="ledger-remove-confirmation"
            confirmLabel={<FormattedMessage id="ui-finance.actions.remove.confirm" />}
            heading={<FormattedMessage id="ui-finance.ledger.remove.heading" />}
            message={<FormattedMessage id="ui-finance.ledger.remove.message" />}
            onCancel={toggleRemoveConfirmation}
            onConfirm={onRemove}
            open
          />
        )}

        {isExportConfirmation && (
          <ExportSettingsModal
            fiscalYear={fiscalYear}
            ledger={ledger}
            onCancel={toggleExportConfirmation}
          />
        )}

        {
          isDownloadAllocationWorksheetModalOpen && (
            <DownloadAllocationWorksheetModal
              open
              ledgerId={ledger?.id}
              toggle={toggleDownloadAllocationWorksheetModal}
            />
          )
        }

        {
          isUploadAllocationWorksheetModalOpen && (
            <UploadAllocationWorksheetModal
              open
              toggle={toggleUploadAllocationWorksheetModal}
              sourceType={BATCH_ALLOCATIONS_SOURCE.ledger}
            />
          )
        }
      </Pane>
    </HasCommand>
  );
};

LedgerDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRollover: PropTypes.func.isRequired,
  onRolloverLogs: PropTypes.func.isRequired,
  ledger: PropTypes.object,
  fiscalYear: PropTypes.object,
  funds: PropTypes.arrayOf(PropTypes.object),
  rolloverErrors: PropTypes.arrayOf(PropTypes.object),
  rolloverToFY: PropTypes.object,
};

LedgerDetails.defaultProps = {
  fiscalYear: {},
  funds: [],
  ledger: {},
  rolloverErrors: [],
  rolloverToFY: {},
};

export default LedgerDetails;
