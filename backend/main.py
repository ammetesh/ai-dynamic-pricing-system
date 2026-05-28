from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import os
import time
import joblib
import gdown
import pandas as pd

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager


# ----------------------------
# FASTAPI APP
# ----------------------------

app = FastAPI()


# ----------------------------
# CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# GOOGLE DRIVE MODEL DOWNLOAD
# ----------------------------

MODEL_PATH = "dynamic_pricing_model.pkl"

FILE_ID = "1J5Yg_CExWOlKCJ2hGwPXKgHrEaXKjyuB"

URL = f"https://drive.google.com/uc?id={FILE_ID}"


if not os.path.exists(MODEL_PATH):

    print("Downloading model from Google Drive...")

    gdown.download(
        URL,
        MODEL_PATH,
        quiet=False
    )


# ----------------------------
# LOAD MODEL
# ----------------------------

model = joblib.load(MODEL_PATH)


# ----------------------------
# REQUEST MODELS
# ----------------------------

class PricingInput(BaseModel):
    base_price: float
    discount_pct: float
    units_sold: float
    inventory_level: float
    demand_index: float


class AmazonInput(BaseModel):
    url: str


# ----------------------------
# HOME ROUTE
# ----------------------------

@app.get("/")
def home():

    return {
        "message": "AI Dynamic Pricing API Running"
    }


# ----------------------------
# PRICE PREDICTION ROUTE
# ----------------------------

@app.post("/predict")
def predict(data: PricingInput):

    input_data = pd.DataFrame([{
        "base_price": data.base_price,
        "discount_pct": data.discount_pct,
        "units_sold": data.units_sold,
        "inventory_level": data.inventory_level,
        "demand_index": data.demand_index
    }])

    prediction = model.predict(input_data)[0]

    return {
        "predicted_price": round(float(prediction), 2)
    }


# ----------------------------
# AMAZON SCRAPER ROUTE
# ----------------------------

@app.post("/amazon-price")
def get_amazon_price(data: AmazonInput):

    driver = webdriver.Chrome(
        service=Service(
            ChromeDriverManager().install()
        )
    )

    url = data.url

    driver.get(url)

    time.sleep(5)

    try:

        title = driver.find_element(
            By.ID,
            "productTitle"
        ).text


        price = driver.find_element(
            By.CLASS_NAME,
            "a-price-whole"
        ).text


        try:

            discount = driver.find_element(
                By.CLASS_NAME,
                "savingsPercentage"
            ).text

        except:

            discount = "No Discount"


        driver.quit()

        return {
            "title": title,
            "price": price,
            "discount": discount
        }


    except Exception as e:

        driver.quit()

        return {
            "error": str(e)
        }