A web-based portfolio management application with role-based access control, authentication, and API integration. The platform allows users to create, view, update, and delete portfolio items, while also supporting additional features like two-factor authentication (2FA) and external API integrations.

Features:
User Authentication: Secure login and registration system with JWT and optional 2FA.
Role-Based Access Control (RBAC): Two roles: admin and editor, with different access levels.
Portfolio Management: CRUD operations (Create, Read, Update, Delete) for portfolio items.


API Integration:
Fetch top news headlines from NewsAPI.
Fetch cryptocurrency prices from CoinGecko API.
Modern UI: Simple, responsive interface for managing data.


Tech Stack:
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: JWT, Bcrypt.js
Frontend: EJS templating with CSS for styling
External APIs: NewsAPI, CoinGecko


Setup:
1. Install depedencies
2. Start MongoDB server.3. Run the app: node app.js
The server will start at http://localhost:3000.

Access the application:

Register: Navigate to /auth/register to create a new account.
Login: Navigate to /auth/login to log in.
Portfolio Management: Access CRUD operations at /portfolio.
2FA Setup Guide
The platform supports two-factor authentication (2FA) for enhanced security. Here's how to enable and verify 2FA:

1. Enable 2FA for Your Account
Log in to your account by navigating to /auth/login.
Go to /auth/2fa/setup to initiate the 2FA setup process.
This will generate a QR code that you can scan using a 2FA app (e.g., Google Authenticator, Authy).
The QR code will be displayed on the page.
2. Verify Your 2FA Code
After scanning the QR code, enter the 6-digit verification code provided by your 2FA app into the input field.
Click the "Verify" button to complete the setup.
Upon successful verification, 2FA will be enabled for your account.
3. Usage After Setup
During login, you'll need to provide your username, password, and the 6-digit code from your 2FA app.


Users can easily manage their portfolios with the help of the feature-rich and safe Portfolio Management Platform. It supports role-based access control (RBAC) to effectively manage permissions and integrates contemporary security features like JWT authentication and optional two-factor authentication (2FA).

The platform offers a complete portfolio management solution with dynamic features like image uploads and external API integrations for real-time news and cryptocurrency data. It is a strong basis for upcoming improvements because of its modular design, which guarantees scalability and maintainability.

This project serves the needs of both teams and individual users by showcasing the effectiveness of fusing a user-friendly interface with strong backend technologies. The Portfolio Management Platform is prepared to be used for individual purposes or as a foundation for more extensive systems. 
