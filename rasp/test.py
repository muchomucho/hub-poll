#!/usr/bin/python2

import requests

def request_url(uri, tag):
        r = requests.get('http://localhost:8888' + uri + '?uid={}'.format(tag))

request_url("/gauche", "tagdkjsfklsjfq")