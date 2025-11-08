FuelEU-Maritime

FuelEU-Maritime is a full-stack web application that helps visualise and manage ship emission compliance based on the FuelEU Maritime Regulation.
It allows users to track routes, compare emissions, and manage Compliance Balance (CB) through banking and pooling, just like real-world shipping operators.
This project was built to practice modern full-stack development, clean architecture, and the use of AI coding assistants to speed up development while keeping code quality high.

What You Can Do in This App

✅ View & manage routes for different ships

✅ Compare emissions against baseline and EU target values (with % difference and compliance result)

✅ Bank surplus CB or apply credits when needed

✅ Create compliance pools to balance emissions between ships

✅ Uses a Hexagonal Architecture so the code stays clean, modular, and scalable

✅ Built with the support of AI tools to boost productivity, refactor code, and document the system



| Part                | Tech Used                               |
| ------------------- | --------------------------------------- |
| **Frontend**        | React + TypeScript + TailwindCSS (Vite) |
| **Backend**         | Node.js + Express + TypeScript          |
| **Database**        | PostgreSQL + Prisma ORM                 |
| **Architecture**    | Hexagonal (Ports & Adapters)            |
| **Package Manager** | pnpm                                    |
| **Environment**     | `.env` for DB + Server configs          |


Project Structure


<img width="180" height="331" alt="Screenshot 2025-11-09 021715" src="https://github.com/user-attachments/assets/f8a52046-459b-4a2c-91a5-1baf68791d18" />



Getting Started (Easy Setup Guide)
Requirements Before You Start
Make sure you have:
Node.js 18+
pnpm installed (npm install -g pnpm)
PostgreSQL (local or via Docker)

Backend Setup
git clone https://github.com/yourusername/FuelEU-Maritime.git
cd FuelEU-Maritime/backend
pnpm install

Create a .env file
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fueleu?schema=public"
PORT=4000

If using Docker to run PostgreSQL:
docker compose up -d

Run Prisma setup:
pnpm db:generate
pnpm db:migrate
pnpm db:seed

Start backend:
pnpm dev

Backend runs at:
http://localhost:4000

Frontend Setup
cd frontend
pnpm install
pnpm dev

Visit the app in your browser:
http://localhost:5173

How To use the app
| Tab         | What It Does                                                      |
| ----------- | ----------------------------------------------------------------- |
| **Routes**  | View all routes, filter by ship/fuel/year, set a baseline route   |
| **Compare** | Compare GHG intensity to baseline & check compliance              |
| **Banking** | Bank surplus CB or apply credits to reduce deficit                |
| **Pooling** | Group ships into a pool to share CB and meet compliance as a team |


Why This Project Is Valuable

This project is more than just code — it shows:

⭐ Ability to convert a real regulation into working software

⭐ Strong understanding of architecture, domain modeling, and business logic

⭐ Experience in a real-world industry domain (shipping + sustainability)

⭐ Full-stack development across UI, backend, DB, and data flows

⭐ AI-assisted development used responsibly to improve speed & quality


Ideas for Future Enhancements
Add login & role-based access (Admin / Operator / Auditor)
Add charts for better visualization of emissions & CB changes
Export CB reports as PDF/Excel
Add validation, error handling, and inline UI messages
Deploy using Render / Railway / Vercel / Docker Compose

Thank you for checking out this project! I hope it’s useful for you or anyone who wants to learn how to build a real‑world calendar application.
Happy coding! 

