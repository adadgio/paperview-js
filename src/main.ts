declare var window: any;
import './scss/style.scss';
import { Viewer } from './viewer';

window.PDFViewer = Viewer
window.CrocodocPDFViewer = new Viewer()
