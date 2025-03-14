import { Locator, Page } from 'playwright';
import * as selectors from '../../selectors.json';

export default class Pagination {
    constructor(page: Page) {
        this.page = page;
    }

    private page: Page;

    /**
   *
   */
  public nextButton(): Locator {
    return this.page.locator('nav > a:nth-child(3)[href*="/jobs?"]');
  }
  /**
   *
   */
  public previousButton(): Locator {
    return this.page.locator(selectors.pagination.previousButton);
  }
}
