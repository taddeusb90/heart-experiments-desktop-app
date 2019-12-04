import { Component, OnInit } from "@angular/core";
import { SerialportService } from "../../services/serialport/serialport.service";
import { WebcamImage } from 'ngx-webcam';


@Component({
  selector: "app-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"]
})
export class SessionComponent implements OnInit {
  public webcamImage : WebcamImage = null;
  
  constructor(private SerialportSrv: SerialportService) {}

  handleImage = (webcamImage: WebcamImage) => {
    this.webcamImage = webcamImage;
  }


  ngOnInit(): void {
    this.SerialportSrv.serialPort
      .list()
      .then((ports: any) => {
        console.log("=========>", ports);
      })
      .catch((err: any) => {
        console.log("=========>", err);
      });
  }
}
