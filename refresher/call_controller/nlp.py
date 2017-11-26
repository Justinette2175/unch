import re

numbers = {
        'bell': '4385035359'
    }

def map_number(text):
    for k, v in numbers.items():
        if re.search(k, text, re.IGNORECASE):
            return v

    # XXX
    return '4385035359'
