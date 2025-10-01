module.exports = { 
  okapi: {
    // application gateway
    'url': 'https://ecs-folio-etesting-snapshot-kong.ci.folio.org',
    'uiUrl': 'http://localhost:3000',

    // authentication details: url, secret, clientId
    'authnUrl': 'https://folio-etesting-snapshot-keycloak.ci.folio.org',
  },
  config: {
    isEureka: true,
    hasAllPerms: false,
    logCategories: 'core,path,action,xhr,session,rtr',
    logPrefix: '--',
    maxUnpagedResourceCount: 2000,
    showPerms: false,
    aboutInstallVersion: "Ramsons",
    aboutInstallDate: "2024-03-12",
    aboutInstallMessage: "built from eureka-ci",
    idleSessionWarningSeconds: 600,
    isSingleTenant: false,
    suppressIntlErrors: true,
    suppressIntlWarnings: true,
    disableStrictMode: true,
    tenantOptions: {
      consortium: { name: 'consortium', clientId: 'consortium-application' },
    },
    useSecureTokens: true,
    rtr: {
      // how long before an idle session is killed? default: 60m 
      // must be a string parseable by ms, e.g. 60s, 10m, 1h
      idleSessionTTL: '1h',

      // how long to show the "warning, session is idle" modal? default: 1m
      // must be a string parseable by ms, e.g. 60s, 10m, 1h
      idleModalTTL: '1h',

      // which events constitute "activity" that prolongs a session?
      // default: keydown, mousedown
      activityEvents: ['keydown', 'mousedown', 'wheel', 'touchstart', 'scroll'],
    }
  },
  modules:{
    '@folio/finance': {},
  },
};
