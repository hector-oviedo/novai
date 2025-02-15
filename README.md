# Local LLM Chat with React & FastAPI

## Overview
This repository contains a **React frontend** (`frontend/`) and a **FastAPI backend** (`backend/`). The backend provides a **local chat-based LLM interface** using `llama-index` with **Ollama**, along with:
- **User/session management**
- **Document management**
- **Messages management**
- **Tool (function) management**

Currently, features are **not fully implemented**, but the **schema and routes are prepared** to support them in the future.

---

## Prerequisites
Ensure you have the following installed:

- **Python 3.9+** (for the FastAPI backend)
- **Node.js + npm** (for the React frontend)
- **Ollama** or another local LLM server (if you want local inference)
- **SQLite** or a suitable DB engine (configured in `config.py`)

---

## Installing & Running

### **Backend (FastAPI)**
Install dependencies:
```sh
cd backend
pip install -r requirements.txt
```


Run the server with Uvicorn:

```sh
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

By default, it listens on port 8000.

(Optional) Start Ollama in another terminal if you are using it for local LLM inference:

```sh
ollama serve
```

Ensure it’s on the port your `llm_service.py` references (e.g., `127.0.0.1:11434`).

### **Frontend (React)**
- Install dependencies:

```sh
cd frontend
npm install
```

- Run development mode:

```sh
npm run dev
```

The app typically starts on localhost:5173 (or whichever port is shown).

## Project Features

### **Authentication (`routes/auth.py`)**
- **Register:** `POST /auth/register` → Creates a user with a hashed password in the DB.
- **Login:** `POST /auth/login` → Sets an **HttpOnly cookie** containing a JWT.
- **Logout:** `POST /auth/logout` → Clears the cookie.
- **Profile:** `GET /auth/profile` → Returns the current user’s **ID, username, etc.**

### **Sessions (`routes/sessions.py`)**
- **List sessions:** `GET /sessions` → Fetch all chat sessions for the logged-in user.
- **Create session:** `POST /sessions` → Create a new chat session.
- **Delete session:** `DELETE /sessions/{session_id}` → Remove a session (if owned by the user).
- **Retrieve messages:** `GET /sessions/{session_id}/messages` → Get the last **N messages**.
- **Add message:** `POST /sessions/{session_id}/messages` → Insert a **user/assistant message**.
- **Update message:** `PUT /sessions/{session_id}/messages/{message_id}` → Edit a message (*not fully hooked up in frontend*).
- **Delete message:** `DELETE /sessions/{session_id}/messages/{message_id}` → Remove a message.

### **Documents (`routes/documents.py`)**
- **List documents:** `GET /documents/list` → Fetch all documents **attached to sessions**.
- **Upload document:** `POST /documents/upload` → Upload a new document.
- **Delete document:** `POST /documents/delete` → Remove a document (if owned by the user).
- **Attach document:** `POST /documents/attach` → Link a document to a session.
- **Detach document:** `POST /documents/detach` → Unlink from a session.

### **Tools (`routes/tools.py`)**
- **List tools:** `GET /tools/list` → Fetch all available tools.
- **Attach tool:** `POST /tools/attach` → Link a tool to a session.
- **Detach tool:** `POST /tools/detach` → Unlink a tool from a session.
> ⚠️ *Currently, there is **no actual function calling** or plugin logic implemented, but the schema is prepared.*

### **Chat Inference (`routes/chat.py`)**
- **Stream chat:** `POST /chat/stream` → Streams **tokens from the local LLM**, returning text line by line. Also **stores messages in DB**.
- **Stop streaming:** `POST /chat/stop` → Cancels streaming **if the model supports it**.

### **LLM Service (`services/llm_service.py`)**
- Uses **llama_index’s Ollama** (or an HTTP-based LLM).
- Streams partial responses to `/chat/stream`.
- Supports **parsing chain-of-thought** `<think>...</think>` if the model inserts it.

---

## Future Plans
- **RAG**: Integrate **VectorStoreIndex** from `llama_index` with user documents for **retrieval-augmented generation**.
- **Function calling**: Schema is in place, but **actual function execution** is missing.
- **Edit/Remove Messages**: Backend endpoints exist, but the **frontend UI is incomplete**.

---

## **Quick Summary**
| Feature | Command |
|---------|---------|
| **Backend** | `cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000` |
| **Frontend** | `cd frontend && npm run dev` |
| **Authentication** | JSON-based **sign-up/login**, with **HttpOnly cookie** |
| **Sessions** | Chat **session storage**, including **user & assistant messages** |
| **Documents** | Upload, attach/detach to sessions |
| **Tools** | Prepare to attach/detach **functions** |
| **LLM** | Local **streaming inference** via `llama_index` + Ollama |
| **Missing** | ❌ RAG, function calling, or **message editing UI** |

---

That’s it! 🎉 Enjoy hacking on **local LLM chat & data management**!