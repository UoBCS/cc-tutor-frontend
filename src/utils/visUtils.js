import _ from 'lodash';

const visUtils = {};

visUtils.onNodeClickHandler = (instance, handler) => {
  instance.on('selectNode', handler);
};

visUtils.defaultDataFormatter = data =>
  !data ? 'No data.' :
    `
    <ul style="font-family: 'monospace'; list-style: 'none'; margin: 0; padding: 0">
      ${Object.keys(data).map(key =>
        `<li>${key}: ${data[key]}</li>`
      )}
    </ul>
    `
;

visUtils.setDataOnHover = (visObj, dataFormatter = null) => {
  visObj.nodes.update(visObj.nodes.map(n => (
    {
      id: n.id,
      title: _.isFunction(dataFormatter)
        ? dataFormatter(n.data)
        : visUtils.defaultDataFormatter(n.data)
    }
  )));
};

export default visUtils;
