# Smart Expense Tracker

A responsive personal-finance dashboard built with **HTML, CSS, and vanilla JavaScript**.

## Features

- Add income and expense transactions
- Categorize transactions (Food, Transport, Education, Shopping, Bills, and more)
- Calculate total income, total expenses, and current balance
- Search and filter transaction history
- View a category-wise spending chart
- Delete individual transactions or clear all saved records
- Export transaction history to CSV
- Persist records in browser `localStorage`
- Responsive UI for phones and desktops

## Run locally

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Add income and expense transactions to try the dashboard.

No framework, server, or external dependency is required.

## Project structure

```text
smart-expense-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Upload to GitHub

Create a repository named `smart-expense-tracker`, then upload these files to its root. Or use Git from this folder:

```bash
git init
git add .
git commit -m "Build smart expense tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/smart-expense-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Privacy note

This demo saves transactions only in the current browser's local storage. It does not send data to a server. Avoid entering sensitive financial details on a shared device.

## Possible future improvements

- Monthly budget limits and alerts
- Monthly spending comparisons
- Downloadable PDF report
- Login and database support
