# Dashwise

**A simple, affordable business dashboard for small service-based businesses**  
Manage appointments, track revenue, and maintain customer data — all without technical hassle.

---

## Project Vision

Dashwise is designed to empower local service providers like salon owners, tutors, lawyers, dentists, and consultants with an easy-to-use tool that centralizes daily business operations. No more notebooks, WhatsApp, or messy spreadsheets. Just log in and run your business smarter.

---

## Features

### Core MVP (Phase 1)

- **User Authentication:** Secure signup, login, and logout with JWT  
- **Appointment Management:** Add, edit, and delete appointments with client, service, date/time, and fee  
- **Revenue Tracking:** Automated daily, weekly, and monthly income calculation  
- **Customer CRM:** Manage customer details and visit history  
- **Smart Dashboard:** Overview of today's appointments, income summary, and top customers  
- **Reports Export:** Download reports as PDF or CSV for accounting or investors

### Planned Bonus Features (Phase 2+)

- SMS/Email reminders to clients  
- Visual calendar view for scheduling  
- Multi-user staff roles and permissions  
- Online booking page integration  
- Payment tracking with Stripe, PayPal, or M-Pesa

---

## Tech Stack

- **Frontend:** React.js + Bootstrap  
- **Backend:** Flask (Python)  
- **Database:** Supabase (PostgreSQL)  
- **Authentication:** JWT (JSON Web Tokens)  
- **Deployment:** Render (or Railway/Fly.io alternatives)  
<!-- - **Export:** ReportLab / Flask-WeasyPrint for PDF/CSV generation  
- **Optional:** Mailgun/Twilio for notifications -->

---

## Installation & Setup

1. **Clone the repo**

```bash
git clone https://github.com/Herman-Gathege/dashwise.git
cd dashwise
Frontend setup
npm install
npm start

Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run

Environment variables
Create .env files in frontend and backend as needed for:

JWT secret keys

Supabase credentials

API keys for email/SMS (if used)

Usage
Register an account and log in securely

Add and manage client appointments

Track revenue trends easily

Maintain detailed customer records

Export reports for bookkeeping or investors

Access dashboard summary at a glance

Roadmap
Add SMS and email reminders

Integrate calendar scheduling UI

Enable staff roles and multi-user access

Add online client booking page

Integrate payment tracking

Contributing
Contributions are welcome! Please open an issue or submit a pull request with improvements, bug fixes, or feature suggestions.

License
MIT License

Contact
For questions or support, reach out at [remingtonherman7@gmail.com]