import React from 'react';
import PropTypes from 'prop-types';
import { t } from '@superset-ui/translation';
import { SupersetClient } from '@superset-ui/connection';
import { Button } from 'react-bootstrap';
import { nonEmpty } from '../../validators';
import {
  ALARM_SEVERITY_TYPES,
  ALARM_CHECK_INTERVAL_TYPES,
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
  checkInterval: PropTypes.number,
  severity: PropTypes.string,
  receivers: PropTypes.arrayOf(PropTypes.string),
  chatIds: PropTypes.arrayOf(PropTypes.string),
  message: PropTypes.string,
  timeShift: PropTypes.number,
  compare: PropTypes.string,
  triggerVal1: PropTypes.number,
  triggerVal2: PropTypes.number,

  addAlarmLayer: PropTypes.func,
  removeAlarmLayer: PropTypes.func,
  close: PropTypes.func,
};

const defaultProps = {
  alertName: '',
  checkInterval: 0,
  severity: '',
  receivers: [],
  chatIds: [],
  message: '',
  timeShift: 0,
  compare: '',
  triggerVal1: 0,
  triggerVal2: 0,

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
      receivers,
      chatIds,
      message,
      timeShift,
      compare,
      triggerVal1,
      triggerVal2,
    } = props;

    this.state = {
      // base
      alertName,
      oldAlertName: !this.props.alertName ? null : alertName,
      checkInterval,
      severity,
      receivers,
      chatIds,
      message,
      timeShift,
      compare,
      triggerVal1,
      triggerVal2,
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
    this.handleStringToInt = this.handleStringToInt.bind(this);
  }

  isValidForm() {
    const {
      alertName,
      checkInterval,
      severity,
      receivers,
      chatIds,
      timeShift,
      compare,
      triggerVal1,
      triggerVal2,
    } = this.state;

    const errors = [
      nonEmpty(alertName),
      nonEmpty(severity),
      nonEmpty(checkInterval),
      nonEmpty(timeShift),
      nonEmpty(compare),
    ];

    if ((receivers.length === 0) && (chatIds.length === 0)) {
      errors.push(nonEmpty(receivers))
    }
    if (((compare === "outside_range") || (compare === "within_range")) &&
        (this.handleStringToInt(triggerVal1) >= this.handleStringToInt(triggerVal2))) {
      errors.push(t('Start Trigger Value must less End Trigger Value'))
    }
    return !errors.filter(x => x).length;
  }

  deleteAlarm() {
    this.props.close();
    if (!this.state.isNew) {
      this.props.removeAlarmLayer(this.state);
    }
  }

  handleStringToInt(value) {
    if (isNaN(parseFloat(value))) {
      return 0;
    }

    return parseFloat(value);
  }

  applyAlarm() {
    if (this.state.alertName.length) {
      const alarm = {};
      Object.keys(this.state).forEach(k => {
        if (this.state[k] !== null) {
          if ((k === "triggerVal1") || (k === "triggerVal2")) {
            alarm[k] = this.handleStringToInt(this.state[k]);
          } else {
            alarm[k] = this.state[k];
          }
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
      receivers,
      chatIds,
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
            onChange={v => this.setState({ severity: v, receivers: [], chatIds: []})}
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
          <SelectControl
            hovered
            name="alert-config-receivers"
            label="Receivers"
            description={`Fill in the Receivers who need to receive this alert message`}
            multi={true}
            freeForm={true}
            valueKey='column_name'
            allowAll={true}
            commaChoosesOption={false}
            value={receivers}
            onChange={v => this.setState({ receivers: v })}
          />
          {(severity === "WORK_WECHAT") && (
              <SelectControl
                hovered
                name="alert-config-chatIds"
                label="ChatIds"
                description={`Fill in the ChatIds, work-wechat groups will receive alert`}
                multi={true}
                freeForm={true}
                valueKey='column_name'
                allowAll={true}
                commaChoosesOption={false}
                value={chatIds}
                onChange={v => this.setState({ chatIds: v })}
              />
          )}
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

  renderTriggerCompare() {
    const { compare, triggerVal1, triggerVal2 } = this.state;

    if ((compare === "outside_range") || (compare === "within_range")) {
      return (
          <div>
            <TextControl
              name="alert-trigger-value1"
              label={"Start Trigger Value"}
              placeholder=""
              type={"number"}
              value={triggerVal1}
              onChange={v => this.setState({ triggerVal1: v })}
            />
            <TextControl
              name="alert-trigger-value2"
              label={"End Trigger Value"}
              placeholder=""
              type={"number"}
              value={triggerVal2}
              onChange={v => this.setState({ triggerVal2: v })}
            />
          </div>
      );
    } else {
      return (
          <div>
            <TextControl
              name="alert-trigger-value1"
              label={"Value"}
              placeholder=""
              type={"number"}
              value={triggerVal1}
              onChange={v => this.setState({ triggerVal1: v })}
            />
          </div>
      );
    }
  }

  renderTriggerConfigure() {
    const { timeShift, compare } = this.state;

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
            value={compare}
            onChange={v => this.setState({ compare: v, triggerVal1: 0, triggerVal2: 0})}
          />
          {this.renderTriggerCompare()}
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
