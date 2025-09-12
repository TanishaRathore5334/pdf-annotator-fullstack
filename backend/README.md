Backend README
==============
Requirements:
- Node.js (v16+)
- MongoDB running locally or connection string in .env

Setup:
1. cd backend
2. cp .env.example .env and fill values
3. npm install
4. npm run dev  (or npm start)

Endpoints:
- POST /api/auth/signup {email,password,name}
- POST /api/auth/login {email,password}
- GET /api/auth/verify (header Authorization: Bearer <token>)
- POST /api/pdfs/upload (form-data file field named 'file') Authorization: Bearer <token>
- GET /api/pdfs/list Authorization
- GET /api/highlights/:pdfUuid Authorization
- POST /api/highlights Authorization {pdfUuid,page,text,boundingRect}
