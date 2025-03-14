import { Reporter } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export class CustomHTMLReporter extends Re {
  private failedTests: any[] = [];

  async onTestEnd(test, result) {
    super.onTestEnd(test, result);

    if (result.status === 'failed') {
      this.failedTests.push(test);
    }
  }

  async onEnd() {
    const htmlOutput = await super.generateHTMLReport();

    // Filter out all tests except for the failed tests
    const failedHtml = htmlOutput.replace(
      /(<div class="test-container"[^>]*>[\s\S]*?<\/div>)/g,
      (match, group) => {
        const testId = /data-test-id="(.+?)"/.exec(match)[1];
        const isFailed = this.failedTests.some((test) => test._id === testId);

        return isFailed ? match : '';
      },
    );

    // Write the filtered HTML output to a file
    const outputPath = path.join(process.cwd(), 'reports', 'html', 'failed-tests.html');
    fs.writeFileSync(outputPath, failedHtml, { encoding: 'utf-8' });
  }
}
