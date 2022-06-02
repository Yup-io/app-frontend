import React from 'react';
import styles from './dotspinner.module.css';
import RandomTip from './RandomTip';
import clsx from 'clsx';

function DotSpinner() {
  return (
    <div>
      <div className={styles.container}>
        <div className={clsx(styles.dot, styles.dot1)} />
        <div className={clsx(styles.dot, styles.dot2)} />
        <div className={clsx(styles.dot, styles.dot3)} />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
            />
          </filter>
        </defs>
      </svg>
      <RandomTip />
    </div>
  );
}

export default DotSpinner;
