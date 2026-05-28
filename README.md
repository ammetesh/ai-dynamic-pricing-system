# AI Dynamic Pricing System

An AI-powered dynamic pricing and competitor intelligence platform built using FastAPI, Random Forest Regression, React, SHAP explainability, and live Amazon product scraping.

---

## Features

* AI-powered dynamic pricing prediction
* Random Forest regression model
* XGBoost model comparison
* SHAP explainability insights
* Live Amazon competitor scraping
* Real-time pricing dashboard
* Revenue monitoring
* Demand analytics charts
* Competitor price comparison
* Interactive frontend dashboard
* FastAPI backend API
* React + Tailwind frontend

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Recharts
* Axios

### Backend

* FastAPI
* Python
* Selenium
* WebDriver Manager

### Machine Learning

* Random Forest Regressor
* XGBoost Regressor
* SHAP Explainability
* Scikit-learn
* Pandas
* NumPy

---

## Project Architecture

Frontend (React)
↓
FastAPI Backend
↓
ML Prediction Engine
↓
Amazon Competitor Scraper
↓
Dynamic Pricing Insights

---

## ML Model Comparison

| Model                   | MAE   | Status       |
| ----------------------- | ----- | ------------ |
| Random Forest Regressor | 0.037 | Selected     |
| XGBoost Regressor       | 4.55  | Experimental |

Random Forest achieved superior performance and was selected as the final production model.

---

## Key Functionalities

### Dynamic Pricing

Predicts optimized retail pricing based on:

* Base price
* Demand index
* Inventory level
* Units sold
* Discount percentage

### Competitor Intelligence

Scrapes real Amazon product data including:

* Product title
* Price
* Discount percentage

### Explainable AI

Provides SHAP-inspired pricing insights explaining:

* Demand impact
* Discount influence
* Inventory pressure
* Base price impact

---

## Future Improvements

* AWS deployment
* Kafka real-time streaming
* Redis caching
* Docker containerization
* Real-time market simulation
* Authentication system
* Database integration

---

## Author

Built by Ammetesh R
