/* index.js for vdasreawdfew */
import React from 'react'
import ReactDom from 'react-dom'
import Extra from './banana.js'
// import Logo from './img/defaulticon.png'
// const img = require('image.png')


const App = (props) =>{ 
  return (
    <div>
      <div>App</div>
      <div>Newest changes mayn</div>
      <Extra/>
    </div>
  )
}

ReactDom.render(<App/>, document.getElementById('app')) 