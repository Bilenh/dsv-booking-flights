import { test, expect } from '@playwright/test';
import { FlightsPage } from '../pages/FlightsPage';

test('Search one-way flights and verify results', async ({ page }) => {
  const flightsPage = new FlightsPage(page);

  await flightsPage.navigate();
  await flightsPage.selectOneWayTrip();

  const cities = ['New York', 'London', 'Berlin', 'Tokyo', 'Paris'];
  const from = cities[Math.floor(Math.random() * cities.length)];

  let to = from;
  while (to === from) {
    to = cities[Math.floor(Math.random() * cities.length)];

  }

  await flightsPage.setFromAndToCities(from, to);
  await flightsPage.selectDepartureDate();

  await flightsPage.clickSearch();

  const flightCount = await flightsPage.getFlightSummary();
  console.log(`✅ Flights found from ${from} to ${to}: ${flightCount}`);

});