import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';
import {
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Popover,
} from 'react-bootstrap';
import AlarmLayer from './AlarmLayer';
import { runAlertQuery } from '../../../chart/chartAction';
import InfoTooltipWithTrigger from '../../../components/InfoTooltipWithTrigger';
import { getChartKey } from '../../exploreUtils';

/**
 * 设置
 * @type {{}}
 */
const propTypes = {
  alarmError: PropTypes.object,
  alarmQuery: PropTypes.object,
  vizType: PropTypes.string,

  validationErrors: PropTypes.array,
  alertName: PropTypes.string.isRequired,
  actions: PropTypes.object,
  value: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  refreshAlarmData: PropTypes.func,
};

const defaultProps = {
  vizType: '',
  value: [],
  alarmError: {},
  alarmQuery: {},
  onChange: () => {},
};

class AlarmLayerControl extends React.PureComponent {
  constructor(props) {
    super(props);
    this.addAlarmLayer = this.addAlarmLayer.bind(this);
    this.removeAlarmLayer = this.removeAlarmLayer.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { alertName, alarmError, validationErrors, value } = nextProps;
    if (Object.keys(alarmError).length && !validationErrors.length) {
      this.props.actions.setControlValue(
        alertName,
        value,
        Object.keys(alarmError),
      );
    }

    if (!Object.keys(alarmError).length && validationErrors.length) {
      this.props.actions.setControlValue(alertName, value, []);
    }
  }

  addAlarmLayer(alarmLayer) {
    const alarm = alarmLayer;
    let alarms = this.props.value.slice();
    const i = alarms.findIndex(
      x => x.alertName === (alarm.oldAlertName || alarm.alertName),
    );
    delete alarm.oldAlertName;

    if (i > -1) {
      alarms[i] = alarm;
    } else {
      alarms = alarms.concat(alarm);
    }

    this.props.onChange(alarms);
  }

  removeAlarmLayer(alarm) {
    const alarms = this.props.value
      .slice()
      .filter(x => x.alertName !== alarm.oldAlertName);
    this.props.onChange(alarms);
  }

  renderPopover(parent, alarm, error) {
    const id = !alarm ? '_new' : alarm.alertName;
    return (
      <Popover
        style={{ maxWidth: 'none' }}
        title={alarm ? t('Edit Alert') : t('Add Alert')}
        id={`alert-pop-${id}`}
      >
        <AlarmLayer
          {...alarm}
          error={error}
          vizType={this.props.vizType}
          addAlarmLayer={this.addAlarmLayer}
          removeAlarmLayer={this.removeAlarmLayer}
          close={() => this.refs[parent].hide()}
        />
      </Popover>
    );
  }

  renderInfo(alarm) {
    const { alarmError, alarmQuery } = this.props;
    if (alarmQuery[alarm.alertName]) {
      return (
        <i className="fa fa-refresh" style={{ color: 'orange' }} aria-hidden />
      );
    }

    if (alarmError[alarm.alertName]) {
      return (
        <InfoTooltipWithTrigger
          label="validation-errors"
          bsStyle="danger"
          tooltip={alarmError[alarm.alertName]}
        />
      );
    }

    return '';
  }

  render() {
    const alarms = this.props.value.map((ala, i) => (
      <OverlayTrigger
        key={i}
        trigger="click"
        rootClose
        ref={`overlay-${i}`}
        placement="right"
        overlay={this.renderPopover(
          `overlay-${i}`,
          ala,
          this.props.alarmError[ala.alertName],
        )}
      >
        <ListGroupItem>
          <span>{ala.alertName}</span>
          <span style={{ float: 'right' }}>{this.renderInfo(ala)}</span>
        </ListGroupItem>
      </OverlayTrigger>
    ));

    return (
      <div>
        <ListGroup>
          {alarms}
          <OverlayTrigger
            trigger="click"
            rootClose
            ref="overlay-new"
            placement="right"
            overlay={this.renderPopover('overlay-new')}
          >
            <ListGroupItem>
              <i className="fa fa-plus" /> &nbsp; {t('Add Alert')}
            </ListGroupItem>
          </OverlayTrigger>
        </ListGroup>
      </div>
    );
  }
}

AlarmLayerControl.propTypes = propTypes;
AlarmLayerControl.defaultProps = defaultProps;

function mapStateToProps({ charts, explore }) {
  const chartKey = getChartKey(explore);
  const chart = charts[chartKey] || charts[0] || {};

  return {
    alarmError: chart.alarmError,
    alarmQuery: chart.alarmQuery,
    vizType: explore.controls.viz_type.value,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshAlarmData: alarmLayer => dispatch(runAlertQuery(alarmLayer)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlarmLayerControl);
