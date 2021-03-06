// @flow weak

import React, { PureComponent } from 'react';
import createNodeGroup from 'resonance/createNodeGroup';
import PropTypes from 'prop-types';
import { easePoly } from 'd3-ease';
import { format } from 'd3-format';
import palette from 'docs/src/utils/palette';

const percentFormat = format('.2%');

class Bar extends PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
      xVal: PropTypes.number.isRequired,
      yVal: PropTypes.number.isRequired,
    }).isRequired,
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    duration: PropTypes.number.isRequired,
    lazyRemove: PropTypes.func.isRequired,
  };

  state = {
    node: {
      opacity: 1e-6,
      transform: 'translate(0,500)',
    },
    rect: {
      width: this.props.data.xVal,
      height: this.props.yScale.bandwidth(),
    },
    text: {
      x: this.props.data.xVal - 3,
    },
  }

  onEnter() {
    const { yScale, duration, data: { xVal, yVal } } = this.props;

    return {
      node: {
        opacity: [1e-6, 1],
        transform: ['translate(0,500)', `translate(0,${yVal})`],
      },
      rect: { width: xVal, height: yScale.bandwidth() },
      text: { x: xVal - 3 },
      timing: { duration, ease: easePoly },
    };
  }

  onUpdate() {
    const { yScale, duration, data: { xVal, yVal } } = this.props;

    return {
      node: {
        opacity: [1],
        transform: [`translate(0,${yVal})`],
      },
      rect: { width: [xVal], height: [yScale.bandwidth()] },
      text: { x: [xVal - 3] },
      timing: { duration, ease: easePoly },
    };
  }

  onExit() {
    const { duration, lazyRemove } = this.props;

    return {
      node: {
        opacity: [1e-6],
        transform: ['translate(0,500)'],
      },
      timing: { duration, ease: easePoly },
      events: { end: lazyRemove },
    };
  }

  render() {
    const { xScale, yScale, data: { name, xVal } } = this.props;

    return (
      <g {...this.state.node}>
        <rect
          fill={palette.primary1Color}
          opacity={0.4}
          {...this.state.rect}
        />
        <text
          dy="0.35em"
          x={-15}
          textAnchor="middle"
          fill={palette.textColor}
          fontSize={10}
          y={yScale.bandwidth() / 2}
        >{name}</text>
        <text
          textAnchor="end"
          dy="0.35em"
          fill="white"
          fontSize={10}
          y={yScale.bandwidth() / 2}
          {...this.state.text}
        >{percentFormat(xScale.invert(xVal))}</text>
      </g>
    );
  }
}

export default createNodeGroup(Bar, 'g', (d) => d.name);
