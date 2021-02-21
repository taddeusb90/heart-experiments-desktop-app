/* eslint-disable no-param-reassign */
/* eslint-disable one-var */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStoreService } from '../../services/data-store/data-store.service';
import { ElectronService } from '../../services/electron/electron.service';

@Component({
  selector: 'reprocess-sessions',
  templateUrl: './reprocess-sessions.component.html',
  styleUrls: ['./reprocess-sessions.component.scss'],
})
export class ReprocessSessionsComponent implements OnInit {
  public sessions: any[] = [];
  public selectedSessions: number[] = [];
  public displayedColumns: string[] = ['id', 'session', 'created_at', 'items', 'view', 'reprocess'];
  private cv: any;
  private tf: any;
  private model: any;
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(
    private router: Router,
    private dataStoreService: DataStoreService,
    private electronService: ElectronService,
  ) {
    this.cv = electronService.cv;
    this.tf = electronService.tf;
    this.loadModel();
  }

  ngOnInit(): void {
    this.dataStoreService.getAllSessions().then((data) => {
      this.sessions = data.map((item) => ({ ...item }));
    });
    setTimeout(() => {
      this.canvas = document.getElementById('classifier-canvas-1') as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d');
    }, 2000);
  }

  calculateSpectroMetric = async (sessionTimestamp: string, imageName: string): Promise<number> => {
    let initialImage = await this.cv.imread(
      `D:\\Projects\\heart-experiments\\data\\sessions\\${sessionTimestamp}-init.jpg`,
    );
    const rect = new this.cv.Rect(186, 0, 650, 620);
    initialImage = await initialImage.getRegion(rect);

    let image = await this.cv.imread(
      `D:\\Projects\\heart-experiments\\data\\sessions\\${sessionTimestamp}\\incomplete\\${imageName}`,
    );
    let region = await image.getRegion(rect);
    image = null;
    const diff = await initialImage.absdiff(region);
    initialImage = null;
    let mask = await diff.cvtColor(this.cv.COLOR_BGR2GRAY);
    const th = 50;
    const maskAsArray = await mask.getDataAsArray();
    mask = null;
    const indexes = maskAsArray
        .reduce((acc, cuv) => [...acc, ...cuv], [])
        .reduce((acc, value, index) => {
          if (value > th) {
            acc.push(index);
          }
          return acc;
        }, []),
      imageDataAsArray = await region.getDataAsArray();
    region = null;
    const imageData = imageDataAsArray.reduce((acc, cuv) => [...acc, ...cuv], []),
      cleanValues = indexes.map(
        (index) => imageData[index].reduce((acc, cuv) => Number(acc) + Number(cuv), 0) / 3,
      );
    if (cleanValues.length) {
      const cleanValuesLength = cleanValues.length,
        cleanValuesSum = cleanValues.reduce((acc, cuv) => Number(acc) + Number(cuv), 0),
        cleanValuesMean = cleanValuesSum / cleanValuesLength;

      return cleanValuesMean;
    }

    return 0;
  };

  classifyImage = async (filePath: string): Promise<number> => {
    let image = await this.cv.imread(filePath);
    const left = 170,
      top = 40,
      width = 650,
      height = 650;
    const rect = new this.cv.Rect(left, top, width, height);
    let croppedImage = await image.getRegion(rect);
    image = null;
    let resizedImage = await croppedImage.resize(200, 200);
    croppedImage = null;
    const imageBuffer = resizedImage.getDataAsArray();
    resizedImage = null;
    const imgData = this.context.createImageData(200, 200);
    const newImageData = imageBuffer.reduce((acc, cuv) => {
      return acc.concat(
        cuv.reduce((ac, c) => {
          return ac.concat(...c, 255);
        }, []),
      );
    }, []);

    for (let i = 0; i < imgData.data.length; i += 4) {
      // channels are inverted below because opencv does not use the same ordering
      imgData.data[i + 0] = newImageData[i + 2];
      imgData.data[i + 1] = newImageData[i + 1];
      imgData.data[i + 2] = newImageData[i + 0];
      imgData.data[i + 3] = newImageData[i + 3]; // alpha
    }
    this.context.putImageData(imgData, 10, 10);

    const tensor = await this.tf.browser
      .fromPixels(this.context.getImageData(10, 10, 200, 200))
      .toFloat();
    const offset = this.tf.scalar(0.00392156862745098).toFloat();
    const scaled = tensor.mul(offset).toFloat();
    const normalized = scaled.expandDims();
    const prediction = await this.model.predict(normalized).dataSync();
    const predictedClass = prediction.indexOf(Math.max(...prediction));

    return predictedClass;
  };

  processSessionInfoItem = async (
    sessionInfo: any,
    element: any,
    initialInfoLength: number,
  ): Promise<void> => {
    const [sessionInfoItem] = sessionInfo;
    const locationArray = sessionInfoItem.image_location.split('\\');
    // eslint-disable-next-line prefer-destructuring
    const sessionTimestamp = locationArray[6];
    // eslint-disable-next-line prefer-destructuring
    const imageName = locationArray[8];
    const spectroMetric = await this.calculateSpectroMetric(sessionTimestamp, imageName);
    const prediction = await this.classifyImage(
      `D:\\Projects\\heart-experiments\\data\\sessions\\${sessionTimestamp}\\incomplete\\${imageName}`,
    );

    await this.dataStoreService.updateSessionInfoItem(
      spectroMetric,
      prediction,
      sessionInfoItem.session_id,
      imageName,
    );

    sessionInfo.shift();
    // eslint-disable-next-line no-param-reassign
    element.progress = (initialInfoLength - sessionInfo.length * 100) / initialInfoLength;
    if (sessionInfo.length) {
      await this.processSessionInfoItem(sessionInfo, element, initialInfoLength);
    }
  };

  reprocessSession = async (sessionId: string, element: any): Promise<void> => {
    const sessionInfo = await this.dataStoreService.getAllSessionInfo(sessionId);
    const initialInfoLength = sessionInfo.length;
    element.show = true;
    await this.processSessionInfoItem(sessionInfo, element, initialInfoLength);
  };

  loadModel = async (): Promise<void> => {
    this.model = await this.tf.loadLayersModel('assets/model/model.json');
    console.log('Finished loading model');
  };
}
