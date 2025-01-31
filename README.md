# AI Chat Frontend

This is the **frontend** for an AI-powered chat application built using **React**. The application integrates real-time **markdown rendering**, **code snippets**, **tables**, and **message threading**. It is designed to work with a **Node.js backend** leveraging **LlamaIndex** for memory persistence and future **Retrieval-Augmented Generation (RAG) & function calling** capabilities.

## 🚀 Features

### ✅ Chat Functionality
- **Message threading** with context-aware responses.
- **"Thinking" mode** indicating AI is processing input.
- **Markdown compatibility** for rich-text formatting.
- **Stream mode only in normal chat** (currently not enabled in "Thinking" mode).
- **Snippet codes** with syntax highlighting.
- **Tables for structured data representation**.

### 🛠️ Backend & Memory Management
- **LlamaIndex-powered memory for persistent context**.
- **Chat history stored and retrieved dynamically**.
- **Current issues**: Some minor inconsistencies in memory persistence.
- **Future upgrades**:
  - **RAG (Retrieval-Augmented Generation)** for improved contextual accuracy.
  - **Function calling** for external task execution.

## 📂 Tech Stack

### Frontend (React)
- **React** with component-based architecture.
- **Markdown rendering** for enhanced chat experience.
- **Syntax-highlighted code snippets**.

### Backend (Node.js)
- **Node.js with LlamaIndex** for chat memory.
- **Express.js API for handling requests**.
- **Memory-based retrieval & persistence**.

## ⏳ Development Status
- **Frontend:** 🛠️ **Chat UI fully functional** (with "Thinking" mode, markdown, snippets, and tables).
- **Backend:** 🛠️ **LlamaIndex memory operational** (minor persistence issues).
- **Future Plans:** 📌 **Implement RAG and function calling**.

---