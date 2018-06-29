import React, { Component } from 'react'
import Hello from './components/Hello'
import './global.css'

export default class App extends Component {
  render () {
    return (
      <div id="app">
        <Hello />
      </div>
    )
  }
}
