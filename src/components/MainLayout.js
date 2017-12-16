import React, { Component } from 'react';
//import Navbar from './../ui/navigation/navbar';

class MainLayout extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export default MainLayout;
