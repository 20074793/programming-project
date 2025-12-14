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
* JWT token creation and verification: https://chatgpt.com/share/693e7e92-be4c-8006-adf8-0cf89b4cf1fb
* Password hashing with bcrypt: https://chatgpt.com/share/693e8314-6760-8006-96d7-51cb905574ae
* Middleware structure for protected routes: https://chatgpt.com/share/693e7e92-be4c-8006-adf8-0cf89b4cf1fb / https://chatgpt.com/share/693e8314-6760-8006-96d7-51cb905574ae
 Role-based access control (approver vs employee)
Files involved:
* backend/src/controllers/authController.js
* backend/src/middleware/authMiddleware.js
* backend/src/routes/ideaRoutes.js

2. Frontend API Communication
AI assistance helped with:
* Axios interceptor pattern for attaching JWT tokens : https://chatgpt.com/share/693e8573-c6f0-8006-917d-241643952059
* Structuring reusable API helpers: https://chatgpt.com/share/693e9406-f7bc-8006-b684-813d83c62248
 Handling authorization headers cleanly
Files involved:
* frontend/src/apiClient.js
* frontend/src/api.js

3. Dashboard UI & Component Structure
AI was used for UI reference patterns only, not final designs:
* Dashboard layout ideas: https://chatgpt.com/share/693e9651-f088-8006-a89b-2fc8a931f431
* Card/grid styling suggestions: https://chatgpt.com/share/693e9651-f088-8006-a89b-2fc8a931f431
* Filtering and sorting logic examples
All layouts and logic were customized and simplified for this project.
Files involved:
* frontend/src/EmployeeDashboard.js
* frontend/src/ApproverDashboard.js
* frontend/src/IdeaList.js

4. Forms & State Management
AI assistance helped with:
* Initial React form structures : https://chatgpt.com/share/693e96b2-eb18-8006-a207-28bc2f45f7ce
* Handling controlled inputs
* Error handling patterns
These were later customized and integrated into the application flow.
Files involved:
* frontend/src/LoginForm.js
* frontend/src/RegisterForm.js
* frontend/src/App.js

5. Deployment & Debugging Support : https://chatgpt.com/share/693e97d7-c760-8006-af10-46d696c0d68e
* Environment variable issues 
* Production build errors
* Render/Vercel deployment configuration
* Common Node.js and React build problems

6. Deployment

* Frontend: https://programming-project-brown.vercel.app/
* Backend API: https://new-programming-project.onrender.com/

