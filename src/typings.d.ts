/* SystemJS module definition */
declare var nodeModule: NodeModule;
interface NodeModule {
  id: string;
}

declare var ewindow: Window;
interface Window {
  process: any;
  require: any;
}
