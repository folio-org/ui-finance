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

import { useFiscalYearOptions } from './useFiscalYearOptions';
import { useExportFund } from './useExportFund';
import css from './ExportFundSettings.css';

const ExportFundSettings = () => {
  const [fiscalYearCode, setFiscalYearCode] = useState();
  const [isExportLoading, setIsExportLoading] = useState(false);
  const { fiscalYearOptions, isLoading: isFYLoading } = useFiscalYearOptions();

  const { fetchExportFund } = useExportFund(fiscalYearCode);

  const onChangeFY = (e) => {
    setFiscalYearCode(e.target.value);
  };

  const onExportFund = useCallback(async () => {
    setIsExportLoading(true);

    await fetchExportFund(fiscalYearCode);

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
      footer={paneFooter}
    >
      <div className={css.helperText}>
        <FormattedMessage id="ui-finance.settings.exportFund.helperText" />
      </div>
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
