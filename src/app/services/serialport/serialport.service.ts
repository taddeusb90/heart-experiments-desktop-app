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
  private confirmation: Subject<string> = new Subject<string>();

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
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  private getConfirmation = (line: string): void => {
    console.log(`> ${line}`);
    this.confirmation.next(line)
  } 

  public sendMessageToBoard(message): void {
    this.port.write(`${message}\r\n`)
    this.confirmation
      .asObservable()
      .subscribe(data=> console.log(`confirmation> ${data}`));
  }

}
