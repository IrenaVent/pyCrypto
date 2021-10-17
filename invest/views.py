from invest import app
from flask import jsonify, render_template, request
from invest.models import DBManager, RQCoinAPI

database_path = app.config.get("DATABASEPATH")
dbManager = DBManager(database_path)

url = "https://rest.coinapi.io/v1/exchangerate/{}/{}"
url_s = "https://rest.coinapi.io/v1/assets/{}"
requestToCoinAPI = RQCoinAPI(url)
requestToCoinAPIStatus = RQCoinAPI(url_s)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/v1/investments")
def transactions_list():
    try: 
        transactions = dbManager.querySQL("SELECT * FROM investments ORDER BY date;")

        all_transactions = {
            "status": "success",
            "investments": transactions
        }
       
    except Exception as error:

        all_transactions = {
            "status": "fail",
            "message": str(error)
        }
        return jsonify(all_transactions), 400

    return jsonify(all_transactions)

@app.route("/api/v1/investments/<int:id>", methods=['GET'])
def transaction(id):
    try: 
        transaction_request = """SELECT id, date, time, currency_from, amount_from, currency_to, amount_to
                                    FROM investments 
                                    WHERE id = ?;"""

        transaction = dbManager.querySQL(transaction_request, [id])

        if len(transaction) == 0:
            error = {
            "status": "fail",
            "message": "Transaction not found"
            }
            return jsonify(error), 400
        
        return jsonify(transaction)
    
    except Exception as error:
        error = {
            "status": "fail",
            "message": str(error)
            }
        return jsonify(error), 400

@app.route("/api/v1/investment", methods=["POST"])
def new_transaction():

    if request.json["message"] == "convert":
        
        if request.json["currency_from"] != "EUR":
            balance = check_balance_currency(request.json["currency_from"])
            
            if balance >= float(request.json["amount_from"]):
                return request_coinAPI()
            
            else:
                error = {
                    "status": "fail",
                    "message": "Not enough balance"
                    }
                return jsonify(error), 200

        else:
            return request_coinAPI()

    else:
        try:
            add = """INSERT INTO investments (date, time, currency_from, amount_from, currency_to, amount_to) 
                            values (:date, :time, :currency_from, :amount_from, :currency_to, :amount_to);"""

            dbManager.insertSQL(add, request.json)

            return jsonify({"status": "success"})

        except Exception as error:
            error = {
                "status": "fail",
                "message": str(error)
                }
            return jsonify(error), 400

def check_balance_currency(coin):
    check_balance_to = f"""SELECT SUM (amount_to) FROM investments WHERE currency_to = "{coin}";"""
    check_balance_from = f"""SELECT SUM (amount_from) FROM investments WHERE currency_from = "{coin}";"""

    total_to = dbManager.checkBalanceSQL(check_balance_to)
    total_from = dbManager.checkBalanceSQL(check_balance_from)

    balance = total_to - total_from

    return balance

def request_coinAPI():
    
    try:
        requestCoinAPI = float(requestToCoinAPI.requestCoin(request.json["currency_from"], request.json["currency_to"]))
        respuesta = {
            "status": "success",
            "amount-to": requestCoinAPI * float(request.json["amount_from"]),
            "unit-price": requestCoinAPI 
        }
        return jsonify(respuesta), 201

    except Exception as error:
        error = {
            "status": "fail",
            "message": str(error)
            }
        return jsonify(error), 400

@app.route("/api/v1/status")
def investments_status():

    try:
        coins_currency = dbManager.getCoinCurrency("SELECT * FROM investments ORDER BY date;")
        coins = "EUR,"
        for coin in coins_currency:
            coins += f"{coin},"

        usd_values_currency = requestToCoinAPIStatus.requestCoinStatus(coins)
        
        # total = balance € form coins
        usd_total_coins = 0
        for coin in coins_currency:
            balance = check_balance_currency(coin)
            usd_total_coin = balance * usd_values_currency[f"{coin}"]
            usd_total_coins += usd_total_coin

        total = usd_total_coins / usd_values_currency["EUR"]

        # invested € 
        check_balance_from = """SELECT SUM (amount_from) FROM investments WHERE currency_from = "EUR";"""
        invested = dbManager.checkBalanceSQL(check_balance_from)

        # outcome € 
        outcome = total - invested

        respuesta = {
                "status": "success",
                "data": {"invested": invested, "total": total, "outcome": outcome,}
            }
        return jsonify(respuesta), 200

    except Exception as error:
        error = {
            "status": "fail",
            "message": str(error)
            }
        return jsonify(error), 400















