import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Root extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div id={this.props.id}>
        <h1>Hello, fle-cli.</h1>
      </div>
    )
  }
}

Root.propTypes = {
  id: PropTypes.string
}
