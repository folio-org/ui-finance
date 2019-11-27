import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  MenuSection,
  PaneMenu,
  Pane,
  Row,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import {
  useAccordionToggle,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  DetailsEditAction,
  DetailsRemoveAction,
} from '../../../common/DetailsActions';
import {
  LEDGER_ACCORDTION,
  LEDGER_ACCORDTION_LABELS,
} from '../constants';
import LedgerInformation from './LedgerInformation';
import LedgerGroups from './LedgerGroups';
import LedgerFunds from './LedgerFunds';

const LedgerView = ({
  ledger,
  fiscalYear,
  onClose,
  editLedger,
  removeLedger,
  funds,
}) => {
  const [isRemoveConfirmation, toggleRemoveConfirmation] = useModalToggle();
  const [expandAll, sections, toggleSection] = useAccordionToggle();

  // eslint-disable-next-line react/prop-types
  const renderActionMenu = useCallback(
    ({ onToggle }) => {
      return (
        <MenuSection id="ledger-details-actions">
          <DetailsEditAction
            perm="finance.ledgers.item.put"
            onEdit={editLedger}
            toggleActionMenu={onToggle}
          />
          <DetailsRemoveAction
            perm="finance.ledgers.item.delete"
            toggleActionMenu={onToggle}
            onRemove={toggleRemoveConfirmation}
          />
        </MenuSection>
      );
    },
    [editLedger, toggleRemoveConfirmation],
  );

  const onRemove = useCallback(
    () => {
      toggleRemoveConfirmation();
      removeLedger();
    },
    [removeLedger, toggleRemoveConfirmation],
  );

  const lastMenu = (
    <PaneMenu>
      <IfPermission perm="finance.ledgers.item.put">
        <FormattedMessage id="ui-finance.ledger.editAriaLabel">
          {ariaLabel => (
            <Button
              aria-label={ariaLabel}
              buttonStyle="primary"
              id="clickable-edit-ledger"
              marginBottom0
              onClick={editLedger}
            >
              <FormattedMessage id="stripes-components.button.edit" />
            </Button>
          )}
        </FormattedMessage>
      </IfPermission>
    </PaneMenu>
  );

  return (
    <Pane
      id="pane-ledger-details"
      defaultWidth="fill"
      dismissible
      actionMenu={renderActionMenu}
      paneTitle={ledger.name}
      onClose={onClose}
      lastMenu={lastMenu}
    >
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>

      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
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
            available={ledger.available}
            allocated={ledger.allocated}
            unavailable={ledger.unavailable}
            currency={ledger.currency}
          />
        </Accordion>
        <Accordion
          id={LEDGER_ACCORDTION.group}
          label={LEDGER_ACCORDTION_LABELS[LEDGER_ACCORDTION.group]}
        >
          <LedgerGroups
            funds={funds}
            currency={ledger.currency}
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
            currency={ledger.currency}
          />
        </Accordion>
      </AccordionSet>

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
  );
};

LedgerView.propTypes = {
  onClose: PropTypes.func.isRequired,
  editLedger: PropTypes.func.isRequired,
  removeLedger: PropTypes.func.isRequired,
  ledger: PropTypes.object,
  fiscalYear: PropTypes.object,
  funds: PropTypes.arrayOf(PropTypes.object),
};

LedgerView.defaultProps = {
  fiscalYear: {},
  funds: [],
  ledger: {},
};

export default LedgerView;
