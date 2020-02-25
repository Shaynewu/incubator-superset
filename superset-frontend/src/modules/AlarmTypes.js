/**
 * 存放解析alarm 各个状态
 */

export const ALARM_SEVERITY_TYPES = [
  {
    value: 'EMAIL',
    label: 'email',
  },
  {
    value: 'WECHATWORK',
    label: 'wechat_work',
  },
];

export const ALARM_CHECK_INTERVAL_TYPES = [
  {
    value: 1,
    label: 'one minute',
  },
  {
    value: 5,
    label: 'five minute',
  },
  {
    value: 10,
    label: 'ten minute',
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
    value: 10,
    label: '10 second',
  },
  {
    value: 60,
    label: '1 minute',
  },
  {
    value: 300,
    label: '5 minute',
  },
  {
    value: 600,
    label: '10 minute',
  },
  {
    value: 900,
    label: '15 minute',
  },
  {
    value: 3600,
    label: '1 hour',
  },
  {
    value: 86400,
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
];

// 默认参数
export const DEFAULT_ALARM_CHECK_INTERVAL = ALARM_CHECK_INTERVAL_TYPES[0];
export const DEFAULT_ALARM_SEVERITY = ALARM_SEVERITY_TYPES[0];
export const DEFAULT_ALARM_TRIGGER_AGG = ALARM_TRIGGER_AGGREGATE[0];
export const DEFAULT_ALARM_TRIGGER_TIME_SHIFT = ALARM_TRIGGER_TIME_SHIFT[0];
export const DEFAULT_ALARM_TRIGGER_COMPARE = ALARM_TRIGGER_COMPARE[0];
