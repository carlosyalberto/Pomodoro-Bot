from base64 import encode
from datetime import datetime
from sqlite3 import ProgrammingError
import mysql.connector
from config import HOST, USER, PASSWD, DB

def db_insert(date, user, feeling):
  
    db = mysql.connector.connect(
      host=HOST,
      user=USER,
      passwd=PASSWD,
      db=DB
    )
    c = db.cursor()

    user = str(user)
    """ user = user.encode('utf8') """
    feeling = str(feeling)

    query = "INSERT INTO datos_usuario VALUES (NULL, \"{0}\", \"{1}\", \"{2}\", \"{3}\", \"{4}\")".format(str(date).split(" ")[0], str(date), str(date.strftime('%A')), user, feeling)

    try:
      c.execute(query)
      # Make sure data is committed to the database
      db.commit()

      # Close
      c.close()
      db.close()
    
    except ProgrammingError as pe:
      print("Ocurrió un problema: {}".format(pe))