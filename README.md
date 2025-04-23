# Goalbloom

## https://goalbloom.onrender.com/

Goalbloom is an educational budgeting app designed to help you understand, and take control of your finances! Users can input their income, track expenses, set savings goals, and create detailed budget plans. As they interact with the app, users will receive recommendations for articles to help them reach their financial goals.
While the app is most useful for those new to budgeting, its features and resources are valuable for anyone looking to enhance their financial literacy and make informed financial decisions!

## Frontend
   * Uses React.js to create UI for managing budgets and tracking finances.
   * Implememts Highcharts for dynamic graphs and charts
   * Uses React Router for navigation through the app
   * Uses AJAX for article requests
### Languages 
   * Javascript
   * HTML
   * CSS


## Backend
   * Uses Flask to handle API requests, authentication, and user data.
   * Uses Flask-Login for user authentication
   * Uses Flask Migrate for database and schema changes
   * Uses JSON web tokens for API
### Languages
   * Python

   ![](https://github.com/JuliaTDunc/Goalbloom/ReadMeGifs/ViewTransactions.gif)

## Getting started

1. Clone this repository (only this branch).

2. Install dependencies.

   ```bash
   pipenv install -r requirements.txt
   ```

3. Initialize the Backend server

   ```bash
     flask run
   ```
4. Initialize the Frontend server

     ```bash
       cd react-vite npm run dev
     ```

