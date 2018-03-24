import WindowManager from 'containers/WindowManager';
import InputFiniteAutomaton from '../inputFiniteAutomaton/InputFiniteAutomaton';
import NfaToDfaViz from './NfaToDfaViz';

export default class NfaToDfa extends WindowManager {
  state = {
    windows: {
      input: InputFiniteAutomaton,
      viz: NfaToDfaViz
    },
    currentWindow: null
  }

  componentWillMount() {
    this.setCurrentWindow('input');
  }
}

