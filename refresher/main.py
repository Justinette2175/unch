from pymongo import MongoClient
import os, time, datetime, logging, re
from call_controller.backend import Backend

client = MongoClient(os.getenv('DB_HOST', 'db'), int(os.getenv('DB_PORT', '27017')))
db = client[os.getenv('DB_NAME', 'unch')]

def _get_contact_info(person):
    return db.contactinfos.find({ '_id': person['contactInfo'][0] })[0]

def _get_first_relation(person):
    return db.people.find({ '_id': person['network'][0] })[0]

def _update(viadoc, targetdoc, b):
    print('Updating information for user {}{}'.format(targetdoc['name'],
        '' if viadoc is targetdoc else ' via user {}'.format(viadoc['name'])))

    contactinfo = _get_contact_info(viadoc)

    if re.match('^555', contactinfo['phone']):
        time.sleep(2)
        print('Number {} not in service - Falling back to contact'.format(contactinfo['phone']))

        rel = _get_first_relation(targetdoc)
        return _update(rel, targetdoc, b)

    def _clear_stale():
        print('Successfully updated information for user {}{}'.format(targetdoc['name'],
              '' if viadoc is targetdoc else ' via user {}'.format(viadoc['name'])))
        db.contactinfos.update_one(
                {
                    'person': targetdoc['_id']
                }, {
                    '$set': {
                        'phone': '9178930453'
                    }
                })
        db.people.update_one(
                {
                    '_id': targetdoc['_id']
                }, {
                    '$set': {
                        'isUpdating': False,
                        'isStale': False
                    }
                })

    def _do_nothing():
        pass

    b.verify_and_dial(contactinfo['phone'], {
        'name': viadoc['name'],
        'other_name': targetdoc['name']
    },
    _do_nothing)

    b._callbacks['9178930453'] = _clear_stale
    b._callbacks['19178930453'] = _clear_stale

def _act(doc, b):
    res = db.people.update_one(
        {
            '_id': doc['_id'],
            'isStale': True,
            'isUpdating': { '$ne': True },
        }, {
            '$set': {
                'isUpdating': True,
                'updateStart': datetime.datetime.utcnow()
            } })
    if res.matched_count < 1:
        return

    print('updating user {}'.format(doc['_id']))

    try:
        _update(doc, doc, b)
    except Exception as e:
        logging.exception('during user update')
        return

while True:
    try:
        with Backend() as b:
            while True:
                for doc in db.people.find({ 'isStale': True }):
                    _act(doc, b)
                time.sleep(1)
    except Exception as e:
        logging.exception('in main loop')
    time.sleep(1)
