import WindowManager from 'containers/WindowManager';
import InputParserData from 'containers/syntaxAnalysis/InputParserData';
import BuildAst from './BuildAst';
import TypeChecking from './TypeChecking';

export default class SemanticAnalysis extends WindowManager {
  state = {
    windows: {
      input: InputParserData,
      buildAst: BuildAst,
      typeChecking: TypeChecking
    }
  }

  componentWillMount() {
    this.setCurrentWindow('input', {
      'nextWindow': 'buildAst'
    });
  }
}
