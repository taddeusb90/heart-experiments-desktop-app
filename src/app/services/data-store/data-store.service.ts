import { Injectable } from "@angular/core";
// import { Database } from "sqlite3";
import { open } from "sqlite";
import { WORK_FOLDER } from "../../constants/file-system";

@Injectable({
  providedIn: "root",
})
export class DataStoreService {
  static instance: DataStoreService;
  public sqlite: any;
  public sqlite3: any;
  private db: any;
  public rows: Array<any>;

  constructor() {
    if (!DataStoreService.instance) {
      DataStoreService.instance = this;
    }
    this.sqlite = window.require("sqlite");
    this.sqlite3 = window.require('sqlite3').verbose();
    this.db = this.sqlite
      .open({
        filename: `${WORK_FOLDER}/heart-experiments.db`,
        driver: this.sqlite3.Database,
      })
      .then((db) => {
        db.exec(
          "CREATE TABLE IF NOT EXISTS [heart_experiments].sessions (id INTEGER PRIMARY KEY, session INTEGER NOT NULL, created_at DATE NOT NULL);"
        );
        db.exec(
          "CREATE TABLE IF NOT EXISTS [heart_experiments].session_info (id INTEGER PRIMARY KEY, session_id INTEGER NOT NULL, created_at DATE NOT NULL, image_location TEXT NOT NULL, spectro_metric REAL NOT NULL, type TEXT NOT NULL);"
        );
      });
    // new this.sqlite3.Database(`${WORK_FOLDER}/heart-experiments.db`);
    // this.db.serialize(() => {
    //   this.db.run(
    //     "CREATE TABLE IF NOT EXISTS [heart_experiments].sessions (id INTEGER PRIMARY KEY, session INTEGER NOT NULL, created_at DATE NOT NULL);"
    //   );
    //   this.db.run(
    //     "CREATE TABLE IF NOT EXISTS [heart_experiments].session_info (id INTEGER PRIMARY KEY, session_id INTEGER NOT NULL, created_at DATE NOT NULL, image_location TEXT NOT NULL, spectro_metric REAL NOT NULL, type TEXT NOT NULL);"
    //   );
    // });

    // this.db.serialize(() => {});
    return DataStoreService.instance;
  }

  public insertSession(sessionValue: any): Promise<any> {
    const { session, created_at } = sessionValue;
    return this.db.run(
      "INSERT INTO  [heart_experiments].sessions(session, created_at) VALUES (:session, :created_at)",
      { ":session": session, ":created_at": created_at }
    );

    // return this.db.serialize(() => {
    //   return this.db.run(
    //     "INSERT INTO  [heart_experiments].sessions(session, created_at) VALUES (?, ?)",
    //     [session, created_at]
    //   );
    // });
  }

  public insertSessionInfo(sessionInfo: any): Promise<any> {
    const {
      sessionId,
      createdAt,
      imageLocation,
      spectroMetric,
      type,
    } = sessionInfo;
    return this.db.run(
      "INSERT INTO [heart_experiments].session_info(session_id, created_at, image_location, spectro_metric, type) VALUES (:session_id, :created_at, :image_location, :spectro_metric, :type);",
      {
        ":session_id": sessionId,
        ":created_at": createdAt,
        ":image_location": imageLocation,
        ":spectro_metric": spectroMetric,
        ":type": type,
      }
    );
    // return this.db.serialize(() => {
    //   return this.db.run(
    //     "INSERT INTO [heart_experiments].session_info(session_id, created_at, image_location, spectro_metric, type) VALUES (?, ?, ?, ?, ?)",
    //     [sessionId, createdAt, imageLocation, spectroMetric, type]
    //   );
    // });
  }

  public getAllSessions(): any {
    // return this.db.serialize(() => {
    //   return this.db.run("SELECT * FROM  [heart_experiments].sessions");
    // });
  }

  public getAllSessionInfo(sessionId): any {
    // return this.db.serialize(() => {
    //   return this.db.run(
    //     "SELECT * FROM  [heart_experiments].session_info where session_id = ?",
    //     [sessionId]
    //   );
    // });
  }
}
