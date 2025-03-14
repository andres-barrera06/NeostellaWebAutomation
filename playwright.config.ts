import { PlaywrightTestConfig } from '@playwright/test';
import * as envURLs from './enviroments.json';

const env = {
  dev: envURLs.enviroments.dev,
  prod: envURLs.enviroments.prod
};

export const config: PlaywrightTestConfig = {

  timeout: 420000, // Aumenta el tiempo límite a 60 segundos
  
  expect: {
    timeout: 420000,
  },

  /*
  ojects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    },
  ],
*/

  forbidOnly: !!process.env.CI,

  reporter: [['junit', { outputFile: 'reports/results-junit.xml', open: 'never'}], ['html', { outputFolder: 'reports/html/',open: 'never' }]],

  use: {
    baseURL: env[process.env.ENV],
    screenshot: 'on',
    acceptDownloads: true,
    trace: 'on',
    headless: true,
  },


  grep: [new RegExp(process.env.TAGS)],

  retries: 1,
  workers:1
};

export default config;
