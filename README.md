# IRONIX | Smart Size & Fit Advisor

<p align="center">
  <strong>An interactive sizing assistant prototype for apparel e-commerce</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Project-Technical%20Assessment-111111?style=for-the-badge" alt="Technical Assessment">
  <img src="https://img.shields.io/badge/HTML5-Frontend-orange?style=for-the-badge&logo=html5" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-Styling-blue?style=for-the-badge&logo=css3" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript" alt="JavaScript">
</p>

<p align="center">
  <em>Helping customers make more informed apparel sizing decisions through an interactive measurement-based experience.</em>
</p>

---

## Project Overview

The **IRONIX Smart Size & Fit Advisor** is a standalone frontend prototype developed as part of the IRONIX Web Development Technical Assessment.

Choosing the correct clothing size online can be challenging because customers cannot physically try on products before purchasing them.

Traditional size charts provide measurements, but customers may still struggle to interpret them, particularly when their measurements fall between available size ranges.

This project introduces an interactive sizing assistant that uses customer measurements and fit preferences to provide size suggestions, explain sizing uncertainty, and display product availability using sample inventory data.

> **Note:** This is an independent assessment prototype. It is not connected to the live IRONIX Shopify store.

---


## Key Features

### 1. Smart Size Recommendation

- Enter chest measurement and height.
- Switch between inches and centimetres.
- Select a preferred fit:
  - Snug
  - Regular
  - Relaxed
- Receive a size suggestion based on configured measurement rules.
- View alternative size suggestions when applicable.
- See confidence labels and sizing explanations.

### 2. Measurement Validation

The application validates customer inputs before generating a recommendation.

- Empty input validation.
- Non-numeric input validation.
- Negative measurement rejection.
- Configured minimum and maximum measurement checks.
- Fit preference validation.
- Out-of-chart measurement handling.

### 3. Product Colour Selection

Customers can switch between sample product colours:

- Black
- White
- Green
- Maroon

The product interface updates based on the selected colour.

### 4. Sample Inventory Availability

The prototype demonstrates:

- In-stock sizes.
- Low-stock notifications.
- Sold-out size handling.
- Alternative size availability.
- Back-in-stock notification form validation.

**Inventory disclaimer:** Stock quantities are invented sample data for demonstration purposes. They do not represent actual IRONIX inventory.

### 5. Interactive Shopping Cart

- Add a recommended size to the cart.
- Remove items.
- View item quantities.
- Calculate subtotal.
- Prevent adding quantities beyond the configured sample stock.
- Close the cart using the Escape key.

The cart is simulated. Checkout and payment functionality are not connected.

### 6. Responsive User Interface

- Dark IRONIX-inspired visual design.
- Responsive product layout.
- Mobile-friendly measurement form.
- Interactive size chart.
- Accessible labels and validation messages.
- Keyboard interaction support.

---

## Application Preview

The prototype demonstrates the following user journey:

```text
Open Product Page
       |
       v
Select Product Colour
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
Calculate Size Suggestion
       |
       v
Check Sample Stock
       |
       v
Display Recommendation
       |
       v
Add Available Size to Cart
```

---

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Layout, styling and responsiveness |
| JavaScript (ES6) | Application logic and interactions |
| Node.js | JavaScript unit testing |
| Playwright | Browser automation and end-to-end testing |
| Python | Running browser test scripts |
| Git | Version control |
| GitHub | Source code management |

The application uses vanilla JavaScript without a frontend framework or backend server.

---

## Project Structure

```text
ironix-smart-size-fit-advisor/
│
├── css/
│   └── styles.css
│
├── data/
│   └── products.js
│
├── js/
│   ├── app.js
│   └── size-engine.js
│
├── tests/
│   ├── e2e.py
│   └── size-engine.test.js
│
├── index.html
└── README.md
```

### File Responsibilities

| File | Description |
|---|---|
| `index.html` | Main product page and application structure |
| `css/styles.css` | Visual design and responsive styling |
| `data/products.js` | Sample product, colour, price and inventory data |
| `js/app.js` | UI interactions, product rendering and cart functionality |
| `js/size-engine.js` | Measurement validation and size recommendation logic |
| `tests/size-engine.test.js` | Automated unit tests |
| `tests/e2e.py` | Browser-based end-to-end tests |
| `README.md` | Project documentation |

---

## How the Recommendation Engine Works

The recommendation engine is implemented in `js/size-engine.js`.

It is designed as a set of reusable JavaScript functions, separate from the user interface.

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

The prototype uses the following sizing configuration:

| Size | Chest Range (inches) | Back Length (inches) |
|---|---:|---:|
| S | 36–38 | 26 |
| M | 38–40 | 27 |
| L | 40–42 | 28 |
| XL | 42–44 | 28 |

**Sizing assumption:** The live IRONIX size guide lists XL as 40–44 inches, which overlaps the L range of 40–42 inches. For the prototype's recommendation engine, XL is configured as 42–44 inches to create non-overlapping ranges. This adjustment is an implementation assumption and requires confirmation from IRONIX.

### Fit Preference Logic

The current prototype applies the following ease allowances:

| Fit preference | Configured ease |
|---|---:|
| Snug | 0 inches |
| Regular | 1 inch |
| Relaxed | 2 inches |

These are prototype assumptions, not verified IRONIX garment-fitting specifications.

### Recommendation Status

The engine can return different recommendation states:

| Status | Meaning |
|---|---|
| Match | Measurement falls within a configured size range |
| Between | Measurement is at a shared size boundary |
| Below chart | Measurement is below the configured size range |
| Above chart | Measurement is above the configured size range |
| Out of range | Measurement is outside the supported recommendation range |

The engine also provides confidence labels and optional alternative sizes.

---

## Getting Started

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- A code editor such as Visual Studio Code

Python is additionally required for the Playwright browser tests.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/ironix-smart-size-fit-advisor.git
```

### 2. Navigate to the Project

```bash
cd ironix-smart-size-fit-advisor
```

If your source files are inside a folder named `prototype`, navigate into that folder before running the application:

```bash
cd prototype
```

### 3. Run the Application

This is a static HTML application. No npm installation or build process is required.

You can open `index.html` directly in your browser.

Alternatively, run a local development server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

## Testing

Testing is included to validate the recommendation engine and the main browser interactions.

### Unit Testing

The recommendation engine uses Node.js's built-in test runner.

Run:

```bash
node --test tests/size-engine.test.js
```

The test suite covers:

- Empty and invalid measurements.
- Non-numeric and negative input.
- Valid size matching.
- Fit preference adjustments.
- Size boundary handling.
- Alternative size suggestions.
- Measurements outside the chart.
- Centimetre-to-inch conversion.
- Height-based notes.
- Sample stock availability.

### End-to-End Testing

The browser tests use Python and Playwright.

Install Playwright:

```bash
pip install playwright
```

Install Chromium:

```bash
playwright install chromium
```

Run the test:

```bash
python tests/e2e.py
```

The browser tests cover:

- Form validation.
- Size recommendation flow.
- Alternative size availability.
- Sold-out product handling.
- Email input validation.
- Cart functionality.
- Sample inventory limits.
- Keyboard interaction.
- Mobile responsiveness.
- Browser console and page errors.

The browser test script saves screenshots under:

```text
../docs/screenshots/prototype/
```

Run the tests in an environment where Chromium can launch successfully.

---

## Shopify Integration Approach

The current application is a standalone frontend prototype and does not connect to the live IRONIX Shopify store.

A production implementation could be integrated into a Shopify product page through a theme app extension or an appropriately developed theme section.

### Proposed Integration Flow

1. Add the advisor interface to the relevant Shopify product page.
2. Retrieve verified product-specific size information.
3. Pass the sizing data to the recommendation engine.
4. Display suggested sizes and relevant explanations.
5. Connect the customer's size selection to the existing Shopify variant selector.
6. Validate variant availability before adding the product to the Shopify cart.

### Production Requirements

A production version would require:

- Verified sizing and garment measurement data.
- Shopify product and variant integration.
- Live inventory availability.
- Appropriate customer-facing error handling.
- Testing across supported devices and browsers.

These integrations are outside the scope of the current prototype.

---

## Second Proposed Feature

### Self-Service Order Change Request

Another functionality considered during the assessment is a self-service order change request interface.

The proposed feature would allow customers to submit eligible size modification or cancellation requests within the applicable order policy window.

Potential functionality:

- Order reference input.
- Order eligibility checks.
- Size modification request.
- Cancellation request.
- Request confirmation.

This feature is a proposal only and is not implemented in this repository.

A real implementation would require secure order verification and backend integration with Shopify.

---

## Limitations and Assumptions

This prototype is intended to demonstrate functionality, not a complete production e-commerce system.

| Area | Current limitation |
|---|---|
| Size chart | XL range is adjusted to 42–44 inches as a prototype assumption |
| Fit allowance | Ease values are assumed and require brand validation |
| Product inventory | Uses invented sample quantities |
| Product data | Uses sample product information |
| Shopping cart | Frontend simulation only |
| Checkout | Not connected |
| Back-in-stock form | Validates input but does not send an email |
| Shopify | No live store integration |
| Customer data | No customer accounts or personal data storage |

The prototype does not claim measured improvements in conversion rates, customer satisfaction, or return reduction. Such outcomes would require real-world testing and store analytics.

---

## Future Enhancements

Potential improvements include:

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

The following public IRONIX pages were used as references during the assessment:

- [IRONIX Rib Tank – Black](https://ironix.in/products/ironix-rib-tank-black)
- [IRONIX FAQ](https://ironix.in/pages/faqs)
- [IRONIX Refund Policy](https://ironix.in/policies/refund-policy)
- [IRONIX Terms of Service](https://ironix.in/policies/terms-of-service)

---

## Assessment Information

**Assessment:** IRONIX Web Development Technical Assessment  
**Task:** Task 2 – Custom Shopify Functionality  
**Selected Feature:** Smart Size & Fit Advisor  
**Implementation:** Standalone interactive frontend prototype

### Developed By

**Kamala Kannan**

---

<p align="center">
  <strong>IRONIX Smart Size & Fit Advisor</strong><br>
  <em>Making online size selection more informed and transparent.</em>
</p>

<p align="center">
  Built as an independent technical assessment prototype.
</p>
