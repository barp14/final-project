from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    # Configura a conexão MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:932545@localhost/project'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
