# Nov.AI (in Development)

Nov.AI is a **local** RAG (Retrieval Augmented Generation) system built with FastAPI (Python), leveraging `llamaindex` and `ollama` to run a local Large Language Model (deepseek-r1:1.5b). It also features:
- JWT-based authentication (user registration & login).
- Multi-session chat with persistent memory.
- Document management (upload, attach, remove).
- (Planned) RAG-based retrieval from a vector database of user documents.
- (Planned) Function calling/tools system to extend the LLM's capabilities.

## Table of Contents
1. [Project Status](#project-status)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Running the Project](#running-the-project)
6. [Backend Endpoints Overview](#backend-endpoints-overview)
7. [Frontend](#frontend)
8. [Future Improvements](#future-improvements)
9. [Screenshots](#screenshots)

---

## Project Status
- **In Development**: Some features are not yet fully implemented (e.g., complete RAG integration, advanced function calling, incomplete-message manager).
- The system currently runs locally with `ollama` (on the default port `11434`).

---

## Features
1. **User System**  
   - Registration & login using JWT tokens.  
   - Basic session expiration/renewal flow.

2. **Chat & Memory**  
   - Users can create multiple **chat sessions**.
   - Each session stores chat messages (user & assistant).
   - Messages are saved in a local database, so they persist across restarts.

3. **Documents**  
   - Users can upload documents.
   - Documents can be attached/detached from any chat session (symbolic for now, planned for RAG).
   - Documents have an optional name & description.

4. **Tools (Function Calling)**  
   - Basic structure to load available tools (e.g., Weather, Internet, etc.).
   - Tools can be attached/detached to sessions (again symbolic for now).

5. **Security Layer**  
   - JWT-based auth via **HttpOnly** cookies.
   - A session expiry mechanism is in place (subject to refinement).

6. **Local LLM**  
   - Uses `llamaindex` with an `ollama`-based local server for the LLM.

---

## Project Structure

**Main directories and files**:

   - main.py <-- FastAPI entry point
   - config.py <-- Configuration parameters
   - security.py <-- JWT token creation/verification
   - database.py <-- SQLAlchemy engine & session
   - models/ <-- Database models (User, Session, Documents, etc.)
   - routes/ <-- FastAPI route definitions (auth, chat, sessions, tools, documents)
   - services/ <-- Core logic: chat_service, memory_service, LLM service, RAG service
   - utils/logger.py <-- Central logger setup
   - create_tables.py <-- Utility script to initialize DB schema
   - seed_tools.py <-- (Optional) Template for seeding function-calling tools

   
---

## Installation & Setup

**Prerequisites**:
- Python 3.9+ (recommend using Conda environment).
- `ollama` installed and running locally (on default port 11434).
- (Optional) MySQL or SQLite (by default uses local SQLite file `database.db`).

**1) Create and activate a Conda environment** (example command):
```bash
conda create -n novai python=3.9
conda activate novai
```

**2) Install required Python packages**:
```bash
pip install fastapi uvicorn sqlalchemy pydantic python-jose "llamaindex>=0.12.15" ...
```

*(Check the `requirements.txt` or your internal reference for the complete list.)*

**3) Initialize the database**:
```bash
python create_tables.py
```

This creates the necessary tables in the local `database.db`.

**4) (Optional) Seed Tools**:
```bash
python seed_tools.py
```

This inserts some sample tools for the function-calling demonstration.

---

## Running the Project

**1) Start 'ollama'** (in a separate terminal/window) to serve the local model:
```bash
ollama serve
```

**2) Launch the FastAPI backend**:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**3) Access the API**:  
Default backend URL: `http://localhost:8000/`

---

## Backend Endpoints Overview

1. **Authentication (``/auth``)**  
   - ``POST /auth/register``  
   - ``POST /auth/login``  
   - ``POST /auth/logout``  
   - ``GET /auth/profile``  

2. **Chat (``/chat``)**  
   - ``POST /chat/stream`` (streams inference tokens)  
   - ``POST /chat/stop`` (stops ongoing inference)

3. **Sessions (``/sessions``)**  
   - ``GET /sessions`` (list user sessions)  
   - ``POST /sessions`` (create session)  
   - ``DELETE /sessions/{session_id}`` (delete session)  
   - ``GET /sessions/{session_id}/messages`` (list messages)  
   - ``POST /sessions/{session_id}/messages`` (add new message)  
   - ``PUT /sessions/{session_id}/messages/{message_id}`` (edit message)  
   - ``DELETE /sessions/{session_id}/messages/{message_id}`` (remove message)

4. **Documents (``/documents``)**  
   - ``GET /documents/list`` (list user documents)  
   - ``POST /documents/upload`` (upload and ingest doc)  
   - ``POST /documents/delete`` (delete a document)  
   - ``POST /documents/attach`` (attach doc to session)  
   - ``POST /documents/detach`` (detach doc from session)

5. **Tools (``/tools``)**  
   - ``GET /tools/list`` (lists all available tools)  
   - ``POST /tools/attach`` (attach a tool to a session)  
   - ``POST /tools/detach`` (detach a tool from a session)

---

## Frontend

**Technologies**:  
- Built with React, Vite, and MUI.

**Running**:
```bash
cd frontend
npm install
npm run dev
```

The frontend is configured to talk to ``http://localhost:8000`` by default (adjust if needed).

---

## Future Improvements

1. **RAG**  
   - Actual ingestion to a vector database (e.g., Faiss, Chroma, or weaviate).
   - Combining documents with LLM context dynamically during inference.

2. **Function Calling**  
   - Implement actual code to handle calls to external APIs or modules.
   - Currently, it’s symbolic: user can attach/detach predefined tools.

3. **Incomplete Messages Manager**  
   - Ability to edit or remove older messages from a session.

4. **Security/Session Handling**  
   - Fine-tune JWT expiration and security measures (session refresh).

5. **Docker/Production**  
   - Full Docker Compose setup for the entire stack (ollama, FastAPI, DB, etc.).

---

## Screenshots


*(Screenshots will be added in future commits)*

---

**Enjoy experimenting with Nov.AI!**  
Feel free to explore the code and modify it to suit your research and development needs.