import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';
import { SupersetClient } from '@superset-ui/connection';
import { Button } from 'react-bootstrap';
import { nonEmpty } from '../../validators';
import {
  ALARM_SEVERITY_TYPES,
  ALARM_CHECK_INTERVAL_TYPES,
  ALARM_TRIGGER_AGGREGATE,
  ALARM_TRIGGER_TIME_SHIFT,
  ALARM_TRIGGER_COMPARE,
} from '../../../modules/AlarmTypes';
import PopoverSection from '../../../components/PopoverSection';
import SelectControl from './SelectControl';
import TextControl from './TextControl';

/**
 * 告警页面 control
 * 参考 annotation layer
 */

const propTypes = {
  alertName: PropTypes.string,
  checkInterval: PropTypes.string,
  severity: PropTypes.string,
  receiver: PropTypes.string,
  message: PropTypes.string,
  aggregate: PropTypes.string,
  timeShift: PropTypes.number,
  compareLimit: PropTypes.string,
  triggerVal: PropTypes.number,

  addAlarmLayer: PropTypes.func,
  removeAlarmLayer: PropTypes.func,
  close: PropTypes.func,
};

const defaultProps = {
  alertName: '',
  checkInterval: '',
  severity: '',
  receiver: '',
  message: '',
  aggregate: '',
  timeShift: '',
  compareLimit: '',
  triggerVal: 0,

  addAlarmLayer: () => {},
  removeAlarmLayer: () => {},
  close: () => {},
};

export default class AlarmLayer extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      alertName,
      checkInterval,
      severity,
      receiver,
      message,
      aggregate,
      timeShift,
      compareLimit,
      triggerVal,
    } = props;

    this.state = {
      // base
      alertName,
      oldAlertName: !this.props.alertName ? null : alertName,
      checkInterval,
      severity,
      receiver,
      message,
      aggregate,
      timeShift,
      compareLimit,
      triggerVal,
      // refData
      isNew: !this.props.alertName,
      isLoadingOptions: true,
      valueOptions: [],
      validationErrors: {},
    };
    this.submitAlarm = this.submitAlarm.bind(this);
    this.applyAlarm = this.applyAlarm.bind(this);
    this.deleteAlarm = this.deleteAlarm.bind(this);
    this.isValidForm = this.isValidForm.bind(this);
  }

  componentDidMount() {
    const { severity, isLoadingOptions } = this.state;
    this.fetchOptions(severity, isLoadingOptions);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sourceType !== this.state.sourceType) {
      this.fetchOptions(this.state.annotationType, this.state.sourceType, true);
    }
  }

  fetchOptions(severity, isLoadingOptions) {
    if (isLoadingOptions === true) {
      SupersetClient.get({});
    }
  }

  isValidForm() {
    const {
      alertName,
      checkInterval,
      severity,
      receiver,
      aggregate,
      timeShift,
      compareLimit,
      triggerVal,
    } = this.state;

    const errors = [
      nonEmpty(alertName),
      nonEmpty(severity),
      nonEmpty(receiver),
      nonEmpty(checkInterval),
      nonEmpty(aggregate),
      nonEmpty(timeShift),
      nonEmpty(compareLimit),
      nonEmpty(triggerVal),
    ];

    return !errors.filter(x => x).length;
  }

  deleteAlarm() {
    this.props.close();
    if (!this.state.isNew) {
      this.props.removeAlarmLayer(this.state);
    }
  }

  applyAlarm() {
    if (this.state.alertName.length) {
      const alarm = {};
      Object.keys(this.state).forEach(k => {
        if (this.state[k] !== null) {
          alarm[k] = this.state[k];
        }
      });
      delete alarm.isNew;
      delete alarm.valueOptions;
      delete alarm.isLoadingOptions;
      delete alarm.validationErrors;
      console.log('==========================');
      console.log(alarm);
      this.props.addAlarmLayer(alarm);
      this.setState({ isNew: false, oldAlertName: this.state.alertName });
    }
  }

  submitAlarm() {
    this.applyAlarm();
    this.props.close();
  }

  renderAlertConfigure() {
    const {
      alertName,
      checkInterval,
      severity,
      receiver,
      message,
    } = this.state;

    return (
      <div
        style={{
          marginRight: '2rem',
          width: 300,
        }}
      >
        <PopoverSection
          isSelected
          onSelect={() => {}}
          title={t('Alert Configuration')}
          info={t('Configure the alert setting.')}
        >
          <TextControl
            name="alert-config-name"
            label={t('Name')}
            placeholder=""
            value={alertName}
            onChange={v => this.setState({ alertName: v })}
            validationErrors={!alertName ? [t('Mandatory')] : []}
          />
          <SelectControl
            hovered
            description={t('choose the alert Severity type')}
            label={t('Alarm Severity')}
            name="alarm-severity"
            options={ALARM_SEVERITY_TYPES}
            value={severity}
            onChange={v => this.setState({ severity: v })}
          />
          <SelectControl
            hovered
            description={t('choose the alert check interval')}
            label={t('Check Interval')}
            name="alert-check-interval"
            options={ALARM_CHECK_INTERVAL_TYPES}
            value={checkInterval}
            onChange={v => this.setState({ checkInterval: v })}
          />
          <TextControl
            name="alert-config-receiver"
            label={t('Receiver')}
            placeholder=""
            value={receiver}
            onChange={v => this.setState({ receiver: v })}
            validationErrors={!receiver ? [t('Mandatory')] : []}
          />
          <TextControl
            name="alert-config-message"
            label={t('Message')}
            placeholder=""
            value={message}
            onChange={v => this.setState({ message: v })}
          />
        </PopoverSection>
      </div>
    );
  }

  renderTriggerConfigure() {
    const { aggregate, timeShift, compareLimit, triggerVal } = this.state;

    return (
      <div
        style={{
          marginRight: '2rem',
          width: 300,
        }}
      >
        <PopoverSection
          isSelected
          onSelect={() => {}}
          title={t('Trigger Condition Configuration')}
          info={t('Configure the alert trigger condition.')}
        >
          <SelectControl
            name="alert-trigger-aggregate"
            label={t('Aggregate')}
            hovered
            description={t('choose the alert trigger condition aggregate')}
            options={ALARM_TRIGGER_AGGREGATE}
            value={aggregate}
            onChange={v => this.setState({ aggregate: v })}
          />
          <SelectControl
            hovered
            description={t('choose the alert trigger time shift')}
            label={t('Time Shift')}
            name="alert-trigger-time-shift"
            options={ALARM_TRIGGER_TIME_SHIFT}
            value={timeShift}
            onChange={v => this.setState({ timeShift: v })}
          />
          <SelectControl
            hovered
            description={t('choose alert compare')}
            label={t('Compare')}
            name="alert-trigger-compare"
            options={ALARM_TRIGGER_COMPARE}
            value={compareLimit}
            onChange={v => this.setState({ compareLimit: v })}
          />
          <TextControl
            name="alert-trigger-value"
            label={t('Value')}
            placeholder=""
            value={triggerVal}
            onChange={v => this.setState({ triggerVal: v })}
            validationErrors={!triggerVal ? [t('Mandatory')] : []}
          />
        </PopoverSection>
      </div>
    );
  }

  render() {
    const { isNew } = this.state;
    const isValid = this.isValidForm();

    return (
      <div>
        {this.props.error && (
          <span style={{ color: 'red' }}>ERROR: {this.props.error}</span>
        )}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {this.renderAlertConfigure()}
          {this.renderTriggerConfigure()}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button bsSize="sm" onClick={this.deleteAlarm}>
            {!isNew ? t('Remove') : t('Cancel')}
          </Button>
          <div>
            <Button bsSize="sm" disabled={!isValid} onClick={this.applyAlarm}>
              {t('Apply')}
            </Button>
            <Button bsSize="sm" disabled={!isValid} onClick={this.submitAlarm}>
              {t('OK')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

AlarmLayer.propTypes = propTypes;
AlarmLayer.defaultProps = defaultProps;
