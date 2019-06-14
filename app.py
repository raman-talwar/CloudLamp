import requests
from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import Adafruit_DHT
from Adafruit_CCS811 import Adafruit_CCS811
from RPi import GPIO
import time
from database.DP1Database import Database
from weerrgb.models.LCD2 import LCD2
from weerrgb.models.SerialPort import SerialPort
GPIO.setwarnings(False)
ser = SerialPort("/dev/ttyUSB0", 9600, timeout=8)
mijn_locaties = []
mijn_locaties_met_status=[]
geselecteerd = ""
led_locatie = 1
klap = 0
GPIO.setmode(GPIO.BCM)
ccs = Adafruit_CCS811()
mic = 25
GPIO.setup(mic, GPIO.IN)
# GPIO.setup(mic, GPIO.IN,pull_up_down=GPIO.PUD_DOWN)
starttijd = 0
vorige_starttijd = 0
from subprocess import check_output
ips = check_output(['hostname', '--all-ip-addresses'])
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)
conn = Database(app=app, user='mct', password='mct', db='cloudlamp')

ser.send(ips.decode().split(" ")[1])

@app.route('/hallo')
def hello_world():
    return jsonify('Hello World!')


# @app.route('/api/v1/locaties')
# def getLocaties():
#     fo = open("city.list.json")
#     contents = fo.read()
#     return contents

@app.route('/api/v1/locaties/<code>')
def getspecifiekeLocaties(code):
    result = conn.get_data(
        "select * from locaties where locatienaam like '%{0}%' order by (CHAR_LENGTH(locatienaam)) limit 50 ".format(
            code))
    return jsonify(result)
@app.route('/api/v1/historiek')
def gethistoriek():
    result = conn.get_data("SELECT hour(datetime) as 'uur',sensorID,avg(Value) as 'waarde' FROM historiek where historiek.datetime >= now() - INTERVAL 1 DAY group by hour(datetime),sensorID order by datetime desc limit 12")
    return jsonify(result)

@socketio.on("connect")
def connecting():
    co2 = "NULL"
    humidity, temperature = Adafruit_DHT.read_retry(11, 4)
    while not ccs.available():
        pass
    if ccs.available():
        if not ccs.readData():
            co2 = ccs.geteCO2()
        else:
            print("ERROR!")
    result = {'Temp': temperature, "Humidity": humidity, "CO2": co2}
    socketio.emit("new_data", result)
    socketio.emit("locaties", mijn_locaties)
    socketio.emit("weerbericht", [geselecteerd, mijn_locaties])
    print("Connection with client established")

@socketio.on("locatie_toevoegen")
def voeg_toe(data):
    if data not in mijn_locaties:
        mijn_locaties.append(data)
        result = ''
        for i in mijn_locaties:
            if (mijn_locaties.index(i) == len(mijn_locaties) - 1):
                result += i
            else:
                result += i + ','
        if (result):
            response = requests.get(
                "http://api.openweathermap.org/data/2.5/group?id={0}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl".format(
                    result))
            mijn_locaties_met_status.clear()
            for i in response.json()["list"]:
                mijn_locaties_met_status.append(i['name'])
                mijn_locaties_met_status.append(str(i['weather'][0]['id']))
                mijn_locaties_met_status.append(str(i['weather'][0]['description']))
            print(mijn_locaties_met_status)


@socketio.on("locatie_verwijderen")
def verwijder(data):
    print("Dit zijn de te verwijderen locaties")
    print(data)
    for i in mijn_locaties:
        if i in data:
            mijn_locaties.remove(i)
    result=""
    for i in mijn_locaties:
        if (mijn_locaties.index(i) == len(mijn_locaties) - 1):
            result += i
        else:
            result += i + ','
    if (result):
        response = requests.get(
            "http://api.openweathermap.org/data/2.5/group?id={0}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl".format(
                result))
        mijn_locaties_met_status.clear()
        for i in response.json()["list"]:
            mijn_locaties_met_status.append(i['name'])
            mijn_locaties_met_status.append(str(i['weather'][0]['id']))
            mijn_locaties_met_status.append(str(i['weather'][0]['description']))

# @socketio.on("geef_locaties")
# def stuur_locaties():
#     socketio.emit("locaties", mijn_locaties)
# @socketio.on("get_dht")
# def geef_data():
# humidity, temperature = Adafruit_DHT.read_retry(11, 4)
# result = {'Temp': temperature, "Humidity": humidity}
# socketio.emit("new_dht", result)
@socketio.on("nieuw_geselecteerd")
def nieuw_geselecteerd(data):
    global geselecteerd
    geselecteerd = data


import threading


def geef_data():
    co2 = "NULL"
    humidity, temperature = Adafruit_DHT.read_retry(11, 4)
    while not ccs.available():
        pass
    if ccs.available():
        if not ccs.readData():
            co2 = ccs.geteCO2()
            # print("CO2: ", co2, "ppm")
        else:
            print("ERROR!")
    if(co2>2000):
        ser.send("alarm?hoog?CO2 te hoog")
    result = {'Temp': temperature, "Humidity": humidity, "CO2": co2}
    socketio.emit("new_data", result)
    result = ''
    for i in mijn_locaties:
        if (mijn_locaties.index(i) == len(mijn_locaties) - 1):
            result += i
        else:
            result += i + ','
    if(result):
        response = requests.get(
            "http://api.openweathermap.org/data/2.5/group?id={0}&appid=592b8578513fd9bbe46c56aa0ea44663&units=metric&lang=nl".format(
                result))
        mijn_locaties_met_status.clear()
        for i in response.json()["list"]:
            mijn_locaties_met_status.append(i['name'])
            mijn_locaties_met_status.append(str(i['weather'][0]['id']))
            mijn_locaties_met_status.append(str(i['weather'][0]['description']))
        print(mijn_locaties_met_status)
        ser.send(mijn_locaties_met_status[led_locatie - 1] + '?' + mijn_locaties_met_status[led_locatie] + '?' +
                 mijn_locaties_met_status[led_locatie + 1])

    threading.Timer(360, geef_data).start()
    conn.set_data("insert into historiek(sensorID, Value) value(3,%s)", co2)
    conn.set_data("insert into historiek(sensorID, Value) value(1,%s)", humidity)
    conn.set_data("insert into historiek(sensorID, Value) value(2,%s)", temperature)

geef_data()


import threading
#
#
# def geef_ip():
#     global ips
#     ips = check_output(['hostname', '--all-ip-addresses'])
#     ser.send(ips.decode().split(" ")[1])
#     threading.Timer(60, geef_ip).start()
#
# geef_ip()


def doe_iets(pinnummer):
    a=GPIO.input(pinnummer)
    print(a)
    global klap
    global starttijd
    global vorige_starttijd
    global led_locatie

    starttijd = time.time()
    # print(starttijd)
    klap += 1

    # print(klap)
    if (starttijd - vorige_starttijd <= 1):
        print('er is 2 keer geklapt')
        print(mijn_locaties_met_status)
        if len(mijn_locaties_met_status)!=0:
            led_locatie += 3

            if led_locatie > len(mijn_locaties_met_status) - 1:
                global ips
                ips = check_output(['hostname', '--all-ip-addresses'])
                ser.send(ips.decode().split(" ")[1])
                led_locatie = -2
            else:
                ser.send(mijn_locaties_met_status[led_locatie-1]+'?'+mijn_locaties_met_status[led_locatie]+'?'+mijn_locaties_met_status[led_locatie+1])
            # ser.send(mijn_locaties_met_status[led_locatie])
            # lcd.init()
            # lcd.write_message(mijn_locaties_met_status[led_locatie+1])
            # lcd.set_address(0x40)
            # lcd.write_message(mijn_locaties_met_status[led_locatie-1])
        # else:
        #     global ips
        #     ips = check_output(['hostname', '--all-ip-addresses'])
        #     ser.send(ips.decode().split(" ")[1])
    else:
        print( "start"+str(time.time()))
        # ser.send(mijn_locaties_met_status[led_loc.replace(" ","_")atie])
        # ser.send("800")
        # lcd.init()

        # ser.send(ips.decode().split(" ")[1])
        # print("stop"+str((time.time())))
        vorige_starttijd = time.time()
        # time.sleep(0.5)
print("hallo")

GPIO.add_event_detect(mic, GPIO.FALLING, doe_iets, 200)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=1)
