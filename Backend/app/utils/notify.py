import requests
import threading

def notifyMessage(text , phone_no):
    threading.Thread(target=send_message, args=(phone_no, text)).start()
    

def send_message(phone_number, message):
    requests.post("http://127.0.0.1:5005/send-message" , json={
        "phone_number": phone_number,
        "message": message
    })