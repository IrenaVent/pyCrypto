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

    def insertSQL(self, consulta, params):
        conexion = sqlite3.connect(self.database_path)

        cur = conexion.cursor()

        cur.execute(consulta, params)
        conexion.commit()
        conexion.close()

    def checkBalanceSQL(self, consulta, params = []):
        conexion = sqlite3.connect(self.database_path)

        cur = conexion.cursor()

        try:
            cur.execute(consulta,params)
            total_sum = cur.fetchone()[0]

        except:
            total_sum = 0
        
        conexion.close()

        return total_sum

class requestCoinAPI():
    def __init__(self, url):
        self.url = url
    
    def requestCoin(self, currency_from, currency_to):
        headers = {"X-CoinAPI-Key": apikey}
        self.currency_from = currency_from
        self.currency_to = currency_to
        request = requests.get((self.url).format(self.currency_from, self.currency_to), headers = headers)
        return request.json()["rate"]






        
