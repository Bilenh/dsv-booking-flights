## 📁 Exercise 2 – Flight Booking Automation with Playwright

**Project Folder**: `dsv-booking-flights`  
**Description**:  
A TypeScript-based Playwright test that:
- Selects two random cities.
- Chooses a random one-way date.
- Returns number of flight options.
- Supports HTML and Allure reporting.

### ✅ Prerequisites

- Node.js 18+
- [Playwright](https://playwright.dev/)
- Allure CLI

```bash
npm install
npx playwright install
npm install -g allure-commandline --save-dev
```

---

### 🚀 How to Run

**1. Run the Test**

```bash
npx playwright test
```

**2. View HTML Report**

```bash
npx playwright show-report
```

**3. Generate Allure Report**

```bash
allure serve allure-results 
OR
npx allure generate --clean ./allure-results && npx allure open
```

---
