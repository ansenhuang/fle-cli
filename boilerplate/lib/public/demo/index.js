import module from '@'
import './style.css'

// run module
module()

document.getElementById('root').innerHTML = [
  `<h1>Hello, fle-cli.</h1>`,
  `<p>Date: ${module()}</p>`
].join('')
