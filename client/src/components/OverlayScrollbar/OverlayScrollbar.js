// classname
import classNames from 'classnames/bind';
// proptypes
import PropTypes from 'prop-types';
// overlay scrollbar react
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

import styles from './OverlayScrollbar.module.scss';

const cx = classNames.bind(styles);

function OverlayScrollbar({ children, classNames }) {
  return (
    <OverlayScrollbarsComponent
      options={{
        overflowBehavior: { x: 'hidden', y: 'overlay' },
        scrollbars: {
          className: cx('os-theme-custom'),
          size: '10px',
          visibility: 'auto',
          autoHide: 'leave',
          autoHideDelay: 500,
          clickScrolling: true,
          touchSupport: true,
          snapHandle: true,
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
        },
        paddingAbsolute: true,
      }}
      className={cx('custom-scrollbar', classNames)}
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
