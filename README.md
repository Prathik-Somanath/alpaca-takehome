# Alpaca Health Software Engineering Take-Home Project

## Setup Instructions

### Backend Setup (Python 3.11+ required)

```bash
# Create and activate virtual environment
python -m venv alpaca_venv
source alpaca_venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Download the env file which contains the URL for mongoDB and API Key for Gemini-pro

# Start the server
uvicorn main:app --reload
```

### Frontend Setup (Node.js 18+ required)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Default Project Structure

- `frontend/`: Next.js application
  - `src/components/`: Reusable React components
  - `src/app/`: Next.js app router pages
  - `src/lib/`: APIs and types
- `backend/`: FastAPI application
  - `app/main.py`: API endpoints

## Development

- Frontend runs on port 3000 with hot reload enabled (due to time constraint the basic boilerplate with the modal was generated using chatgpt)
- Mongodb to store the templates and notes written by the providers
- Backend runs on port 8000 with auto-reload enabled
- Gemini-pro to generate AI notes written by the providers according to the template

## Timeline of development - (5 hrs)
- Read the problem statement and cloned the repo 18th night and slept over it.
- 2pm PST- 4pm PST implemented backend with testing with postman
- 4-4:30pm PST tested prompts with gemini-pro
- 6-7pm PST set-up boilterplate for frontend with modal
- 10:30-11:30pm PST integration of the APIs
- 11:30pm-12am PST documentation


## Assumptions or trade-offs:
- I have assumed that this is just to test the features of the Notes Tempelate AI generation hence I have not included the user creationg (provider account) and login is not present
- If given time could have implemented a way to have a conversation chain with the gemini api to make modifications to the notes which it generated. Promts could have been more tailored.
- Notes status could have been implemented. Providers often tend to save the notes as draft and then revisit to finish the final notes which is a good feature to have.

Overall I enjoyed this challenge!

## The following ways of testing were done to ensure quality.
1) Manual Testing
The website was loaded on the local system and tested for all scenarios, including the basic functionality and edge cases.
2) Feature Testing
Each of the features were tested individually to ensure low level quality is assured.

