import React, { Component } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import './DataPlaceholder.css';

const DataPlaceholder = props => {
  const content = props.children ? props.children : (
    <div>
      <Icon name={props.icon} circular size='large' />
      <Header as='h2' className='DataPlaceholder_title'>{props.title}</Header>
      <p className='DataPlaceholder_subtitle'>{props.subtitle}</p>
      <div className='DataPlaceholder_action'>
        {props.action}
      </div>
    </div>
  );

  return (
    <div className='DataPlaceholder'>
      {content}
    </div>
  )
};

export default DataPlaceholder;
