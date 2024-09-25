from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

load_dotenv()
# Initialize the FastAPI app
app = FastAPI()

openai.api_key = os.getenv("OPENAI_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve the index.tsx file as HTML at the '/' route
@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("frontend/src/index.tsx", "r") as file:
        content = file.read()
    return content

# Model for incoming POST requests
class MessageRequest(BaseModel):
    message: str

# Route to handle POST requests to '/api' and call OpenAI API
@app.post("/api")
async def send_message(request: MessageRequest):
    user_message = request.message

    response = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message}
                ]
                )

    if response.choices[0].message != None:
        print(response.choices[0].message)
        ai_response = response.choices[0].message.content

        return {"response": ai_response}
    else:
        return "Failed to Generate Response"

    # except Exception as e:
    #     return {"error": str(e)}
