import { Component, OnInit } from "@angular/core";
import { SerialportService } from "../../services/serialport/serialport.service";
import { WebcamImage } from 'ngx-webcam';
import { BEGIN, CONTINUE, RESET, PAUSE, END, HOME } from '../../constants/messages';

@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"]
})
export class SessionComponent implements OnInit {
  public webcamImage : WebcamImage = null;
  public arduinoSerialPortDetails: any; 
  public arduinoSerialPort
  constructor(private SerialportSrv: SerialportService) {}

  handleImage = (webcamImage: WebcamImage) => {
    this.webcamImage = webcamImage;
  }


  ngOnInit(): void {
    const { serialPort, serialPort: { parsers: { Readline } } } = this.SerialportSrv;
    serialPort
      .list()
      .then((ports: any) => {
        this.arduinoSerialPortDetails = ports.filter(port => port.manufacturer && port.manufacturer.indexOf('arduino') > -1)[0];
        console.log("=========>", ports);
        const port = new serialPort(this.arduinoSerialPortDetails.comName, { baudRate: 9600 });
        setTimeout(()=> port.write(`INIT\r\n`), 500);
        // setTimeout(()=> port.write(`${BEGIN}\r\n`), 1000);
        setTimeout(()=> port.write(`${HOME}\r\n`), 1000);
        
        let i = 0;
        const cont = () => {
          setTimeout(() => { 
            port.write(`${CONTINUE}\r\n`)
            i++;
            if (i < 2000)
              cont();
          }, 500);

          if (i > 2000) {
            setTimeout(()=> port.write(`${PAUSE}\r\n`), 1000);
          
            setTimeout(()=> port.write(`${RESET}\r\n`), 3000);
            
            // setTimeout(()=> port.write(`${END}\r\n`), 12000);
          }

        };
        cont();
        
        
        
        const parser = port.pipe(new Readline({delimiter: '\r\n'}));
        parser.on('data', line => console.log(`> ${line}`))
        
      })
      .catch((err: any) => {
        console.log("=========>", err);
      });
  }
}
