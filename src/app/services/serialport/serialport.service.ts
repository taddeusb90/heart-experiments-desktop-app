import { Injectable } from "@angular/core";
import * as SerialPort from "serialport";

@Injectable({
  providedIn: "root"
})
export class SerialportService {
  serialPort: typeof SerialPort;
  constructor() {
    // if (this.isElectron()) {
    this.serialPort = window.require("serialport");
    // }
  }
}
