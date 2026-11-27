# Math Lover Postman API tests

## Import and run
1. In Postman, choose Import and import both JSON files from this folder.
2. Select the Math Lover Local environment. Defaults are http://localhost:5000/api and http://localhost:5000 for health.
3. Start the backend and ensure PostgreSQL, Redis, and SMTP are configured; the server requires these dependencies during startup.
4. Fill adminEmail/adminPassword and studentEmail/studentPassword with test-account credentials. Run each Login request once; scripts save the access tokens to the environment.
5. Replace the sample UUIDs and courseSlug with records in your test database. Follow resource dependencies: create a course before its batch, then an enrollment before invoices/payments. Example bodies are included for writes.
6. Registration, email verification, password reset, and Google login require a reachable test email/OTP or a Google ID token; enter those values in the environment first.
7. Run the whole collection or a folder. Each request asserts a 2xx response; non-2xx errors are visible in Postman.

## Safety
This collection contains create/update/delete requests and payment decisions. Use a disposable test database, not production. Do not import your backend .env into Postman or commit actual credentials. This environment file contains placeholders only.

Coverage: 85 backend module routes, plus root health check and a duplicate admin-login request.
