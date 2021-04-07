import React, { useCallback, useRef } from 'react';
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
import { IfPermission } from '@folio/stripes/core';
import {
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../common/DetailsActions';
import FinancialSummary from '../../common/FinancialSummary';
import { LEDGERS_ROUTE } from '../../common/const';
import {
  LEDGER_ACCORDTION,
  LEDGER_ACCORDTION_LABELS,
} from '../constants';
import LedgerInformation from './LedgerInformation';
import LedgerGroups from './LedgerGroups';
import LedgerFunds from './LedgerFunds';
import RolloverErrorsLink from './RolloverErrorsLink';

const LedgerDetails = ({
  ledger,
  fiscalYear,
  onClose,
  onEdit,
  onDelete,
  onRollover,
  funds,
  rolloverErrors,
  rolloverToFY,
}) => {
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const accordionStatusRef = useRef();
  const history = useHistory();

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = useCallback(
    ({ onToggle }) => {
      return (
        <MenuSection id="ledger-details-actions">
          <DetailsEditAction
            perm="finance.ledgers.item.put"
            onEdit={onEdit}
            toggleActionMenu={onToggle}
          />
          <DetailsRemoveAction
            perm="finance.ledgers.item.delete"
            toggleActionMenu={onToggle}
            onRemove={toggleRemoveConfirmation}
          />
          <IfPermission perm="ui-finance.ledger.rollover">
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
          </IfPermission>
        </MenuSection>
      );
    },
    [onEdit, toggleRemoveConfirmation, onRollover],
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
      handler: () => history.push(`${LEDGERS_ROUTE}/create`),
    },
    {
      name: 'edit',
      handler: onEdit,
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
              id={LEDGER_ACCORDTION.information}
              label={LEDGER_ACCORDTION_LABELS[LEDGER_ACCORDTION.information]}
            >
              <LedgerInformation
                metadata={ledger.metadata}
                name={ledger.name}
                code={ledger.code}
                status={ledger.ledgerStatus}
                description={ledger.description}
                acqUnitIds={ledger.acqUnitIds}
                fiscalYearCode={fiscalYear.code}
              />
            </Accordion>
            <Accordion
              id={LEDGER_ACCORDTION.financialSummary}
              label={LEDGER_ACCORDTION_LABELS[LEDGER_ACCORDTION.financialSummary]}
            >
              <FinancialSummary
                data={ledger}
                fiscalYearCurrency={fiscalYear.currency}
              />
            </Accordion>
            <Accordion
              id={LEDGER_ACCORDTION.group}
              label={LEDGER_ACCORDTION_LABELS[LEDGER_ACCORDTION.group]}
            >
              <LedgerGroups
                funds={funds}
                currency={fiscalYear.currency}
                ledgerId={ledger.id}
                fiscalYearId={fiscalYear.id}
              />
            </Accordion>
            <Accordion
              id={LEDGER_ACCORDTION.fund}
              label={LEDGER_ACCORDTION_LABELS[LEDGER_ACCORDTION.fund]}
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
                id={LEDGER_ACCORDTION.rolloverErrors}
                label={LEDGER_ACCORDTION_LABELS[LEDGER_ACCORDTION.rolloverErrors]}
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
      </Pane>
    </HasCommand>
  );
};

LedgerDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRollover: PropTypes.func.isRequired,
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
