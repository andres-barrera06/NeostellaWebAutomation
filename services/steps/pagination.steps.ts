import { Page } from 'playwright';
const { test, expect } = require("@playwright/test");
import Pagination from '../pages/pagination.page';
import * as commonData from '../../test-data/common.json'
import * as selectors from '../../selectors.json'

export default class PaginationSteps {
    constructor(page: Page, pagination: Pagination) {
        this.page = page;
        this.pagination = pagination;
    }

    private page: Page;
    private pagination: Pagination;

    /**
   *
   */
  async nextPage() {
    await test.step("Click on next page", async () => {
      await this.page.waitForSelector(selectors.pagination.nextButton);
      await this.pagination.nextButton().click();
      const nextUrl = await this.page.url();
      await expect(nextUrl).toContain("p=2");
      await this.page.waitForLoadState("load");
    });
  }
  /**
   *
   */
  async previousPage() {
    await test.step("Click on previous page", async () => {
      await this.page.waitForSelector(selectors.pagination.previousButton);
      await this.pagination.previousButton().click();
      const nextUrl = await this.page.url();
      await expect(nextUrl).not.toContain("p=");
      await this.page.waitForLoadState("load");
    });
  }


}
