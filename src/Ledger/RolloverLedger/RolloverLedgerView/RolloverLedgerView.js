import { useCallback, useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  LoadingPane,
  Pane,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { formatDate, handleKeyCommand } from '@folio/stripes-acq-components';

import { LEDGERS_ROUTE } from '../../../common/const';
import {
  useLedger,
  useLedgerRollover,
} from '../../../common/hooks';
import {
  ROLLOVER_LEDGER_ACCORDION,
  ROLLOVER_LEDGER_ACCORDION_LABELS,
} from '../RolloverLedger';
import { RolloverFiscalYearsView } from './RolloverFiscalYearsView';
import { RolloverLedgerBudgetsView } from './RolloverLedgerBudgetsView';
import { RolloverLedgerEncumbrancesView } from './RolloverLedgerEncumbrancesView';
import { LEDGER_ROLLOVER_SOURCE_MAP } from '../../RolloverLogs/constants';

export const RolloverLedgerView = () => {
  const accordionStatusRef = useRef();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { id: ledgerId, rolloverId } = useParams();

  const {
    isLoading: isRolloverLoading,
    rollover,
  } = useLedgerRollover(rolloverId);

  const {
    isLoading: isLedgerLoading,
    ledger,
  } = useLedger(ledgerId);

  const onClose = useCallback(() => {
    const backPathname = location.state?.backPathname || `${LEDGERS_ROUTE}/${ledgerId}/rollover-logs`;

    history.push(backPathname);
  }, [history, ledgerId, location.state?.backPathname]);

  const shortcuts = useMemo(() => ([
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onClose),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ]), [onClose]);

  const isLoading = isRolloverLoading || isLedgerLoading;

  if (isLoading) {
    return (
      <LoadingPane
        defaultWidth="fill"
        dismissible
        id="pane-ledger-rollover-form"
        onClose={onClose}
      />
    );
  }

  const paneLedgerName = `${ledger?.name} • ${formatDate(rollover?.metadata?.updatedDate, intl)}`;
  const paneSub = LEDGER_ROLLOVER_SOURCE_MAP[rollover?.rolloverType];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-ledger-rollover-form"
          onClose={onClose}
          paneTitle={(
            <FormattedMessage
              id="ui-finance.ledger.rollover.title"
              values={{ ledgerName: paneLedgerName }}
            />
          )}
          paneSub={paneSub}
        >
          <AccordionStatus ref={accordionStatusRef}>
            <Row>
              <Col
                xs={12}
                md={10}
                mdOffset={1}
              >
                <Row end="xs">
                  <Col xs={12}>
                    <ExpandAllButton />
                  </Col>
                </Row>

                <RolloverFiscalYearsView rollover={rollover} />
                <AccordionSet>
                  <Accordion
                    id={ROLLOVER_LEDGER_ACCORDION.budgets}
                    label={ROLLOVER_LEDGER_ACCORDION_LABELS.budgets}
                  >
                    <RolloverLedgerBudgetsView rollover={rollover} />
                  </Accordion>
                  <Accordion
                    id={ROLLOVER_LEDGER_ACCORDION.encumbrances}
                    label={ROLLOVER_LEDGER_ACCORDION_LABELS.encumbrances}
                  >
                    <RolloverLedgerEncumbrancesView rollover={rollover} />
                  </Accordion>
                </AccordionSet>
              </Col>
            </Row>
          </AccordionStatus>
        </Pane>
      </Paneset>
    </HasCommand>
  );
};
