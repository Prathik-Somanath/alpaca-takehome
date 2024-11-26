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


## Results

[Demo video link](https://drive.google.com/file/d/1mZQNinvoEdGCa80IUsWqCUpjxyuWG1a2/view?usp=sharing)

1) Upload New Patient Note
![Screenshot from 2024-11-20 00-16-17](https://github.com/user-attachments/assets/c2b65d6c-ce46-4f02-8652-ba959a12f151)

2) Edit/Create Templates![Screenshot from 2024-11-20 00-16-46](https://github.com/user-attachments/assets/3ce5b25e-db42-4c9d-8562-4acee598ff8f)

![Screenshot from 2024-11-20 00-16-29](https://github.com/user-attachments/assets/6727e7f3-5347-4693-a1e8-1a9b32e9050d)

3) Edit/Save Notes (Re-generate AI note)
   ![Screenshot from 2024-11-20 00-17-54](https://github.com/user-attachments/assets/8095aef7-60c0-450a-8072-132f0dbca785)



| Category | Details | Weight |
|----------|---------|--------|
| Product sense and scoping | - Final product decisions alignment with requirements<br>- Appropriate deprioritization of non-crucial parts | 10% |
| Technology selection | - Right tools chosen for the job | 10% |
| Technical Level | - Well-organized and intuitive code structure<br>- Modular code (e.g., React components used)<br>- Proper use of React hooks<br>- Good state management<br>- Correct use of useEffect hooks | 40% |
| Craft and Quality | - Usable and intuitive UI/UX<br>- Presence and severity of bugs | 20% |
| Documentation | - Clear communication of logic and technical decisions in README | 10% |
| Testing | - Presence of tests<br>- Quality and robustness of tests | 10% |
