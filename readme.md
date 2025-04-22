Here’s a guide for your **Backend Basic Setup** (Chapter 0):

---

### **Backend Setup Guide**

**Tools Used**: Node.js, Express, Nodemon, DotEnv

---

### **Step-by-Step Setup**

#### **1. Initialize Project Structure**

```bash
mkdir frontend backend
cd backend
```

#### **2. Initialize `package.json`**

```bash
npm init -y              # Generate package.json with defaults in  backend
```

#### **3. Update `package.json`**

Edit the file to include:

```json
{
  "type": "module", // Enable ES6 imports
  "scripts": {
    "dev": "nodemon src/index.js", // Dev script
    "start": "node src/index.js" // Production script
  }
}
```

#### **4. Install Dependencies**

```bash
npm i -g nodemon         # Global install (optional)
npm i express dotenv     # Install Express + environment vars
```

#### **5. Project Structure**

```
|-- backend/
    ├── node_modules/
    ├── src/
    │   └── index.js         # Main entry file
                # Environment variables
    ├── package.json
    └── package-lock.json
├── .env
```

#### **6. Configure `index.js`**

```javascript
import express from "express";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables
const app = express();
const PORT = process.env.PORT || 3000; // Fallback to 3000 if .env missing

// Basic route
dotenv.config();

const app = express();

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
```

#### **7. Configure `.env`**

```env
PORT=3000
```

#### **8. Start the Server**

```bash
npm run dev   # Development (with Nodemon for live reload)
# or
npm start     # Production
```

---

### **Key Notes**

✅ **Why `"type": "module"`?**

- Allows modern ES6 `import` syntax (instead of `require`).

✅ **Why `dotenv`?**

- Securely loads environment variables (e.g., API keys, ports) from `.env`.

✅ **Why Nodemon?**

- Automatically restarts the server when files change.

✅ **What to Ignore**

- Add `node_modules/` and `.env` to `.gitignore` to avoid committing unnecessary files.

---
step - 1

**Example Terminal Output After Setup**:  
![Terminal showing "Server running on http://localhost:3000"](https://via.placeholder.com/400x100?text=Server+running+on+http://localhost:3000)

**Folder Structure Preview**:  
![Backend folder structure](https://via.placeholder.com/200x200?text=backend/%0A%7C--+src/%0A%7C----+index.js%0A%7C--+.env%0A%7C--+package.json)


# Chapter 1: Prisma with PostgreSQL Setup  
**Tech Stack**: Prisma, PostgreSQL, Docker  

### **1. Install Prisma**  
```bash
npm install prisma @prisma/client
```

### **2. Initialize Prisma**  
```bash
npx prisma init
```
Creates `/prisma` folder with `schema.prisma`.

---

## **3. Set Up PostgreSQL via Docker**  
### Verify Docker is running:  
```bash
docker --version
```

### Run PostgreSQL Container:  
```bash
docker run --name my-postgres \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -p 5432:5432 \
  -d postgres
```

**Verify Container**:  
```bash
docker ps -a
```

---

## **4. Configure Prisma Schema**  
Edit `/prisma/schema.prisma`:  
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

---

## **5. Update Environment Variables**  
In `.env`:  
```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/leetlab?schema=public"
```

---


## **6. Database Migration**  
### Create and apply migrations:  
```bash
npx prisma migrate dev --name init
```

### Sync schema (optional):  
```bash
npx prisma db push
```

---

## **7. Generate Prisma Client**  
```bash
npx prisma generate
```



**Folder Structure**:  
```
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```