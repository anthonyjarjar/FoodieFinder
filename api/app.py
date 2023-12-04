from typing import Union
from model import resnet18
from fastapi import FastAPI, File, UploadFile

import torch

app = FastAPI()

model = resnet18()
model.load_state_dict(torch.load("model.pth", map_location=torch.device('cpu')))

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict")
def read_item(image: UploadFile = File()):
    print(image)
