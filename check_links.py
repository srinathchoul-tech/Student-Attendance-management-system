import requests
from bs4 import BeautifulSoup
r = requests.get('http://127.0.0.1:8000/index.html')
print('Status:', r.status_code)
soup = BeautifulSoup(r.text, 'html.parser')
for link in soup.find_all('link', rel='stylesheet'):
    print('stylesheet:', link.get('href'))
for script in soup.find_all('script'):
    if script.get('src'):
        print('script:', script.get('src'))
