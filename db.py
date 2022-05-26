from pymongo import MongoClient


def setup_db(version=None):
    """
    If using version 'local' mongo instance, make sure to start running it, i.e.
    `mongod --config /usr/local/etc/mongod.conf`

    If setting up any meteor db on local, restore from the bson data dump, i.e.
    `mongorestore -h 127.0.0.1 --port 27017 -d staging-ce-platform-dtr study-dump-dtr-Wed\ Sep\ 19\ 19:50:16\ CDT\ 2018/staging-ce-platform-dtr`
    `mongorestore -h 127.0.0.1 --port 27017 -d ce-platform-olin study-dump-olin-Wed\ Sep\ 19\ 19:50:16\ CDT\ 2018/ce-platform-olin`
    """
    if version == 'staging':
        # uri = "mongodb://collective-experience:st3lla@ds145722-a0.mlab.com:45722,ds145722-a1.mlab.com:45722/staging-ce-platform-dtr?replicaSet=rs-ds145722"
        uri = "mongodb+srv://collective-experience:st3lla@cluster0.j0elu.mongodb.net/ce-platform-1?retryWrites=true&w=majority&ssl=true"
        dbName = 'staging-ce-platform-dtr'
    elif version == 'local':
        uri = 'mongodb://127.0.0.1:27017'
        dbName = 'test'
    elif version == 'local-dtr':
        uri = 'mongodb://127.0.0.1:27017'
        dbName = 'staging-ce-platform-dtr'
    elif version == 'local-olin':
        uri = 'mongodb://127.0.0.1:27017'
        dbName = 'ce-platform-olin'
    elif version == 'production':
        # uri = 'mongodb://collective-experience:st3lla@cluster0-shard-00-00.j0elu.mongodb.net:27017,cluster0-shard-00-01.j0elu.mongodb.net:27017,cluster0-shard-00-02.j0elu.mongodb.net:27017/ce-platform-1?ssl=true&replicaSet=atlas-p1101t-shard-0&authSource=admin&retryWrites=true&w=majority'
        uri = "mongodb+srv://collective-experience:st3lla@cluster0.j0elu.mongodb.net/ce-platform-1?retryWrites=true&w=majority&ssl=true"
        dbName = 'ce-platform-1'
    elif version == 'meteor':
        uri = 'mongodb://127.0.0.1:3001'
        dbName = 'meteor'
    else:
        print("Invalid version input to `setup_db`")
        return

    client = MongoClient(uri)
    db = client[dbName]
    return db