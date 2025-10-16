# Booking App

This is a sample Booking application (Spring Boot backend + minimal static frontend) containerized with Docker and orchestrated using docker-compose. Flyway is used for DB migrations.

## Run locally

1. Build and start containers:

```bash
docker-compose up --build
```

2. Backend API: http://localhost:9080/api/bookings
3. Frontend UI: http://localhost:3000/

## CI/CD
A GitHub Actions workflow is included at `.github/workflows/ci-cd.yml`.

## Notes
- Uses Flyway for migrations (see `backend/src/main/resources/db/migration`).
- Update secrets (DB password, DockerHub) via environment variables or GitHub Secrets.
