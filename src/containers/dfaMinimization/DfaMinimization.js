import WindowManager from 'containers/WindowManager';
import InputFiniteAutomaton from '../inputFiniteAutomaton/InputFiniteAutomaton';
import DfaMinimizationViz from './DfaMinimizationViz';

export default class DfaMinimization extends WindowManager {
  state = {
    windows: {
      input: InputFiniteAutomaton,
      viz: DfaMinimizationViz
    },
    currentWindow: null
  }

  componentWillMount() {
    this.setCurrentWindow('input');
  }
}

