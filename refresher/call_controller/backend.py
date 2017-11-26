from asterisk.ami import AMIClient, AMIClientAdapter
import re, random, logging
from . import config

logger = logging.getLogger(__name__)

class NumberFormatException(Exception):
  pass

class Backend:
  def __init__(self):
    self.client = None
    self.adapter = None

  def __enter__(self):
    client = AMIClient(address='asterisk', port=5038)
    client.login(username='asterisk',secret='asterisk')
    self.client = client
    self.adapter = AMIClientAdapter(self.client)
    self.client.add_event_listener(self._event_callback)
    return self

  def __exit__(self, *args):
    try:
      self.client.logoff()
      self.client.disconnect()
    finally:
      self.adapter = None
      self.client = None

  def _event_callback(self, event, source):
    try:
      if 'Channel' not in event or not re.match('^SIP/', event['Channel']):
        return

      if event.name == 'Hangup':
        self._hangup(event['CallerIDNum'])
      elif event.name == 'NewConnectedLine':
        self._connect(event['CallerIDNum'])

    except Exception:
      logger.exception('in AMI event handler')

  def _hangup(self, num):
    print('HANGUP: {}'.format(num))

  def _connect(self, num):
    print('CONNECT: {}'.format(num))

  def _do_call(self, user, data):
    future = self.adapter.Originate(
        Channel='LOCAL/{}@voipms-outbound'.format(user),
        Exten='1',
        Priority=1,
        Variable='UNCH_NAME={}|UNCH_OTHER_NAME={}'.format(data['name'], data['other_name']),
        Context='skiptheline',
        CallerID='"SkipTheLine" <{}>'.format(config.dial_in_number),
        Async='yes',
      )
    print('Originate result: {}'.format(future.response))

  def verify_and_dial(self, user, data):
    if not re.match('^(1?[0-9]{10}|4443)$', user):
      raise NumberFormatException()

    self._do_call(user, data)
