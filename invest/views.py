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
        transactions = dbManager.querySQL("select * from investments order by date;")

        all_transactions = {
            "status": "success",
            "investments": transactions
        }
       
    except Exception as error:

        all_transactions = {
            "status": "fail",
            "message": str(error)
        }
        return jsonify(all_transactions),400

    return jsonify(all_transactions)

