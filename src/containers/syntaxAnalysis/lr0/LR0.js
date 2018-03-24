import WindowManager from 'containers/WindowManager';
import InputParserData from '../InputParserData';
import LR0Viz from './LR0Viz';

export default class LL1 extends WindowManager {
  state = {
    windows: {
      input: InputParserData,
      viz: LR0Viz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
