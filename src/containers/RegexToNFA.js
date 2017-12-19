import React, { Component } from 'react';
import { Form, Icon, Input } from 'semantic-ui-react';
import api from 'api';

class RegexToNFA extends Component {
  state = {

  }

  render() {
    const body = true ?
    (
      <div>
        <h1>mmm</h1>
      </div>
    )
    :
    (
      <div>

      </div>
    )

    return (
      <div>
        <Form size='massive'>
          <Form.Group>
            <Input placeholder='Regular expression' icon={<Icon name='search' inverted circular link />} />
          </Form.Group>
        </Form>

        {body}
      </div>
    )
  }
}

export default RegexToNFA;
