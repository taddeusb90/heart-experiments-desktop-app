import * as childProcess from 'child_process';
import * as fs from 'fs';
import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as base64Img from 'base64-img';
import * as sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node';
import * as cv from 'opencv';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  base64Img: typeof base64Img;
  sharp: typeof sharp;
  tf: typeof tf;
  cv: typeof cv;

  get isElectron(): boolean {
    return window && window.process && window.process.type;
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.base64Img = window.require('base64-img');
      this.sharp = window.require('sharp');
      this.tf = window.require('@tensorflow/tfjs-node');
      this.cv = window.require('opencv');
    }
  }
}
