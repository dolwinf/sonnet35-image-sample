import anthropic
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import logging
import os

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)


class ImageData(BaseModel):
    image_base64: str


@app.post("/upload-image")
async def upload_image(data: ImageData):

    try:

        if data.image_base64.startswith("data:image"):
            mime_type, image_data = data.image_base64.split(",")
            image_media_type = mime_type.split(";")[0].split(":")[1]
        else:
            raise ValueError("Invalid data format")

        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": image_media_type,
                            "data": image_data,
                        }
                    },
                    {"type": "text", "text": "What is in this image?"}
                ]}
            ]
        )

        return {"message": message.content[0]["text"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {e}")
