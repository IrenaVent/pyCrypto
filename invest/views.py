from invest import app
from flask import jsonify, render_template, request
from invest.models import DBManager, requestCoinAPI

database_path = app.config.get("DATABASEPATH")
dbManager = DBManager(database_path)
url = "https://rest.coinapi.io/v1/exchangerate/{}/{}"
requestToCoinAPI = requestCoinAPI(url)

# dbManager = DBManager("data/investments.db") 

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
def add_transaction():

    if request.json["currency_from"] != "EUR":

        check_balance_to = f"""SELECT SUM (amount_to) FROM investments WHERE currency_to = "{request.json["currency_from"]}";"""
        check_balance_from = f"""SELECT SUM (amount_from) FROM investments WHERE currency_from = {request.json["currency_from"]};"""

        total_to = dbManager.checkBalanceSQL(check_balance_to)
        total_from = dbManager.checkBalanceSQL(check_balance_from)
        balance = total_to - total_from

        if balance >= int(request.json["amount_from"]):
            requestCoinAPI = float(requestToCoinAPI.requestCoin(request.json["currency_from"], request.json["currency_to"]))
            print("soy respuesta de COINAPI----->", requestCoinAPI)
            respuesta = {
                "amount-to": requestCoinAPI * int(request.json["amount_from"]),
                "unit-price": requestCoinAPI 
            }
            return jsonify(respuesta)

    else:
    
        add = """INSERT INTO investments (date, time, currency_from, amount_from, currency_to, amount_to) 
                        values (:date, :time, :currency_from, :amount_from, :currency_to, :amount_to);"""

        dbManager.insertSQL(add, request.json)

        return jsonify({"status": "success"})
