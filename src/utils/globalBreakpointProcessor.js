import ui from 'utils/ui';
import misc from 'utils/misc';
import _ from 'lodash';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'

const globalBreakpointProcessor = {};
let _breakpoint;

globalBreakpointProcessor.initialize = breakpoint => {
  _breakpoint = breakpoint;
};

globalBreakpointProcessor.eventHandlers = {};

globalBreakpointProcessor.eventHandlers.visualizeForward = (breakpointName = 'breakpoint') => {
  return function (b, cb = null) {
    _breakpoint.commit.call(this, () => {
      _breakpoint.forward[_.camelCase(b.label)].call(this, {
        label: b.label,
        data: b.data,
        index: this.state[breakpointName].index
      });

      if (cb !== null && _.isFunction(cb)) {
        cb(b);
      }
    });
  };
};

globalBreakpointProcessor.eventHandlers.visualizeBackward = (breakpointName = 'breakpoint') => {
  return function (b, cb = null) {
    if (_breakpoint.backward !== undefined && _breakpoint.backward[_.camelCase(b.label)] !== undefined) {
      _breakpoint.backward[_.camelCase(b.label)].call(this, {
        label: b.label,
        data: b.data,
        index: this.state[breakpointName].index
      });
    } else {
      _breakpoint.rollback.call(this);
      this.refs.actionsHistory.addOrSelect(this.state[breakpointName].index);
    }

    if (cb !== null && _.isFunction(cb)) {
      cb(b);
    }
  };
};

globalBreakpointProcessor.eventHandlers.saveVisualization = (breakpointName = 'breakpoint') => {
  return function () {
    if (this.refs.visualizationControl === undefined) {
      ui.obj.modal.show(this, 'Warning', 'Saving the visualization is not supported.');
      return;
    }

    ui.obj.loader.show(this);

    const arr = misc.range(0, this.state[breakpointName].data.length + 1);
    const doc = new jsPDF('p', 'mm');
    let promises = [];

    this.refs.visualizationControl.breakpoint.forAll(b => {
      setTimeout(() => {
        promises.push(html2canvas(document.querySelector('.dashboard-card-content')));
      }, 1000);
    });

    setTimeout(() => {
      Promise.all(promises).then(canvases => {
        canvases.forEach((canvas, index) => {
          let screen = canvas.toDataURL('image/jpeg', 0.5);
          let imgWidth = 210;
          let pageHeight = 295;
          let imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          doc.addImage(screen, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(screen, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          doc.addPage();
        });

        doc.save('download.pdf');
        ui.obj.loader.hide(this);

        /*setTimeout(() => {
          ui.obj.loader.hide(this);
          doc.save('download.pdf');
        }, 10000);*/
      });
    }, 15000);
  };
};

export default globalBreakpointProcessor;
