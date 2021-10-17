import sqlite3
from invest import app
import requests

apikey = app.config.get("APIKEY")


class DBManager():
    def __init__(self, database_path):
        self.database_path = database_path

    def querySQL(self, query, params = []):
        conexion = sqlite3.connect(self.database_path)

        cur = conexion.cursor()
        cur.execute(query, params)

        keys = []
        for item in cur.description:
            keys.append(item[0])        

        # TODO change var's name
        registros = []
        for registro in cur.fetchall():
            ix_clave = 0
            d = {}
            for columna in keys:
                d[columna] = registro[ix_clave]
                ix_clave += 1
            registros.append(d)
 
        conexion.close()
        return registros

    def getCoinCurrency(self, query, params = []):

        transactions = self.querySQL(query)
    
        coins_currency = []
        for transaction in transactions:
            if transaction["currency_from"] not in coins_currency and transaction["currency_from"] != "EUR":
                coins_currency.append(transaction["currency_from"])
            if transaction["currency_to"] not in coins_currency and transaction["currency_to"] != "EUR":
                coins_currency.append(transaction["currency_to"])

        return coins_currency

    def insertSQL(self, consulta, params):
        conexion = sqlite3.connect(self.database_path)

        cur = conexion.cursor()

        cur.execute(consulta, params)
        conexion.commit()
        conexion.close()

    def checkBalanceSQL(self, consulta, params = []):
        conexion = sqlite3.connect(self.database_path)

        cur = conexion.cursor()

        cur.execute(consulta,params)
        total_sum = cur.fetchone()[0]

        conexion.close()
        return total_sum

class RQCoinAPI():
    def __init__(self, url, params = []):
        self.url = url
    
    def requestCoin(self, currency_from, currency_to):
        headers = {"X-CoinAPI-Key": apikey}
        self.currency_from = currency_from
        self.currency_to = currency_to
        request = requests.get((self.url).format(self.currency_from, self.currency_to), headers = headers)
        return request.json()["rate"]

    def requestCoinStatus(self, params):
        headers = {"X-CoinAPI-Key": apikey}
        self.params = params

        request = requests.get((self.url).format(self.params), headers = headers)
        dicUSDValues = request.json()

        dicValues = {}
        for dicCoin in dicUSDValues:
            dicValues.update({dicCoin['asset_id']:dicCoin['price_usd']})

        return dicValues





        
