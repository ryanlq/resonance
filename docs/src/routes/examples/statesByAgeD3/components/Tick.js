// @flow weak

import React, { PureComponent, PropTypes } from 'react';
import * as d3 from 'd3';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { APPEAR, UPDATE, REMOVE, REVIVE } from 'resonance/core/types';
import { dims } from '../module';

const percentFormat = d3.format('.1%');

export const styleSheet = createStyleSheet('Tick', (theme) => {
  return {
    line: {
      strokeWidth: 1,
      pointerEvents: 'none',
      opacity: 0.2,
      stroke: theme.palette.text.primary,
    },
    text: {
      fontSize: 9,
      fill: theme.palette.text.secondary,
    },
  };
});

export default class Tick extends PureComponent {
  static propTypes = {
    tick: PropTypes.shape({
      udid: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      data: React.PropTypes.number.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    prevScale: PropTypes.func.isRequired,
    currScale: PropTypes.func.isRequired,
    removeTick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    theme: customPropTypes.muiRequired,
    styleManager: customPropTypes.muiRequired,
  };

  constructor(props) {
    super(props);

    (this:any).getTickRef = this.getTickRef.bind(this);
  }

  componentDidMount() {
    this.onAppear(this.props);
  }

  componentDidUpdate(prev) {
    const { props } = this;

    if (prev.tick !== props.tick) {
      switch (props.tick.type) {
        case APPEAR:
          this.onAppear(props);
          break;
        case UPDATE:
          this.onUpdate(props);
          break;
        case REMOVE:
          this.onRemove(props);
          break;
        case REVIVE:
          this.onUpdate(props);
          break;
        default:
          break;
      }
    }
  }

  tick = null; // Root node ref set in render method

  onAppear({ prevScale, currScale, tick: { data }, duration }) {
    d3.select(this.tick)
      .attr('transform', `translate(${prevScale(data)},0)`)
      .attr('opacity', 1e-6)
      .transition()
        .duration(duration)
        .attr('transform', `translate(${currScale(data)},0)`)
        .attr('opacity', 1);
  }

  onUpdate({ currScale, tick: { data }, duration }) {
    d3.select(this.tick).transition().duration(duration)
      .attr('transform', `translate(${currScale(data)},0)`)
      .attr('opacity', 1);
  }

  onRemove({ currScale, tick: { data, udid }, duration, removeTick }) {
    d3.select(this.tick).transition().duration(duration)
      .attr('transform', `translate(${currScale(data)},0)`)
      .attr('opacity', 1e-6)
      .on('end', () => {
        removeTick(udid);
      });
  }

  getTickRef(node) {
    this.tick = node;
  }

  render() {
    const { tick: { data } } = this.props;
    const classes = this.context.styleManager.render(styleSheet);

    return (
      <g ref={this.getTickRef}>
        <line
          x1={0} y1={0}
          x2={0} y2={dims[1]}
          className={classes.line}
        />
        <text
          x={0} y={-5}
          textAnchor="middle"
          className={classes.text}
        >{percentFormat(data)}</text>
      </g>
    );
  }
}