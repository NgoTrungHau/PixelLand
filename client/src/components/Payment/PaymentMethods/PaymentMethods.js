import classNames from 'classnames/bind';

import styles from './PaymentMethods.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { useState } from 'react';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
const cx = classNames.bind(styles);

function PaymentMethods({ products }) {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>Payment Methods</div>
      <div className={cx('method')}>
        <div className={cx('method-name')}>
          <FontAwesomeIcon icon={faPaypal} />
          <span> Paypal</span>
        </div>
        <div className={cx('method-connect')}>
          {!isConnected ? (
            <Button btnType="white" onClick={handleConnect}>
              Connect
            </Button>
          ) : (
            <Button
              btnType="white"
              leftIcon={
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: 'green' }} // Set the color to a specific value, like 'green'
                />
              }
              onClick={handleConnect}
            >
              Connected
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentMethods;
