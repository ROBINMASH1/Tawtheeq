# Tawtheeq



## 🚀 MERN Stack Project: [Tawtheeq]
A full-stack application built with React (Vite), Node.js (Express), and MongoDB. This project uses a monorepo structure to manage both the frontend and backend in a single repository.

## 📂 Project Structure


Tawtheeq/


 client/           # React + Vite (Frontend)

 
 server/           # Node.js + Express (Backend)

 
.gitignore        # Root gitignore for the whole project


 package.json      # Root manager for concurrent execution

## 🛠️ Prerequisites & Packages
Before running the project, ensure you have Node.js (v18 or higher) installed.


Run npm run install-all to install all dependencies.


Environment Variables


Create a .env file inside the /server folder:


PORT=5000


MONGO_URI=your_mongodb_connection_string


## 🚀 Running the Project


To start both the Vite dev server and the Express backend simultaneously, run:


npm run dev


Frontend: http://localhost:5173


Backend: http://localhost:5000


## 📝 Key Features


Monorepo Architecture: Managed via npm workspaces/prefixes.


Proxying: Vite is configured to proxy /api requests to the Express server to avoid CORS issues.


Database: Structured data modeling using Mongoose Schemas.


