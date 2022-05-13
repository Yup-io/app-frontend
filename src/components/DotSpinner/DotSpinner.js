import React from 'react'
import './dotspinner.module.css'
import RandomTip from './RandomTip'

function DotSpinner () {
  return (
    <div>
      <div className='container'>
        <div className='dot dot-1' />
        <div className='dot dot-2' />
        <div className='dot dot-3' />
      </div>
      <svg xmlns='http://www.w3.org/2000/svg'
        version='1.1'
      >
        <defs>
          <filter id='goo'>
            <feGaussianBlur in='SourceGraphic'
              stdDeviation='10'
              result='blur'
            />
            <feColorMatrix in='blur'
              mode='matrix'
              values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7'
            />
          </filter>
        </defs>
      </svg>
      <RandomTip />
    </div>
  )
}

export default DotSpinner
