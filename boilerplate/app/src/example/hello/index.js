import $style from './style.module.css'

const appNode = document.createElement('div')
appNode.className = $style.app

appNode.innerHTML = `
<header className=${$style.header}>
<img src=${require('./images/logo.png')} className=${$style.logo} alt="logo" />
<h1 className=${$style.title}>Welcome</h1>
</header>
<p className=${$style.intro}>
To get started, edit <code>index.js</code> and save to reload.
</p>
`

export default appNode
