import os , time
import threading
from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

app = Flask(__name__)

chrome_options = Options()
user_data_dir = os.path.expanduser("~/whatsapp-session")
chrome_options.add_argument(f"user-data-dir={user_data_dir}")
chrome_options.add_argument("--disable-blink-features=AutomationControlled")
chrome_options.add_argument("--start-maximized")
chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
chrome_options.add_experimental_option('useAutomationExtension', False)
    
driver = webdriver.Chrome(options=chrome_options)
driver.set_page_load_timeout(60)

def whatsapp_goto(url):
    global driver

    driver.get(url)
    WebDriverWait(driver, 25).until(
        EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/div/div/div/div/div[3]/div/div[4]/div/div[1]/div/div[2]/div/div/div[1]/p"))
    )
    print("WhatsApp Web loaded successfully!")

def send_message(phone_number, message):
    try:
        whatsapp_goto(f'https://web.whatsapp.com/send?phone={phone_number}&text={message}')
        time.sleep(2)
        # if driver.page_source.find("Phone number shared via url is invalid.") != -1:
        #     return False, "This number is invalid or not registered"
        try:
            InvalidNumber = WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div/div/div/div/span[2]/div/span/div/div/div/div/div/div[2]/div/button'))
            )

            if InvalidNumber:
                InvalidNumber.click()
                return False, "This number is invalid or not registered"
        except Exception:
            pass
        
        
        WebDriverWait(driver, 25).until(
            EC.presence_of_element_located((By.XPATH, "//button[@aria-label='Send']"))
        ).click()

        # if this xpath comes means number is invalid xpath=//*[@id="app"]/div/div/span[2]/div/span/div/div/div/div/div/div[1]


        
        return True, "Message sent successfully!"
    except Exception as e:
        return False, f"Error sending message: {str(e)}"

@app.route('/send-message', methods=['POST'])
def api_send_message():
    try:
        data = request.json
        phone_number = data.get('phone_number')
        message = data.get('message')
        
        if not phone_number or not message:
            return jsonify({
                'status': 'error',
                'message': 'phone_number and message are required'
            }), 400
        
        success, msg = send_message(phone_number, message)
        
        return jsonify({
            'status': 'success' if success else 'error',
            'message': msg
        }) , 200 if success else 500
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

def run_flask():
    app.run(host='0.0.0.0', port=5005)

if __name__ == '__main__':
    whatsapp_goto('https://web.whatsapp.com/')
    threading.Thread(target=run_flask, daemon=True).start()
    while True:
        time.sleep(1)