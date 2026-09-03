Setup the servers:
backend:
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

frontend:
cd frontend
npm run dev

@theme {
--color-color-main: #0f0f12;
--color-color-secondary: #1b1b22;
--color-color-accent: #00e5ff;
--color-color-text: #e5e7eb;
--color-color-title: #f9fafb;
--color-color-border: #1d4a50;
}
