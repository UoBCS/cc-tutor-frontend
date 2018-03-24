import WindowManager from 'containers/WindowManager';
import InputParserData from '../InputParserData';
import LLViz from './LLViz';

export default class LL extends WindowManager {
  state = {
    windows: {
      input: InputParserData,
      viz: LLViz
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'viz'
    });
  }
}
