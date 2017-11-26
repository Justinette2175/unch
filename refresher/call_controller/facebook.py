import requests

VERIFY_TOKEN = 'EAAcNsbDi9h8BAJ0esbl6RVpR4Lgbg5sEMpuM2wlV4J0pFhXfspMTema0ZAYiD'
# {'object': 'page', 'entry': [{'id': '365731253880365', 'time': 1506267333916, 'messaging': [{'sender': {'id': '2123857697640337'}, 'recipient': {'id': '365731253880365'}, 'timestamp': 1506267333577, 'message': {'mid': 'mid.$cAAEWUjMep_Jk5czLyVetIeDpMmJD', 'seq': 694317, 'text': 'Sup'}}]}]}

# {
#   "recipient": {
#           "id": "<PSID>"
#             },
#     "message": {
#             "text": "hello, world!"
#               }
# }' "https://graph.facebook.com/v2.6/me/messages?access_token=<PAGE_ACCESS_TOKEN>

PAGE_ACCESS_TOKEN = 'EAAcNsbDi9h8BAJ0esbl6RVpR4Lgbg5sEMpuM2wlV4J0pFhXfspMTema0ZAYiD0RD6QXsoANrW3R0NY7tZC7TgLGz6MUZCs2mMSvw1pRkZB9Q81AxlXjyXF90DlX49ZCS9WZAmCJtbYQjrIIRJZB5fq643jZAkwu0GfRAfRu9qZBBxLgZDZD'

def send_message(message, recipient):
    json = {
            "recipient": {
                "id": recipient
            },
            "message": {
                "text": message
            }
        }
    print(requests.post('https://graph.facebook.com/v2.6/me/messages', params={"access_token": PAGE_ACCESS_TOKEN}, json=json))
