// @flow weak

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import { shuffle } from 'd3-array';
import { interval } from 'd3-timer';
import Surface from 'docs/src/components/Surface';
import MarkdownElement from 'docs/src/components/MarkdownElement';
import { VIEW, TRBL, ALPHABET, BASE_DURATION } from '../module/constants';
import TextGroup from './TextGroup';
import { dataUpdate, makeGetSelectedData, dims } from '../module';
import description from '../description.md';

export class Example extends Component {

  componentDidMount() {
    const { props: { dispatch } } = this;

    this.loop = interval(() => {
      dispatch(dataUpdate(shuffle(ALPHABET)
        .slice(0, Math.floor(Math.random() * 26))
        .sort()));
    }, BASE_DURATION * 1.5);
  }

  componentWillUnmount() {
    this.loop.stop();
  }

  loop = null // interval set on mount

  render() {
    return (
      <Paper style={{ padding: 20 }}>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <MarkdownElement text={description} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <Surface view={VIEW} trbl={TRBL}>
                  <line
                    stroke="grey"
                    x1={0} y1={dims[1] / 2}
                    x2={dims[0]} y2={dims[1] / 2}
                  />
                  <TextGroup
                    data={this.props.data}
                    className="text-group"
                  />
                </Surface>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    );
  }
}

Example.propTypes = {
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const makeMapStateToProps = () => {
  const getSelectedData = makeGetSelectedData();
  const mapStateToProps = (state) => {
    return getSelectedData(state);
  };
  return mapStateToProps;
};


export default connect(makeMapStateToProps())(Example);
