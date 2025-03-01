import React from 'react';
import styles from './Loading.module.scss';

const Loading: React.FC = () => {
  return (
    <div className={styles['lds-ellipsis']}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
