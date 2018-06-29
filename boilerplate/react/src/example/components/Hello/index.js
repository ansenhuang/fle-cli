import React, { Component } from 'react'
import $style from './style.module.css'

export default class Hello extends Component {
  render () {
    return (
      <div className={$style.app}>
        <header className={$style.header}>
          <img src={require('./images/logo.svg')} className={$style.logo} alt="logo" />
          <h1 className={$style.title}>Welcome to React</h1>
        </header>
        <p className={$style.intro}>
          To get started, edit <code>App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}
