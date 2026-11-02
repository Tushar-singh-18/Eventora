# Eventora

An event booking app. Browse events, book and cancel seats, and manage everything from an admin dashboard.

*Live app:* https://eventora-aebw.vercel.app
*Demo (no login):* click *"View demo"* on the login page. It opens the dashboard in read-only mode.

EVENTS PAGE - 


https://github.com/user-attachments/assets/c8249db1-9a26-4176-af82-5c81e165a6d8





ADMIN DASHBOARD -  

https://github.com/user-attachments/assets/85041c4c-7f14-4477-a70a-e46019c226d9



## Features
- Signup and login with email OTP
- JWT auth, passwords hashed with bcrypt
- Browse events, book and cancel seats, with live seat count
- Admin dashboard: events, bookings and user activity
- Read-only demo mode, so anyone can look around and nobody can change data

## Tech stack
React · Node.js · Express · MongoDB · Vercel (frontend) · Render (backend)

## How it works
- *Seat booking is atomic.* One MongoDB update decrements `seatsAvailable` only if it is above 0, so two people can't take the last seat.
- *Roles.* Users and admins use separate protected routes. Demo mode can view but not write.
- *OTP endpoint is rate-limited* to stop spam.

## Run locally
 ⁠bash
git clone https://github.com/Tushar-singh-18/<repo-name>
cd server && npm install
cp .env.example .env   # MONGO_URI, JWT_SECRET, CLIENT_URL
npm run dev

cd ../client && npm install && npm run dev


⁠ ## What I'd improve next
- Tests for the booking flow (50 simultaneous requests)
- TypeScript and PostgreSQL
  
## Author
Tushar Singh · LinkedIn (https://www.linkedin.com/in/tushar-singh-9245611a1) · GitHub (https://github.com/Tushar-singh-18)
