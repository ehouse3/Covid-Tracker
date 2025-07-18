# Covid-Tracker-Dashboard

## About

A Covid Dashboard for graphically displaying historical covid-19 data, made by Euan House 2025. It utilizes data from the COVID Tracking Project, filters by state, and displays a line chart as well as rolling average for data. 

## Features

- Add, remove States
- Re-arrange displayed States 
- Data cleaning
- Null metrics checking
- Graphically display selected data in linechart
- Rolling 7 day average of data

## Structure

- covid-dashboard/
  - app/
    - page.tsx - main dashboard logic
    - components.tsx - dashboard components (StateItem, Dropdown, Button, etc.)
    - global.css - styling and color variables
  - public/
    - data/
      - all-states-history.csv - original COVID Tracking Project data
  - parser.ts - cleans CSV data and passes it to page.tsx

## Running

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Frameworks, Libraries, Packages

- Next.js
- React
- Typescript
- Tailwind
- MUI
- Papaparse
- twMerge