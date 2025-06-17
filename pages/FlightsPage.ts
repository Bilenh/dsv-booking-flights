import { Page, expect } from '@playwright/test';

export class FlightsPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://www.booking.com/flights');
  }

  async selectOneWayTrip() {
    await this.page.locator('#search_type_option_ONEWAY').click();
  }

  async setFromAndToCities(from: string, to: string) {
    
    // Click the location input and wait for it to be ready
    await this.page.locator('[data-ui-name="input_location_from_segment_0"]').click();
    await this.page.waitForTimeout(500); // Small delay for UI to update

    // Wait for chip to be visible before clicking close button
    const chip = this.page.locator('span.Chip-module__trigger___KspJN');
    await expect(chip).toBeVisible();
    await chip.click();

    // Wait for chip to be removed
    await this.page.waitForTimeout(300);

    // Fill the input field and wait for it to be ready
    const toField = this.page.locator('input[data-ui-name="input_text_autocomplete"]');
    await toField.waitFor({ state: 'visible' });
    await toField.fill(from);

    // Wait for dropdown with longer timeout
    await this.page.waitForSelector('#flights-searchbox_suggestions', { 
      state: 'visible', 
      timeout: 10000 
    });

    // Wait for checkbox to be available and check it
    const firstCheckbox = this.page.locator('#flights-searchbox_suggestions input[type="checkbox"]').first();
    await firstCheckbox.waitFor({ state: 'visible' });
    await firstCheckbox.click();


    await this.page.locator('[data-ui-name="input_location_to_segment_0"]').click();

    const fromField = this.page.locator('input[data-ui-name="input_text_autocomplete"]');
    fromField.fill(to);
    // Wait for dropdown and select first checkbox
    await this.page.waitForSelector('#flights-searchbox_suggestions', { state: 'visible' });
    const secondCheckbox = this.page.locator('#flights-searchbox_suggestions input[type="checkbox"]').first();
    await secondCheckbox.check();

  }

  async selectDepartureDate() {
    // Open the calendar
    await this.page.getByPlaceholder('Choose departure date').click();

    // Wait for the calendar to be visible
    await this.page.waitForSelector('[data-ui-name="calendar_body"]');

    // Get all clickable dates (usually non-disabled buttons or divs with role)
    const dates = await this.page.$$('[data-ui-name="calendar_body"] [role^="gridcell"]:not([aria-disabled="true"])');

    // Choose a random index
    const randomIndex = Math.floor(Math.random() * dates.length);

    // Click the random date
    await dates[randomIndex].click();

   // console.log(`Selected random departure date.`);
  }

  async clickSearch() {
    const searchButton = this.page.locator('button[data-ui-name="button_search_submit"]');
    await searchButton.click();
    //console.log(`Clicked Search Button`);
  }

  async getFlightSummary(): Promise<string> {

    const resultsSummary = this.page.locator('xpath=/html/body/div[1]/div[2]/main/div/div/div[2]/div/div/div/div/div[1]/div/div[2]/div/div[2]');
    await expect(resultsSummary).toBeVisible({ timeout: 10000 });
    return this.page.locator('xpath=/html/body/div[1]/div[2]/main/div/div/div[2]/div/div/div/div/div[1]/div/div[2]/div/div[2]').innerText();
  }
}