import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import './CekMachineStep.css';

export default class CekMachineStep extends Component {

  getControl = control => {
    switch (control.type) {
      case 'VAR': return <span>{control.name}</span>;

      case 'CONST': return <span>{control.value}</span>;

      case 'FUNC': return <span>λ{this.getControl(control.name)}.{this.getControl(control.body)}</span>

      case 'APPL':
        const fn = this.getControl(control.function);
        const arg = this.getControl(control.argument);

        return (
          <span>
            {control.function.type === 'FUNC' ? <span>({fn})</span> : fn}

            {control.argument.type === 'VAR' || control.argument.type === 'CONST' ? arg : <span>({arg})</span>}
          </span>
        );

      case 'CLOSURE':
        return <span>clos({this.getControl(control.function)}, {this.getEnvironment(control.environment)})</span>
        break;
    }
  }

  getEnvironment = environment => {
    return (
      <span>
        [{environment.map(e =>
          <span key={e.variable}>{this.getControl(e.variable)} → {this.getControl(e.value)}</span>
        )}]
      </span>
    );
  }

  getContinuation = (continuation, highlight) => {
    return (
      <span>
        [{continuation.map((c, i) =>
          <span key={i} className={i === 0 && highlight ? 'CekMachineStep_highlight' : null}>
            (
              {c[0] === null ? '◯ ' : this.getControl(c[0])}

              {c[1] === null ? '◯' : <span>{this.getControl(c[1][0])} {this.getEnvironment(c[1][1])}</span>}
            )
          </span>
        )}]
      </span>
    );
  }

  render() {
    const {control, environment, continuation} = this.props.data;
    const label = this.props.label;

    return (
      <div className='CekMachineStep'>
        <div className='CekMachineStep_highlight'>{this.getControl(control)}</div>
        <div>{this.getEnvironment(environment)}</div>
        <div>{this.getContinuation(continuation, label === 'VALUE_1' || label === 'VALUE_2')}</div>
      </div>
    );
  }

}
