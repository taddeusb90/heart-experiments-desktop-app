import { Component, OnInit } from "@angular/core";
import { SerialportService } from "../serialport.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor(private SerialportSrv: SerialportService) {}

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
