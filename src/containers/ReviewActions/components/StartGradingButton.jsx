import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Button,
} from '@edx/paragon';
import { Cancel, Highlight } from '@edx/paragon/icons';

import selectors from 'data/selectors';
import thunkActions from 'data/thunkActions';
import { gradingStatuses as statuses } from 'data/services/lms/constants';

import StopGradingConfirmModal from './StopGradingConfirmModal';
import OverrideGradeConfirmModal from './OverrideGradeConfirmModal';

export const buttonArgs = {
  [statuses.ungraded]: {
    label: 'Start Grading',
    iconAfter: Highlight,
  },
  [statuses.graded]: {
    label: 'Override grade',
    iconAfter: Highlight,
  },
  [statuses.inProgress]: {
    label: 'Stop grading this response',
    iconAfter: Cancel,
  },
};

export class StartGradingButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmStopGrading: false,
      showConfirmOverrideGrade: false,
    };

    this.showConfirmStopGrading = this.showConfirmStopGrading.bind(this);
    this.hideConfirmStopGrading = this.hideConfirmStopGrading.bind(this);
    this.showConfirmOverrideGrade = this.showConfirmOverrideGrade.bind(this);
    this.hideConfirmOverrideGrade = this.hideConfirmOverrideGrade.bind(this);
    this.confirmStopGrading = this.confirmStopGrading.bind(this);
    this.confirmOverrideGrade = this.confirmOverrideGrade.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  showConfirmStopGrading() {
    this.setState({ showConfirmStopGrading: true });
  }

  hideConfirmStopGrading() {
    this.setState({ showConfirmStopGrading: false });
  }

  showConfirmOverrideGrade() {
    this.setState({ showConfirmOverrideGrade: true });
  }

  hideConfirmOverrideGrade() {
    this.setState({ showConfirmOverrideGrade: false });
  }

  confirmStopGrading() {
    this.hideConfirmStopGrading();
    this.props.stopGrading();
  }

  confirmOverrideGrade() {
    this.hideConfirmOverrideGrade();
    this.props.startGrading();
  }

  handleClick() {
    if (this.props.gradingStatus === statuses.inProgress) {
      this.showConfirmStopGrading();
    } else if (this.props.gradingStatus === statuses.graded) {
      this.showConfirmOverrideGrade();
    } else {
      this.props.startGrading();
    }
  }

  render() {
    const { gradingStatus } = this.props;
    if (gradingStatus === statuses.locked) {
      return null;
    }
    const args = buttonArgs[gradingStatus];
    return (
      <>
        <Button
          variant="primary"
          iconAfter={args.iconAfter}
          onClick={this.handleClick}
        >
          {args.label}
        </Button>
        <OverrideGradeConfirmModal
          isOpen={this.state.showConfirmOverrideGrade}
          onCancel={this.hideConfirmOverrideGrade}
          onConfirm={this.confirmOverrideGrade}
        />
        <StopGradingConfirmModal
          isOpen={this.state.showConfirmStopGrading}
          onCancel={this.hideConfirmStopGrading}
          onConfirm={this.confirmStopGrading}
        />
      </>
    );
  }
}

StartGradingButton.propTypes = {
  gradingStatus: PropTypes.string.isRequired,
  startGrading: PropTypes.func.isRequired,
  stopGrading: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  gradingStatus: selectors.grading.selected.gradingStatus(state),
});

export const mapDispatchToProps = {
  startGrading: thunkActions.grading.startGrading,
  stopGrading: thunkActions.grading.stopGrading,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartGradingButton);