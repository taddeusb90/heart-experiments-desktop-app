import { Injectable } from "@angular/core";
import * as SerialPort from "serialport";
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: "root"
})
export class SerialportService {
  static instance: SerialportService;
  public serialPort: typeof SerialPort;
  public arduinoSerialPortDetails: any; 
  public arduinoSerialPort: any;
  public port: any;
  public parser: any;
  public confirmationSubject: Subject<string> = new Subject<string>();
  public confirmationObservable: Observable<string>;

  constructor() {
    if (!SerialportService.instance) {
      SerialportService.instance = this;
    }
    this.serialPort = window.require("serialport");
    return SerialportService.instance;
  }

  public init(): void {
    const { parsers: { Readline } } = this.serialPort;
    const serialPort = this.serialPort;
    this.serialPort
      .list()
      .then((ports: any) => {
        this.arduinoSerialPortDetails = ports.filter(port => port.manufacturer && port.manufacturer.indexOf('arduino') > -1)[0];
        this.port = new serialPort(this.arduinoSerialPortDetails.comName, { baudRate: 9600 });
        setTimeout(()=> this.port.write(`INIT\r\n`), 500);
        this.parser = this.port.pipe(new Readline({delimiter: '\r\n'}));
        this.parser.on('data', this.getConfirmation);

        this.confirmationObservable = this.confirmationSubject.asObservable();
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  private getConfirmation = (line: string): void => {
    this.confirmationSubject.next(line)
  } 

  public sendMessageToBoard(message): void {
    this.port.write(`${message}\r\n`);
  }

}
