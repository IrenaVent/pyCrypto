from invest import app
from flask import jsonify, render_template, request
from invest.models import DBManager

database_path = app.config.get("DATABASEPATH")
dbManager = DBManager(database_path) 

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
        


