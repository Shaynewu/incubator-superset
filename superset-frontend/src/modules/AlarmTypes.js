/**
 * 存放解析alarm 各个状态
 */

export const ALARM_SEVERITY_TYPES = [
  {
    value: 'EMAIL',
    label: 'email',
  },
  {
    value: 'WORK_WECHAT',
    label: 'work_wechat',
  },
];

export const ALARM_CHECK_INTERVAL_TYPES = [
  {
    value: 1,
    label: '1 minute',
  },
  {
    value: 5,
    label: '5 minute',
  },
  {
    value: 10,
    label: '10 minute',
  },
  {
    value: 15,
    label: '15 minute',
  },
  {
    value: 30,
    label: '30 minute',
  },
  {
    value: 60,
    label: '1 hour',
  },
];

export const ALARM_TRIGGER_AGGREGATE = [
  {
    value: 'max',
    label: 'Max()',
  },
  {
    value: 'min',
    label: 'Min()',
  },
  {
    value: 'avg',
    label: 'Avg()',
  },
  {
    value: 'sum',
    label: 'Sum()',
  },
];

// value is second
export const ALARM_TRIGGER_TIME_SHIFT = [
  {
    value: 5,
    label: '5 minute',
  },
  {
    value: 10,
    label: '10 minute',
  },
  {
    value: 15,
    label: '15 minute',
  },
  {
    value: 30,
    label: '30 minute',
  },
  {
    value: 45,
    label: '45 minute',
  },
  {
    value: 60,
    label: '1 hour',
  },
  {
    value: 120,
    label: '2 hour',
  },
  {
    value: 1440,
    label: '1 day',
  },
];

export const ALARM_TRIGGER_COMPARE = [
  {
    value: 'above',
    label: 'IS ABOVE',
  },
  {
    value: 'below',
    label: 'IS BELOW',
  },
  {
    value: 'outside_range',
    label: 'IS OUTSIDE RANGE',
  },
  {
    value: 'within_range',
    label: 'IS WITHIN RANGE',
  }
];

// 默认参数
export const DEFAULT_ALARM_CHECK_INTERVAL = ALARM_CHECK_INTERVAL_TYPES[0];
export const DEFAULT_ALARM_SEVERITY = ALARM_SEVERITY_TYPES[0];
export const DEFAULT_ALARM_TRIGGER_AGG = ALARM_TRIGGER_AGGREGATE[0];
export const DEFAULT_ALARM_TRIGGER_TIME_SHIFT = ALARM_TRIGGER_TIME_SHIFT[0];
export const DEFAULT_ALARM_TRIGGER_COMPARE = ALARM_TRIGGER_COMPARE[0];
