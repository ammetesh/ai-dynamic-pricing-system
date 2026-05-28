from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import joblib
import pandas as pd

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

from webdriver_manager.chrome import ChromeDriverManager

import time


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
# LOAD MODEL
# ----------------------------

model = joblib.load("dynamic_pricing_model.pkl")


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
        service=Service(ChromeDriverManager().install())
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