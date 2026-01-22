# MarketPulseAI - E-commerce Intelligence Platform

MarketPulseAI is an AI-powered e-commerce intelligence platform designed to help businesses analyze product reviews, competitor insights, and market trends to make actionable, data-driven decisions.

---

## 🖥️ Tech Stack

- **Frontend:** React + TypeScript + Vite  
- **Backend:** Python + FastAPI  
- **AI:** Google Gemini  
- **Styling:** Tailwind CSS  

---

## 🚀 Running Locally

### 1. Clone the repository

git clone https://github.com/kashaffatimajaffrey-design/MarketPulseAI-E-commerce-Intelligence-Platform.git
cd MarketPulseAI-E-commerce-Intelligence-Platform
### 2. Setup Frontend
bash
Copy code
npm install
npm run dev
Frontend will be available at: http://localhost:3000/

### 3. Setup Backend

cd backend
python -m venv .venv
& .venv/Scripts/Activate.ps1    # Windows PowerShell
pip install -r requirements.txt
uvicorn main:app --reload
Backend API will run at: http://127.0.0.1:8000

