// classname
import classNames from 'classnames/bind';
// proptypes
import PropTypes from 'prop-types';
// overlay scrollbar react
// import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import styles from './OverlayScrollbar.module.scss';

const cx = classNames.bind(styles);

function OverlayScrollbar({ children, classNames }) {
  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          className: cx('os-theme-dark'),
          size: 'thin', // equivalent to width: 8px;
          visibility: 'auto',
          autoHide: 'scroll',
          autoHideDelay: 800,
          clickScrolling: true,
          touchSupport: true,
          snapHandle: true,
          colors: {
            track: 'rgba(0, 0, 0, 0.1)', // Use same color as thumb
            thumb: 'rgba(0, 0, 0, 0.1)',
          },
        },
        paddingAbsolute: true,
      }}
      style={{ width: '100%', height: '100%' }}
      className={classNames}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
}

OverlayScrollbar.propTypes = {
  children: PropTypes.node,
  classNames: PropTypes.string,
};

export default OverlayScrollbar;
