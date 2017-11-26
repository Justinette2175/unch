from pymongo import MongoClient
import os, time, datetime, logging
from call_controller.backend import Backend

client = MongoClient(os.getenv('DB_HOST', 'db'), int(os.getenv('DB_PORT', '27017')))
db = client[os.getenv('DB_NAME', 'unch')]

def _update(doc):
    print('dialing!')
    with Backend() as b:
        b.verify_and_dial(doc['contactInfo']['phone'], {
            'name': doc['name'],
            'other_name': 'Linus Torvalds'
        })

def _act(doc):
    res = db.users.update_one(
        {
            '_id': doc['_id'],
            'stale': True
        }, {
            '$set': {
                'stale': False,
                'updating': True,
                'updateStart': datetime.datetime.utcnow()
            } })
    if res.matched_count < 1:
        return

    def _finished(success):
        change = {
                'updating': not success
            }
        res = db.users.update_one(
            {
                '_id': doc['_id'],
            },
            { '$set': change }
        )

    print('updating user {}'.format(doc['_id']))

    try:
        _update(doc)
    except Exception as e:
        logging.exception('during user update')
        _finished(False)
        return

    _finished(True)

while True:
    for doc in db.users.find({ 'stale': True }):
        _act(doc)
    time.sleep(1)
