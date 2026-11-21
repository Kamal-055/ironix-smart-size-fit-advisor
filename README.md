# IRONIX | Smart Size & Fit Advisor

<p align="center">
  <img src="https://img.shields.io/badge/IRONIX-Technical%20Assessment-111111?style=for-the-badge" alt="IRONIX Assessment">
  <img src="https://img.shields.io/badge/HTML5-Frontend-orange?style=for-the-badge&logo=html5" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript" alt="JavaScript">
</p>

<p align="center">
  <strong>An interactive, measurement-based sizing assistant for apparel e-commerce.</strong>
</p>

<p align="center">
  <a href="https://inronix-task2.netlify.app">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Visit_Application-111111?style=for-the-badge" alt="Live Demo">
  </a>
</p>

---

## Live Demo

**Try the application:** https://inronix-task2.netlify.app

The prototype demonstrates how customers can enter their body measurements, select their preferred fit, receive a size recommendation, check sample product availability and interact with a simulated shopping cart.

---

## Project Overview

The **IRONIX Smart Size & Fit Advisor** is a standalone frontend prototype developed for Task 2 – Custom Shopify Functionality of the IRONIX Web Development Technical Assessment.

Choosing the correct apparel size online can be challenging because customers cannot physically try on products before purchasing them.

Traditional size charts provide measurement ranges, but customers may still struggle to interpret them, especially when their measurements fall between available sizes.

This project introduces an interactive sizing assistant that helps customers make more informed size selections through measurement validation, fit preferences, size recommendations and availability information.

> This is an independent technical assessment prototype. It is not connected to the live IRONIX Shopify store.

---


## Key Features

### 1. Smart Size Recommendation
- Enter chest measurement and height.
- Switch between inches and centimetres.
- Select a preferred fit: Snug, Regular or Relaxed.
- Receive a size suggestion based on configured sizing rules.
- View alternative size suggestions where applicable.
- See confidence labels and sizing explanations.

### 2. Measurement Validation
- Empty input validation.
- Non-numeric input validation.
- Unrealistic measurement rejection.
- Configured measurement limits.
- Fit preference validation.
- Out-of-chart measurement handling.

### 3. Product Colour Selection
Explore four sample product colours:
- Black
- White
- Green
- Maroon

The product interface updates according to the selected colour.

### 4. Sample Inventory Availability
- In-stock size indicators.
- Low-stock notifications.
- Sold-out size handling.
- Alternative size availability.
- Back-in-stock email form validation.

**Note:** Inventory quantities are sample data created for demonstration. They do not represent actual IRONIX stock.

### 5. Interactive Shopping Cart
- Add recommended sizes to the cart.
- Remove cart items.
- View item quantities.
- Calculate the subtotal.
- Prevent adding quantities beyond configured sample stock.
- Close the cart using the Escape key.

The cart is simulated. Checkout and payment functionality are not connected.

### 6. Responsive Interface
- Dark IRONIX-inspired visual design.
- Responsive product layout.
- Mobile-friendly measurement form.
- Interactive size chart.
- Form validation messages.
- Keyboard interaction support.

---

## User Journey

```text
       Product Page
            |
            v
      Select Colour
            |
            v
   Enter Chest Measurement
            |
            v
      Enter Height
            |
            v
    Select Preferred Fit
            |
            v
    Validate Measurements
            |
            v
     Calculate Size
            |
            v
   Check Sample Inventory
            |
            v
   Display Recommendation
            |
            v
       Add to Cart
```

---

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive layout |
| JavaScript ES6 | Application logic and interactions |
| Node.js | JavaScript unit testing |
| Playwright | Browser automation and end-to-end testing |
| Python | Running browser test scripts |
| Git | Version control |
| GitHub | Source code management |
| Netlify | Prototype hosting |

The application uses vanilla JavaScript without a frontend framework or backend server.

---

## Project Structure

```text
ironix-smart-size-fit-advisor/
│
├── prototype/
│   ├── css/
│   │   └── styles.css
│   │
│   ├── data/
│   │   └── products.js
│   │
│   ├── js/
│   │   ├── app.js
│   │   └── size-engine.js
│   │
│   ├── tests/
│   │   ├── e2e.py
│   │   └── size-engine.test.js
│   │
│   └── index.html
│
└── README.md
```

---

## How the Recommendation Engine Works

The sizing logic is implemented in:

`prototype/js/size-engine.js`

The engine is separated from the user interface and uses reusable JavaScript functions for validation, measurement conversion, recommendation generation and stock checking.

### Measurement Inputs

The advisor accepts:

- Chest measurement.
- Height.
- Measurement unit.
- Preferred fit.

### Measurement Conversion

Centimetre measurements are converted into inches using:

```javascript
inches = centimetres / 2.54;
```

### Configured Size Chart

| Size | Chest Range (inches) | Back Length (inches) |
|---|---:|---:|
| S | 36–38 | 26 |
| M | 38–40 | 27 |
| L | 40–42 | 28 |
| XL | 42–44 | 28 |

**Sizing assumption:** The published IRONIX product chart lists XL as 40–44 inches, overlapping the L range of 40–42 inches. To make the prototype's sizing engine operate with non-overlapping ranges, XL is configured as 42–44 inches. This adjustment is an assumption and requires confirmation from IRONIX.

### Fit Preference Logic

| Fit preference | Configured ease allowance |
|---|---:|
| Snug | 0 inches |
| Regular | 1 inch |
| Relaxed | 2 inches |

These values are prototype assumptions, not verified IRONIX garment-fitting specifications.

### Recommendation Handling

The engine handles:

- Clear size matches.
- Measurements at size boundaries.
- Measurements close to a size boundary.
- Measurements below the configured chart.
- Measurements above the configured chart.
- Measurements outside the supported recommendation range.
- Height-based length notes.
- Stock availability and alternative sizes.

---

## Installation and Local Setup

### Prerequisites

- Node.js
- npm
- Python 3 (for browser tests)
- Git
- Visual Studio Code or another code editor

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/ironix-smart-size-fit-advisor.git
```

### 2. Navigate to the Project

If the files are inside the `prototype` directory:

```bash
cd ironix-smart-size-fit-advisor/prototype
```

### 3. Run the Application

This is a static HTML, CSS and JavaScript application. No npm installation or build process is required.

Start a local server:

```bash
python -m http.server 8000
```

Open the application:

```text
http://localhost:8000
```

Alternatively, open `index.html` directly in a browser.

---

## Testing

The project includes unit tests and browser-based end-to-end tests.

### Unit Tests

The recommendation engine uses Node.js's built-in test runner.

Run:

```bash
node --test tests/size-engine.test.js
```

The unit tests cover:

- Input validation.
- Invalid and negative measurements.
- Size matching.
- Fit preference adjustments.
- Boundary handling.
- Alternative size suggestions.
- Measurements outside the chart.
- Centimetre-to-inch conversion.
- Height-based notes.
- Stock availability.

### End-to-End Tests

The browser tests use Python and Playwright.

Install Playwright:

```bash
pip install playwright
```

Install Chromium:

```bash
playwright install chromium
```

Run the browser tests:

```bash
python tests/e2e.py
```

The browser tests cover:

- Empty form validation.
- Invalid measurement handling.
- Size recommendation flow.
- Boundary and alternative size cases.
- Sold-out size handling.
- Back-in-stock email validation.
- Cart functionality.
- Sample inventory limits.
- Escape-key interaction.
- Mobile responsiveness.
- Browser console and page errors.

The test script saves screenshots in:

```text
../docs/screenshots/prototype/
```

Run the browser tests in an environment where Chromium can launch successfully.

---

## Shopify Integration Approach

The current application is a standalone frontend prototype and does not connect to or modify the live IRONIX Shopify store.

A production version could be integrated into a Shopify product page through a theme app extension or an appropriately developed theme section.

### Proposed Integration Flow

1. Add the advisor interface to the relevant Shopify product page.
2. Retrieve verified product-specific size information.
3. Pass sizing data to the recommendation engine.
4. Display size recommendations and explanations.
5. Connect the customer's size selection to the existing Shopify variant selector.
6. Check actual variant availability before adding the product to the Shopify cart.

### Production Requirements

- Verified garment measurement and sizing information.
- Shopify product and variant integration.
- Live inventory availability.
- Appropriate customer-facing error handling.
- Cross-device and browser testing.

These integrations are outside the scope of the current prototype.

---

## Second Proposed Feature

### Self-Service Order Change Request

The second functionality considered for the assessment is a self-service order change request interface.

The proposed feature could allow customers to:

- Enter an order reference.
- Check request eligibility.
- Submit an eligible size modification request.
- Request cancellation where permitted.
- Receive request confirmation.

This feature is a proposal only and is not implemented in this repository.

A real implementation would require secure order verification and backend integration with Shopify.

---

## Limitations and Assumptions

| Area | Current limitation |
|---|---|
| Size chart | XL is configured as 42–44 inches as a prototype assumption |
| Fit allowance | Ease values are assumed and require brand validation |
| Product inventory | Uses invented sample quantities |
| Product data | Uses sample product information |
| Shopping cart | Frontend simulation only |
| Checkout | Not connected |
| Back-in-stock form | Validates the email but does not send notifications |
| Shopify | No live store integration |
| Customer data | No customer accounts or personal data storage |

The prototype does not claim measured improvements in conversion rates, customer satisfaction or return reduction. Such outcomes would require real-world testing and store analytics.

---

## Future Enhancements

- Verified product-specific sizing rules.
- Shopify product variant integration.
- Real-time inventory checks.
- Functional back-in-stock notifications.
- Secure Shopify cart integration.
- Additional product measurement inputs.
- Analytics for advisor usage and purchase outcomes.
- Accessibility and usability improvements.

---

## References

The following public IRONIX pages were used as references:

- [IRONIX Rib Tank – Black](https://ironix.in/products/ironix-rib-tank-black)
- [IRONIX FAQ](https://ironix.in/pages/faqs)
- [IRONIX Refund Policy](https://ironix.in/policies/refund-policy)
- [IRONIX Terms of Service](https://ironix.in/policies/terms-of-service)

---

## Assessment Information

| Detail | Information |
|---|---|
| Assessment | IRONIX Web Development Technical Assessment |
| Task | Task 2 – Custom Shopify Functionality |
| Selected Feature | Smart Size & Fit Advisor |
| Implementation | Standalone interactive frontend prototype |
| Hosting | Netlify |
| Live Demo | https://inronix-task2.netlify.app |

---
## AI Assistance Disclosure

AI tools were used as development assistance during
planning, code review, documentation preparation,
and troubleshooting.

The implementation, testing, and technical decisions
should be reviewed and understood by the author.

## Developed By

**Kamala Kannan**

*IRONIX Web Development Technical Assessment*

<p align="center">
  <strong>IRONIX Smart Size & Fit Advisor</strong><br>
  Making online size selection more informed and transparent.
</p>

<p align="center">
  <em>Independent technical assessment prototype — not an official IRONIX product or live Shopify integration.</em>
</p>
