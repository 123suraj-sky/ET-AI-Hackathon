import pickle

def arima_forecast(train_data, test_data):
    model = auto_arima(
        train_data,
        seasonal=True,
        m=12,
        suppress_warnings=True,
        stepwise=True
    )

    # Save model
    with open("arima_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Model saved successfully!")

    forecast = model.predict(n_periods=len(test_data))
    return pd.Series(forecast, index=test_data.index)