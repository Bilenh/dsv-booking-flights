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
    // await this.page.waitForTimeout(500); // Small delay for UI to update

    // Wait for chip to be visible before clicking close button
    const chip = this.page.locator('[data-autocomplete-chip-idx="0"]');
    await expect(chip).toBeVisible();
    await chip.click();

    // Wait for chip to be removed
    await expect(chip).not.toBeVisible();

    // Fill the input field and wait for it to be ready
    const toField = this.page.locator('input[data-ui-name="input_text_autocomplete"]');
    await toField.waitFor({ state: 'visible' });
    await toField.fill(from);

    // Wait for dropdown with longer timeout
    await this.page.waitForSelector('#flights-searchbox_suggestions', { 
      state: 'visible', 
      timeout: 10000 
    });

    // Wait for any overlay to disappear (replace with actual selector if known)
    await this.page.waitForSelector('.overlay', { state: 'hidden', timeout: 10000 }).catch(() => {});

    // Find the first suggestion row (adjust selector as needed)
    const firstSuggestion = this.page.locator('#flights-searchbox_suggestions li[data-ui-name="locations_list_item"]').first();
    await expect(firstSuggestion).toBeVisible();
    await firstSuggestion.click();


    await this.page.locator('[data-ui-name="input_location_to_segment_0"]').click();

    const fromField = this.page.locator('input[data-ui-name="input_text_autocomplete"]');
    fromField.fill(to);
    // Wait for dropdown and select first checkbox
    const secondSuggestion = this.page.locator('#flights-searchbox_suggestions li[data-ui-name="locations_list_item"]').first();
    await expect(firstSuggestion).toBeVisible();
    await secondSuggestion.click();

  }

  async selectDepartureDate() {
    // Open the calendar
    const dateButton = this.page.locator('button[data-ui-name="button_date_segment_0"]');
    await expect(dateButton).toBeVisible({ timeout: 5000 });
    await dateButton.click();

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
    // Wait for either the results summary or the no-results message
    const resultsSummary = this.page.locator('[data-testid="search_filters_summary_results_number"]');
    const noResultsMessage = this.page.locator('text=We don\'t have any flights matching your search');

    await Promise.race([
      resultsSummary.waitFor({ state: 'visible', timeout: 10000 }),
      noResultsMessage.waitFor({ state: 'visible', timeout: 10000 })
    ]);

    if (await resultsSummary.isVisible()) {
      return await resultsSummary.innerText();
    } else if (await noResultsMessage.isVisible()) {
      return await noResultsMessage.innerText();
    } else {
      throw new Error('Neither results nor no-results message appeared.');
    }
  }
}