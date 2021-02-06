import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { WORK_FOLDER } from '../../constants/file-system';
import { Session, SessionInfo } from '../../types/data-store';

@Injectable({
  providedIn: 'root',
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
    this.sqlite = window.require('sqlite');
    this.sqlite3 = window.require('sqlite3').verbose();
    this.sqlite
      .open({
        filename: `${WORK_FOLDER}/heart-experiments.db`,
        driver: this.sqlite3.Database,
      })
      .then((db) => {
        db.exec(
          'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, session INTEGER NOT NULL, created_at DATE NOT NULL);',
        );
        db.exec(
          'CREATE TABLE IF NOT EXISTS session_info (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, session_id INTEGER NOT NULL, created_at DATE NOT NULL, image_location TEXT NOT NULL, spectro_metric REAL NOT NULL, type TEXT NOT NULL);',
        );
        this.db = db;
      });

    return DataStoreService.instance;
  }

  public insertSession = async (sessionValue: Session): Promise<number> => {
    const { session, createdAt } = sessionValue,
      { lastID } = await this.db.run('INSERT INTO sessions(session, created_at) VALUES (?, ?);', [
        session,
        moment(createdAt).format('YYYY-MM-DD HH:MM:SS'),
      ]);

    return lastID;
  };

  public insertSessionInfo = async (sessionInfo: SessionInfo): Promise<any> => {
    const { sessionId, createdAt, imageLocation, spectroMetric, type, prediction } = sessionInfo;
    await this.db.run(
      'INSERT INTO session_info(session_id, created_at, image_location, spectro_metric, type, prediction) VALUES (?, ?, ?, ?, ?, ?);',
      [
        sessionId,
        moment(createdAt).format('YYYY-MM-DD HH:MM:SS'),
        imageLocation,
        spectroMetric,
        type,
        prediction,
      ],
    );
  };

  public getAllSessions = async (): Promise<any> => {
    const data = await this.db.all(
      'SELECT s.id, s.session, s.created_at, COUNT(si.session_id) as items FROM sessions as s LEFT JOIN session_info AS si ON s.id = si.session_id GROUP BY s.session HAVING items > 10000;',
    );
    return data;
  };

  public getAllSessionInfo = async (sessionId): Promise<any> => {
    const data = await this.db.all('SELECT * FROM session_info where session_id = ?', [sessionId]);
    return data;
  };

  public getAggregatedSessionInfo = async (sessionId): Promise<any> => {
    const data = await this.db.all(`
      SELECT
	      id-(select id from session_info where session_id= ${sessionId} limit 1) as rn,
	      session_id,
	      (id-(select id from session_info where session_id= ${sessionId} limit 1))/400 as batch,
        avg(spectro_metric) as average_metric,
        (avg(prediction) * 10) as average_prediction,
      FROM session_info
      WHERE session_id = ${sessionId}
      group by rn/400;`);
    return data;
  };
}
