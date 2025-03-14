import { test, devices } from "@playwright/test";
import * as testData from '../../test-data/common.json';
import Pagination from '../../services/pages/pagination.page';
import * as Env from "../../enviroments.json";
import PaginationSteps from '../../services/steps/pagination.steps';

test.describe("TS | Pagination", () => {
    const testState = { platform: "Desktop" };
    let pagination: Pagination;
    let paginationSteps: PaginationSteps;
  
    test.beforeEach(async ({ browser }, testInfo) => {
      console.log(`\n▶️  ${testInfo.title} starting:`);
      let context;
      if (testState.platform.match(/Desktop/i)) {
        context = await browser.newContext({
          viewport: devices[testData.device.desktop].viewport,
          deviceScaleFactor: devices[testData.device.desktop].deviceScaleFactor,
          userAgent: devices[testData.device.desktop].userAgent,
        });
      } else {
        context = await browser.newContext({
          viewport: devices[testData.device.mobile].viewport,
          deviceScaleFactor: devices[testData.device.mobile].deviceScaleFactor,
          userAgent: devices[testData.device.mobile].userAgent,
        });
      }
      const page = await context.newPage();
      await page.goto(`${Env.enviroments.prod}jobs`, {
        waitUntil: "networkidle",
      });
      pagination = new Pagination(page);
      paginationSteps = new PaginationSteps(page, pagination);
    });
  
    //..
    test("TC | Pagination in Desktop", async () => {
      await paginationSteps.nextPage();
      await paginationSteps.previousPage();
      testState.platform = "Mobile";
    });
    test("TC | Pagination in Mobile", async () => {
      await paginationSteps.nextPage();
      await paginationSteps.previousPage();
    });
  });
