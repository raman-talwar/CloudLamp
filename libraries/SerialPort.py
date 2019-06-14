import serial


class SerialPort:
    def __init__(self, port="/dev/serial0", bauds=9600, timeout=8) -> None:
        super().__init__()
        self.__port = port
        self.__bauds = bauds
        self.__timeout = timeout
        self.__ser = serial.Serial(port, bauds, timeout)
        # self.__ser = serial.Serial("/dev/serial0", 9600, timeout=2)

    ####################################
    def __str__(self) -> str:
        return super().__str__()

    ####################################
    @property
    def port(self):
        return self.__port

    ####################################
    @property
    def bauds(self):
        return self.__bauds

    ####################################

    @property
    def ser(self):
        return self.__ser

    ####################################
    def send(self, boodschap: str):
        self.ser.write(boodschap.encode('utf-8'))
        # self.ser.write(boodschap)

    def read(self):
        antwoord = self.ser.readline()
        return antwoord.decode()

    def close(self):
        self.ser.close()
