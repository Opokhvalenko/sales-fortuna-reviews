# sales-fortuna-reviews# Sales Fortuna - Customer Reviews Section

[DEMO LINK](https://Opokhvalenko.github.io/sales-fortuna-reviews/)

This repository contains the frontend development for an interactive "Customer Reviews" section for the Sales Fortuna website. The section features a responsive review carousel with navigation arrows and pagination, developed using modern web standards and methodologies.

[Link to the mockup](https://www.figma.com/design/i8U9prmitB9HfZ2YuzgYhl/Sales-Fortuna-Technical-task?node-id=0-1&p=f&t=EvIgz7HprhwneOIY-0)

## Features

- **Responsive Design:** Optimized for various screen sizes (desktop, tablet, mobile).
- **Interactive Carousel:** Smooth scrolling of reviews with navigation via arrows.
- **Dynamic Pagination:** Visual indicators for the current card in the carousel.
- **Sass/SCSS:** Utilization of the Sass preprocessor for organized and maintainable styles using variables, mixins, and nesting.
- **Developer-Friendly:** Clean, well-structured HTML and SCSS, easily scalable and maintainable.
- **Full-Width Background Image:** The section features a background image that spans the full width of the screen, while the content remains centered.

## Technologies

- **HTML5:** Content structure.
- **CSS3:** Core styling.
- **Sass (SCSS):** CSS preprocessor for modular and organized style code.
- **JavaScript:** Carousel functionality (scrolling, pagination).

## Installation

To run this project locally, you will need Node.js and npm (or Yarn).

1.  **Clone the repository:**

    ```bash
    git clone (https://github.com/Your_Username/sales-fortuna-reviews.git)
    cd sales-fortuna-reviews
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # Or, if you are using Yarn:
    # yarn install
    ```

    _Note: This will install Sass for compiling SCSS to CSS, among other dependencies._

3.  **Compile Sass:**
    If you make changes to SCSS files, you'll need to compile them to CSS. Typically, you'd use scripts in `package.json` for this. If you don't have them, you can add:

    In `package.json` under the `"scripts"` section:

    ```json
    "scripts": {
      "sass:compile": "sass src/scss/style.scss src/css/style.css",
      "sass:watch": "sass --watch src/scss/style.scss:src/css/style.css"
    }
    ```

    Then run:

    ```bash
    npm run sass:compile # Once to compile
    npm run sass:watch   # For automatic recompilation on SCSS changes
    ```

## Usage

Simply open the `index.html` file in your web browser.
The carousel functionality will be handled by `script.js`.

## Responsiveness

The carousel and its elements adapt to various screen sizes.

- **Desktop:** Displays 3 cards in a row.
- **Large Desktop:** Displays 2 cards in a row.
- **Medium Tablet:** Displays 1 card in a row.
- **Small Tablet / Mobile:** The carousel becomes vertical, arrows are positioned top/bottom, and cards take full width.

## License

This project is licensed under the MIT License.
