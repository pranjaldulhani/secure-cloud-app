# Secure Cloud App

A simple web application that demonstrates security and compliance best practices in a cloud environment.

## Security Features

1. **Input validation and sanitization**: express-validator checks the name and email fields and escapes dangerous characters.
2. **Prepared statements**: SQL queries use `?` placeholders, which prevents SQL injection.
3. **XSS protection**: input is escaped on the server, output is displayed with `textContent`, and a Content Security Policy is applied.
4. **HTTPS**: in production, HTTP requests are redirected to HTTPS.
5. **Security headers and monitoring**: helmet sets secure HTTP headers, morgan logs every request, and express-rate-limit limits repeated requests.

## Tech Stack

- Node.js
- Express
- SQLite (better-sqlite3)
- helmet
- express-validator
- morgan
- express-rate-limit

## Project Structure

```
secure-cloud-app/
├── public/
│   ├── index.html
│   └── app.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## How to Run

1. Install dependencies:

```
npm install
```

2. Start the server:

```
npm start
```

3. Open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| GET    | /api/users   | Get all saved users                  |
| POST   | /api/users   | Save a new user

## Testing

- Normal input (name and email) is saved successfully.
- `<script>alert(1)</script>` as the name is escaped and shown as plain text, so no script runs (XSS protection).
- `' OR 1=1 --` as the email is rejected with a 400 error (input validation and SQL injection protection).
- Security headers set by helmet are visible in the browser DevTools Network tab.

## Cloud Deployment

In production, set the environment variable `NODE_ENV=production` so that HTTP requests are redirected to HTTPS. The app can be deployed on any cloud platform that supports Node.js, such as Render.

## Author

Pranjal Dulhani