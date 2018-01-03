import React from 'react';
import { Message, Modal, Loader } from 'semantic-ui-react';

const ui = {};

ui.state = {
  message: {
    headerContent: '',
    mainContent: '',
    type: ''
  },
  loader: {
    main: false
  },
  modal: {
    headerContent: '',
    mainContent: '',
    size: 'small',
    open: false,
    handleClose: comp => {
      return () => {
        let ui = comp.state.ui;
        ui.modal.open = false;
        comp.setState({ ui });
      }
    }
  }
};

ui.obj = {};

ui.obj.message ={
  show: (comp, type, headerContent, mainContent) => {
    let ui = comp.state.ui;
    ui.message.type = type;
    ui.message.headerContent = headerContent;
    ui.message.mainContent = mainContent;

    comp.setState({ ui });
  },

  hide: comp => {
    let ui = comp.state.ui;
    ui.message.type = '';
    ui.message.headerContent = '';
    ui.message.mainContent = '';

    comp.setState({ ui });
  },

  render: comp => {
    let opts = {};
    opts[comp.state.ui.message.type] = undefined; // TODO: fix this

    return comp.state.ui.message.headerContent !== '' ? (
      <Message {...opts}>
        <Message.Header>{comp.state.ui.message.headerContent}</Message.Header>
        <p>{comp.state.ui.message.mainContent}</p>
      </Message>
    ) : null;
  }
};

ui.obj.loader = {
  show: (comp, which) => {
    let ui = comp.state.ui;
    ui.loader[which] = true;

    comp.setState({ ui });
  },

  hide: (comp, which) => {
    let ui = comp.state.ui;
    ui.loader[which] = false;

    comp.setState({ ui });
  },

  render: (comp, which) => {
    return comp.state.ui.loader[which] ? <Loader active inline='centered' /> : null;
  }
};

ui.obj.modal = {
  show: (comp, headerContent, mainContent, size) => {
    let ui = comp.state.ui;
    ui.modal.open = true;
    ui.modal.headerContent = headerContent;
    ui.modal.mainContent = mainContent;
    ui.modal.size = size;

    comp.setState({ ui });
  },

  render: comp => {
    let modal = comp.state.ui.modal;

    return (
      <Modal size={modal.size} open={modal.open} onClose={modal.handleClose(comp)}>
        <Modal.Header>
          {modal.headerContent}
        </Modal.Header>
        <Modal.Content>
          <p>{modal.mainContent}</p>
        </Modal.Content>
      </Modal>
    );
  }
};

export default ui;
