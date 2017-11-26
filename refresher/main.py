from pymongo import MongoClient
import os, time, datetime, logging
from call_controller.backend import Backend

client = MongoClient(os.getenv('DB_HOST', 'db'), int(os.getenv('DB_PORT', '27017')))
db = client[os.getenv('DB_NAME', 'unch')]

def _get_contact_info(person):
    return db.contactinfos.find({ '_id': person['contactInfo'][0] })[0]

def _update(doc):
    print('dialing!')
    with Backend() as b:
        b.verify_and_dial(_get_contact_info(doc)['phone'], {
            'name': doc['name'],
            'other_name': 'Linus Torvalds'
        })

def _act(doc):
    res = db.people.update_one(
        {
            '_id': doc['_id'],
            'isStale': True
        }, {
            '$set': {
                'isStale': False,
                'isUpdating': True,
                'updateStart': datetime.datetime.utcnow()
            } })
    if res.matched_count < 1:
        return

    def _finished(success):
        change = {
                'isUpdating': not success
            }
        res = db.people.update_one(
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
    for doc in db.people.find({ 'isStale': True }):
        _act(doc)
    time.sleep(1)
