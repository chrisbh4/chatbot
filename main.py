from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import os

# Initialize the FastAPI app
app = FastAPI()

# Configure OpenAI API Key
# openai.api_key = os.getenv("OPENAI_API_KEY")  # Set your OpenAI API key here
openai.api_key = "sk-J7QB2qEH8Ixd0PkKYBQ6uuHbziS_z3zoKQAHWk08JsT3BlbkFJ6varvG4GrSa1J0Dsb_ymU_nh47Z8cWQkGcM6HtnB0A"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for security, e.g., ['http://localhost:3000']
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

    # try:
        # Send a request to OpenAI's API (e.g., GPT-3.5 or GPT-4)
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

    # ai_response = response.choices[0].message
        return {"response": ai_response}
    else:
        return "Failed to Generate Response"

    # except Exception as e:
    #     return {"error": str(e)}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)