import React, { useState, useMemo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Label,
  Loading,
  LoadingPane,
  Pane,
  PaneFooter,
  Row,
  Select,
} from '@folio/stripes/components';
import { useShowCallout, usePaneFocus } from '@folio/stripes-acq-components';

import { useFiscalYearOptions } from './useFiscalYearOptions';
import { useExportFund } from './useExportFund';
import { exportCsvFunds } from './utils';
import css from './ExportFundSettings.css';

const ExportFundSettings = () => {
  const { paneTitleRef } = usePaneFocus();
  const showCallout = useShowCallout();
  const [fiscalYearCode, setFiscalYearCode] = useState();
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { fiscalYearOptions, isLoading: isFYLoading } = useFiscalYearOptions();

  const onChangeFY = (e) => {
    setFiscalYearCode(e.target.value);
  };

  const onError = () => showCallout({
    messageId: 'ui-finance.fund.actions.load.error',
    type: 'error',
  });

  const onSuccess = async (data) => {
    await exportCsvFunds(fiscalYearCode, data?.fundCodeVsExpClassesTypes);

    return showCallout({
      messageId: 'ui-finance.settings.exportFund.success',
      type: 'success',
    });
  };

  const { fetchExportFund } = useExportFund(fiscalYearCode, { onSuccess, onError });

  const onExportFund = useCallback(async () => {
    setIsExportLoading(true);

    await fetchExportFund(fiscalYearCode);

    setFiscalYearCode();

    setIsExportLoading(false);
  }, [fetchExportFund, fiscalYearCode]);

  const paneFooter = useMemo(() => {
    const end = (
      <Button
        buttonStyle="primary"
        onClick={onExportFund}
        disabled={!fiscalYearCode}
        data-testid="export-fund-button"
      >
        <FormattedMessage id="ui-finance.settings.button.export" />
      </Button>
    );

    return (
      <PaneFooter renderEnd={end} />
    );
  }, [fiscalYearCode, onExportFund]);

  if (isExportLoading) return <LoadingPane />;

  return (
    <Pane
      defaultWidth="fill"
      id="pane-export-fund-settings"
      paneTitle={<FormattedMessage id="ui-finance.settings.exportFund.title" />}
      paneTitleRef={paneTitleRef}
      footer={paneFooter}
    >
      <div className={css.helperText}>
        <FormattedMessage id="ui-finance.settings.exportFund.helperText" />
      </div>
      <Label>
        <FormattedMessage id="ui-finance.settings.exportFund.exportSettings" />
      </Label>
      <Row>
        <Col xs={3}>
          {!isFYLoading
            ? (
              <Select
                dataOptions={[{ label: '' }, ...fiscalYearOptions]}
                onChange={onChangeFY}
                label={<FormattedMessage id="ui-finance.fiscalyear" />}
                required
              />
            )
            : (
              <>
                <Label required><FormattedMessage id="ui-finance.fiscalyear" /></Label>
                <Loading />
              </>
            )}
        </Col>
      </Row>
    </Pane>
  );
};

export default ExportFundSettings;
