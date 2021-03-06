# .pyCrypto

## Description

.pyCrypto is an application to increase your bitcoins investments

# Instructions to run

## Create the virtual environment

```
python -m venv venv
```

## Activate the virtual environment

```
. venv/bin/activate
```

## Install application's dependencies

```
pip install -r requirements.txt
```

## Create DB database

Create data folder inside create databse, which structure definition is on migrations folder.

Type in your terminal:

```
cd data/
```

```
sqlite3 investments.db
```

After that copy the code into migration folder and paste in your terminal, press enter

Close database

```
.q
```

```
cd ..
```

## Rename

Rename .env_template to .env and select FLASK_ENV environment.

Raneme config_template.py to config.py

### config.py

If you created the database in data folder for DATABASEPATH copypaste:

```
"data/investments.db"
```

Type your APIKEY from CoinAPI, you can get it on the next link:

[CoinAPI.io](https://www.coinapi.io/)

## Start

To run, make sure you have activated the virtual environment, type on your terminal:

```
flask run
```
