import { test, expect } from '@playwright/test';
import { FlightsPage } from '../pages/FlightsPage';

test('Search one-way flights and verify results', async ({ page }) => {
  const flightsPage = new FlightsPage(page);

  await test.step('Navigate to flights page', async () => {
    await flightsPage.navigate();
  });

  await test.step('Select one-way trip', async () => {
    await flightsPage.selectOneWayTrip();
  });

  const cities = ['New York', 'London', 'Berlin', 'Tokyo', 'Paris'];
  const from = cities[Math.floor(Math.random() * cities.length)];

  let to = from;

  while (to === from) {
    to = cities[Math.floor(Math.random() * cities.length)];
  };

  await test.step(`Set from city: ${from} and to city: ${to}`, async () => {
    await flightsPage.setFromAndToCities(from, to);
  });

  await test.step('Select departure date', async () => {
    await flightsPage.selectDepartureDate();
  });

  await test.step('Click search', async () => {
    await flightsPage.clickSearch();
  });

  await test.step('Verify flight summary is displayed', async () => {
    const flightCount = await flightsPage.getFlightSummary();

    if (
      flightCount.includes("We don't have any flights matching your search") ||
      flightCount.includes("Try changing some details")
    ) {
      console.log(`❌ No flights found from ${from} to ${to}.`);
      // Optionally, you can skip or soft-fail the test here:
      // test.skip('No flights available for this route');
    } else {
      expect(flightCount).not.toBe('');
      console.log(`✅ Flights found from ${from} to ${to}: ${flightCount}`);
    }
  });
});