import React from 'react';
import { Message, Modal, Dimmer, Loader } from 'semantic-ui-react';

const ui = {};

ui.state = {
  message: {
    headerContent: null,
    mainContent: null,
    type: '',
    visible: true
  },
  loader: {
    main: false
  },
  modal: {
    headerContent: null,
    mainContent: null,
    actionsContent: null,
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

ui.renderErrors = err => {
  return <ul>{err.response.data.errors.map((e, i) => <li key={i}>{e.detail}</li>)}</ul>;
};

ui.obj = {};

/**
 * Message
 */
ui.obj.message = {
  show: (comp, type, headerContent, mainContent) => {
    let ui = comp.state.ui;
    ui.message.type = type;
    ui.message.headerContent = headerContent;
    ui.message.mainContent = mainContent;

    comp.setState({ ui });
  },

  handleDismiss: comp => {
    return () => {
      let ui = comp.state.ui;
      ui.message.visible = false;

      comp.setState({ ui });
    };
  },

  hide: comp => {
    let ui = comp.state.ui;
    ui.message.type = '';
    ui.message.headerContent = null;
    ui.message.mainContent = null;
    ui.message.visible = false;

    comp.setState({ ui });
  },

  render: comp => {
    let opts = {};
    opts[comp.state.ui.message.type] = true;

    return comp.state.ui.message.headerContent !== null ? (
      <Message {...opts} onDismiss={ui.obj.message.handleDismiss(comp)}>
        <Message.Header>{comp.state.ui.message.headerContent}</Message.Header>
        {comp.state.ui.message.mainContent}
      </Message>
    ) : null;
  }
};

/**
 * Loader
 */
ui.obj.loader = {
  show: (comp, which = 'main') => {
    let ui = comp.state.ui;
    ui.loader[which] = true;

    comp.setState({ ui });
  },

  hide: (comp, which = 'main') => {
    let ui = comp.state.ui;
    ui.loader[which] = false;

    comp.setState({ ui });
  },

  render: (comp, which = 'main') => {
    //inline='centered'
    return comp.state.ui.loader[which] ? <Dimmer active><Loader /></Dimmer> : null;
  }
};

/**
 * Modal
 */
ui.obj.modal = {
  show: (comp, headerContent, mainContent, actionsContent = null, size = 'small') => {
    let ui = comp.state.ui;
    ui.modal.open = true;
    ui.modal.headerContent = headerContent;
    ui.modal.mainContent = mainContent;
    ui.modal.actionsContent = actionsContent;
    ui.modal.size = size;

    comp.setState({ ui });
  },

  render: comp => {
    const modal = comp.state.ui.modal;
    const actions = modal.actionsContent === null
                    ? null
                    : (<Modal.Actions>
                        {modal.actionsContent}
                    </Modal.Actions>);

    return (
      <Modal size={modal.size} open={modal.open} onClose={modal.handleClose(comp)}>
        <Modal.Header>
          {modal.headerContent}
        </Modal.Header>
        <Modal.Content>
          {modal.mainContent}
        </Modal.Content>
        {actions}
      </Modal>
    );
  }
};

export default ui;
