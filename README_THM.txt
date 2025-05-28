
The 100 Marriage Assessment - Series 1

Build Status: passing | Coverage: 85% | License: MIT

Description:
The 100 Marriage Assessment (Series 1) is a comprehensive relationship compatibility and marriage readiness evaluation platform. It provides a scientifically-based assessment tool that analyzes individuals and couples through a set of psychological questions (100 in total), delivering personalized insights and recommendations based on scoring algorithms and psychological profiles.

Features:
- Individual Assessment ($49): Relationship readiness evaluation with detailed PDF reports.
- Couple Assessment ($79): Compatibility scoring and comparative analysis between partners.
- Arranged Marriage Pool ($25): Matchmaking service based on compatibility scores.
- Admin Dashboard: Manage assessments, analytics, user data, and matches.

Installation:
1. Clone the repository:
   git clone https://github.com/ladjah10/THM.git
   cd THM

2. Install dependencies:
   npm install

3. Configure environment variables in a .env file:
   DATABASE_URL=
   STRIPE_SECRET_KEY=
   STRIPE_PUBLISHABLE_KEY=
   STRIPE_WEBHOOK_SECRET=
   SENDGRID_API_KEY=
   SESSION_SECRET=

4. Set up the database:
   npm run db:push

5. Run the development server:
   npm run dev

6. Build for production (optional):
   npm run build
   npm start

Usage:
- Singles: Complete personal assessment and receive a personalized report via email.
- Couples: Each partner completes the assessment. A compatibility report is emailed after scoring.
- Arranged Marriage Pool: Participants are matched with compatible profiles based on scores.
- Admins: Manage assessments, review submissions, view analytics, and support users.

Technology Stack:
- Frontend: React, TypeScript, Vite, Tailwind CSS, Radix UI
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL, Drizzle ORM
- Authentication: Passport.js, Sessions
- Payments: Stripe API
- Emails: SendGrid, Nodemailer
- Reports: PDFKit
- Testing: Jest

Contributing:
1. Fork the repo and clone locally.
2. Create a new branch.
3. Make and commit your changes.
4. Push your branch to GitHub.
5. Open a Pull Request.

License:
MIT License - see LICENSE file for details.

Contact:
For support or inquiries, contact: contact@example.com (replace with actual contact)
