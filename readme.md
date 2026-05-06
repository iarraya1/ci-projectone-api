📚 Bookstore API

A production-ready RESTful API for managing books and authors, built with Node.js and Express.
This project demonstrates API design, automated testing, CI/CD, documentation, and monitoring.

🚀 Features
RESTful endpoints for books and authors
OpenAPI (Swagger) documentation
Automated API testing with Postman/Newman
CI/CD pipeline using GitHub Actions
Deployment on Render
Logging and monitoring (Morgan + health endpoint)

🏗️ Tech Stack
Node.js
Express
Morgan (logging)
CORS
Postman / Newman (testing)
GitHub Actions (CI)
Render (deployment)
OpenAPI 3.0 (documentation)

📡 API Endpoints
Health
GET /health

Returns API status, uptime, and timestamp.

Books
GET /books
POST /books
GET /books/{id}
PUT /books/{id}
PATCH /books/{id}
DELETE /books/{id}

Authors
GET /authors

📦 Book Object Structure
{
  "id": 1,
  "title": "Before They Are Hanged",
  "authorId": 3,
  "author": "Joe Abercrombie",
  "price": 17.99
}

📝 Request Examples
Create Book
{
  "title": "Before They Are Hanged",
  "author": "Joe Abercrombie",
  "price": 17.99
}
Update Book (PUT)
{
  "title": "Rage",
  "author": "Wilbur Smith",
  "price": 18.99
}
Partial Update (PATCH)
{
  "price": 11.99
}
⚠️ Error Response Format
{
  "error": "Book not found"
}

📄 API Documentation (Swagger)

Interactive API documentation is available at:

http://localhost:10000/docs

or deployed:

https://ci-projectone-api.onrender.com/docs

🧪 Testing

Automated tests are implemented using Postman and Newman.

Run tests locally
npm test
Test coverage includes:
Create → Retrieve → Update → Delete flow
Validation errors
Response structure validation

🔄 CI/CD Pipeline

GitHub Actions is used to automate:

Install dependencies
Start API
Run Newman tests
Validate API before deployment

Workflow runs on:

Push to main branch
Pull requests

☁️ Deployment

The API is deployed using Render.

Auto-deploy enabled on push
Build command: npm install
Start command: npm start

Live API:

https://ci-projectone-api.onrender.com

📊 Logging & Monitoring
HTTP request logging via Morgan
Custom logs for:
Book creation
Updates
Deletions
Errors
Health endpoint for uptime monitoring:
GET /health

🧠 Design Decisions
Author name used instead of authorId in requests
Improves usability
Automatically creates authors if not found
In-memory data store
Simplifies development
Focuses on API design over persistence
RESTful conventions
Proper HTTP verbs and status codes
Resource-based URIs

⚙️ Installation
git clone https://github.com/YOUR_USERNAME/ci-projectone-api.git
cd ci-projectone-api
npm install
npm start

🧪 Quick Test
curl http://localhost:10000/health
curl https://ci-projectone-api.onrender.com/health

📌 Future Improvements
Add database (PostgreSQL or MongoDB)
Add authentication (JWT)
Add pagination for books
Add rate limiting
Improve structured logging

👨‍💻 Author
Ivan Arraya
