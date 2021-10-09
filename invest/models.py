import sqlite3

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





        
