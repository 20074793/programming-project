Programming Project

Overview The system supports user authentication, role-based access (Employee / Approver), idea submission, review workflows, and basic analytics.
The project was built using:
* Frontend: React
* Backend: Node.js, Express
* Database: MongoDB
* Authentication: JWT
* Deployment: Vercel (frontend), Render (backend)

AI Assistance
All AI-assisted suggestions were:
* Reviewed and understood
* Modified to match project requirements
* Integrated manually
* Tested and debugged by the author

Areas Where AI Assistance Was Used:
1. Backend Authentication & Security

AI was used to understand and structure common authentication patterns:
* JWT token creation and verification
* Password hashing with bcrypt
* Middleware structure for protected routes
 Role-based access control (approver vs employee)
Files involved:
* backend/src/controllers/authController.js
* backend/src/middleware/authMiddleware.js
* backend/src/routes/ideaRoutes.js

2. Frontend API Communication
AI assistance helped with:
* Axios interceptor pattern for attaching JWT tokens
* Structuring reusable API helpers
 Handling authorization headers cleanly
Files involved:
* frontend/src/apiClient.js
* frontend/src/api.js

3. Dashboard UI & Component Structure
AI was used for UI reference patterns only, not final designs:
* Dashboard layout ideas
* Card/grid styling suggestions
* Filtering and sorting logic examples
All layouts and logic were customized and simplified for this project.
Files involved:
* frontend/src/EmployeeDashboard.js
* frontend/src/ApproverDashboard.js
* frontend/src/IdeaList.js

4. Forms & State Management
AI assistance helped with:
* Initial React form structures
* Handling controlled inputs
* Error handling patterns
These were later customized and integrated into the application flow.
Files involved:
* frontend/src/LoginForm.js
* frontend/src/RegisterForm.js
* frontend/src/App.js

5. Deployment & Debugging Support
* Environment variable issues
* Production build errors
* Render/Vercel deployment configuration
* Common Node.js and React build problems
