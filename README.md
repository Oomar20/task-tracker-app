# Task Tracker App

This task tracking application was built with NestJS and React. Users can sign up, authenticate via JWT, create boards, lists, and cards, and manage them with create/read/update/delete operations. Includes pagination, seeding, and Docker Compose for local development.

## Tech Stack

 - ### Backend
	 - NestJS 
	 - Prisma ORM → PostgreSQL
	 - Passport JWT for auth

- ### frontend
	- React + Vite + TypeScript
	- Tailwind CSS + shadcn/ui
	- Zustand for state management
	- React Router
	- Axios for API calls


## Step to Run

 1. Start PostgreSQL via Docker
	 
		 cd backend
		 docker compose up -d
		 #Confirm with:
		 docker ps

2. Backend		
		
		cd backend
		
		# Install dependencies
		npm install
		
		# Generate Prisma client
		npx prisma generate
		
		# Apply migrations
		npx prisma migrate dev --name init
		
		npm run start:dev
		# → Server: http://localhost:3000

3. Frontend
		
		cd ../frontend
		
		# Install dependencies
		npm install
		
		Start dev server
		npm run dev
		# → App: http://localhost:5173













