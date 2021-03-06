// @flow weak

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import dataUpdate from '../core/dataUpdate';
import withTransitions from '../core/withTransitions';
import { getDisplayName } from '../core/helpers';

export const propTypes = {
  data: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default function createNodeGroup(nodeComponent, wrapperComponent, keyAccessor) {
  return class NodeGroup extends PureComponent {
    static propTypes = propTypes;

    static defaultProps = {
      className: 'node-group',
    };

    static displayName = `NodeGroup(${getDisplayName(nodeComponent)})`

    constructor(props) {
      super(props);

      (this:any).removeUDID = this.removeUDID.bind(this);
      (this:any).lazyRemoveUDID = this.lazyRemoveUDID.bind(this);
      this.WrappedComponent = withTransitions(nodeComponent);
    }

    componentWillReceiveProps(next) {
      if (this.props.data !== next.data) {
        this.setState((prevState) => {
          return dataUpdate(next.data, prevState, keyAccessor);
        });
      }
    }

    WrappedComponent = null;

    state = dataUpdate(this.props.data, {}, keyAccessor);

    removeUDID(udid) {
      this.setState((prevState, props) => {
        const index0 = prevState.nodes.findIndex((d) => keyAccessor(d) === udid);
        const index1 = props.data.findIndex((d) => keyAccessor(d) === udid);

        if (index0 >= 0 && index1 === -1) {
          const udids = Object.assign({}, prevState.udids);
          delete udids[udid];

          return {
            udids,
            nodes: [
              ...prevState.nodes.slice(0, index0),
              ...prevState.nodes.slice(index0 + 1),
            ],
          };
        }

        return prevState;
      });
    }

    lazyRemoveUDID(udid) {
      this.setState((prevState) => ({
        removed: Object.assign({}, prevState.removed, { [udid]: true }),
      }));
    }

    render() {
      const { props, WrappedComponent, state } = this;
      const childProps = Object.assign({}, props);
      delete childProps.className;

      return React.createElement(
        wrapperComponent,
        { className: props.className },
        state.nodes.map((node, index) => {
          const udid = keyAccessor(node);
          const type = state.udids[udid];

          return (
            <WrappedComponent
              key={udid}
              udid={udid}
              type={type}
              node={node}
              index={index}
              removeUDID={this.removeUDID}
              lazyRemoveUDID={this.lazyRemoveUDID}
              {...childProps}
            />
          );
        }),
      );
    }
  };
}
