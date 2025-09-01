import { validateRequired } from '@folio/stripes-acq-components';

export const FORM_FIELDS_NAMES = {
  enabled: 'enabled',
  providerType: 'providerType',
  providerUri: 'providerUri',
  apiKey: 'apiKey',
  apiSecret: 'apiSecret',
};

export const EXCHANGE_RATE_PROVIDERS = {
  TREASURE: 'treasury.gov',
  CURRENCYAPI: 'currencyapi.com',
};

export const EXCHANGE_RATE_PROVIDERS_LABEL_IDS_MAPPING = {
  [EXCHANGE_RATE_PROVIDERS.TREASURE]: 'ui-finance.settings.exchangeRateSource.providerType.noKeyRequired',
  [EXCHANGE_RATE_PROVIDERS.CURRENCYAPI]: 'ui-finance.settings.exchangeRateSource.providerType.keyRequired',
};

export const EXCHANGE_RATE_FIELDS_CONFIG_PROPS_MAP = new Map([
  [EXCHANGE_RATE_PROVIDERS.TREASURE, new Map([
    [FORM_FIELDS_NAMES.apiKey, {
      required: false,
    }],
    [FORM_FIELDS_NAMES.apiSecret, {
      required: false,
    }],
  ])],
  [EXCHANGE_RATE_PROVIDERS.CURRENCYAPI, new Map([
    [FORM_FIELDS_NAMES.apiKey, {
      required: true,
      validate: validateRequired,
    }],
    [FORM_FIELDS_NAMES.apiSecret, {
      required: false,
    }],
  ])],
]);
