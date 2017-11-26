import logging
from bottle import request, response, Bottle
from backend import NumberFormatException
import nlp, facebook

logger = logging.getLogger(__name__)

class BackendRest:
  def __init__(self, backend):
    self.backend = backend
    self.app = Bottle()
    self.app.route('/sms', callback=self.sms)
    self.app.route('/facebook', 'GET', callback=self.facebook_challenge)
    self.app.route('/facebook', 'POST', callback=self.facebook_event)

  def run(self, host='0.0.0.0', port=8080):
    self.app.run(host=host, port=port)

  def sms(self):
    print(request.query)

    if request.query['key'] != 'O6MomrERb8gH6Q':
      response.status = 403
      return 'Access denied'

    try:
      self.backend.verify_and_dial(request.query['from'], nlp.map_number(request.query['message']))
      return 'OK'
    except NumberFormatException:
      response.status = 400
      return 'Invalid number'
    except Exception:
      logger.exception('Exception in dial')
      response.status = 500
      return 'Internal error'

  def facebook_challenge(self):
    if 'hub.verify_token' not in request.query or request.query['hub.verify_token'] != facebook.VERIFY_TOKEN:
        response.status = 403
        return 'Access denied'

    return request.query['hub.challenge']

  def facebook_event(self):
    print(request.json)
    try:
        number = request.json['entry'][0]['messaging'][0]['message']['text']
        self.backend.verify_and_dial(number, nlp.map_number('bell'))
        facebook.send_message('We will call you back in a few minutes!', request.json['entry'][0]['messaging'][0]['sender']['id'])
    except NumberFormatException:
        facebook.send_message('Ok, what is your phone number?', request.json['entry'][0]['messaging'][0]['sender']['id'])
    except Exception:
        logger.exception('in facebook handler')

    return 'OK'

if __name__ == '__main__':
    from backend import Backend
    with Backend() as b:
      br = BackendRest(b)
      br.run()
