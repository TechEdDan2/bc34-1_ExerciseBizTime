# bc34-1_ExerciseBizTime

- [Overview](#overview)
  - [Features](#features)
  - [Future Improvements](#future-improvements)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Setup Instructions](#setup-instructions)
  - [Continued development](#continued-development)
- [Routes](#routes)
- [Author](#author)
- [Acknowledgments](#acknowledgments)
- [License] (#license)

---
## Overview
This is a simple Express.js application that connects to a PostgreSQL database to manage companies and their invoices. It allows users to create, read, update, and delete companies and invoices, as well as manage the industries associated with each company (mostly).

### Features
- Create, read, update, and delete companies
- Create, read, update, and delete invoices
- Manage industries associated with companies
- Basic error handling and validation

### Future Improvements
- Add more detailed error handling
- create more tests for the industries and companies
- Create the user interface with a frontend framework

## Built With
- [Express.js](https://expressjs.com/) - The web framework used
- [PostgreSQL](https://www.postgresql.org/) - The database used
- [Node.js](https://nodejs.org/) - The runtime environment
- [Jest](https://jestjs.io/) - The testing framework used

## Getting Started
To get a local copy up and running follow these simple steps.

### Setup Instructions
1. Clone the repo
2. Install the dependencies by running `npm install`
3. Create a PostgreSQL databases
4. Run the SQL commands in `data.sql` to set up the database schema and initial data
5. Start the server `node --watch server.js`

### Continued development
- Continue to add features and improve the application
- Explore more advanced PostgreSQL features
- Implement a frontend to interact with the API

## Routes
- `GET /companies` - Get all companies
- `GET /companies/:code` - Get a specific company by code
- `POST /companies` - Create a new company
- `PUT /companies/:code` - Update a specific company by code
- `DELETE /companies/:code` - Delete a specific company by code
- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get a specific invoice by ID
- `POST /invoices` - Create a new invoice
- `PUT /invoices/:id` - Update a specific invoice by ID
- `DELETE /invoices/:id` - Delete a specific invoice by ID
- `GET /industries` - Get all industries
- `GET /industries/:code` - Get a specific industry by code
- `POST /industries` - Create a new industry
- `PUT /industries/:code` - Update a specific industry by code
- `DELETE /industries/:code` - Delete a specific industry by code

---

## Author
- Github - [TechEdDan2](https://github.com/TechEdDan2)
- Frontend Mentor - [@TechEdDan2](https://www.frontendmentor.io/profile/TechEdDan2)

## Acknowledgments
The YouTubers and other educational resources I have been learning from include: Coder Coder (Jessica Chan), BringYourOwnLaptop (Daniel Walter Scott), Kevin Powell, vairous Udemy courses, Geeks for Geeks, and Stony Brook University's Software Engineering Bootcamp (Colt Steele) 

## License
This project is licensed under the ISC license