// @flow weak

import React, { PureComponent } from 'react';
import createTickGroup from 'resonance/createTickGroup';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import palette from 'docs/src/utils/palette';
import { dims } from '../module';

const numberFormat = format(',');
const percentFormat = format('.1p');

class Tick extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      val: PropTypes.number.isRequired,
    }).isRequired,
    offset: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    lazyRemove: PropTypes.func.isRequired,
  };

  state = {
    opacity: 1e-6,
    transform: `translate(0,${this.props.currScale(this.props.data.val)})`,
  }

  onEnter() {
    const { prevScale, currScale, data: { val }, duration } = this.props;

    return {
      opacity: [1e-6, 1],
      transform: [
        `translate(0,${prevScale(val)})`,
        `translate(0,${currScale(val)})`,
      ],
      timing: { duration },
    };
  }

  onUpdate() {
    const { currScale, data: { val }, duration } = this.props;

    return {
      opacity: [1],
      transform: [`translate(0,${currScale(val)})`],
      timing: { duration },
    };
  }

  onExit() {
    const { currScale, data: { val }, duration, lazyRemove } = this.props;

    return {
      opacity: [1e-6],
      transform: [`translate(0,${currScale(val)})`],
      timing: { duration },
      events: { end: lazyRemove },
    };
  }

  render() {
    const { offset, data: { val } } = this.props;

    return (
      <g {...this.state}>
        <line
          x1={0} y1={0}
          x2={dims[0]} y2={0}
          stroke={palette.textColor}
          opacity={0.2}
        />
        <text
          fontSize={'9px'}
          textAnchor="end"
          dy=".35em"
          fill={palette.textColor}
          x={-10} y={0}
        >{offset === 'expand' ? percentFormat(val) : numberFormat(val)}</text>
      </g>
    );
  }
}

export default createTickGroup(Tick, 'g');
