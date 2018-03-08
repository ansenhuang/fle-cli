import module from '@'
import css from './main.css'

// run module
module()

document.getElementById('root').innerHTML = [
  '<h1>Hello, fle-cli.</h1>',
  /* when open css-modules */
  `<p class="${css.title}">This is module css.</p>`
  /* when close css-modules */
  // '<p class="title">This is global css.</p>'
].join('')
