import requests

def notifyMessage(text , phone_no):
    requests.post("http://127.0.0.1:5005/send-message" , json={
        "phone_number": phone_no,
        "message": text
    })