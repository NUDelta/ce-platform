import { Schema } from '../schema.js';

Schema.Duration = new SimpleSchema({
  interval: {
    type: Number,
    label: 'Interval between checks (minutes)'
  },
  counts: {
    type: Number,
    label: 'Number of repeats'
  }
});

Schema.Schedule = new SimpleSchema({
  startTime: {
    type: Number
  },
  endTime: {
    type: Number
  },
  repeatType: {
    type: String
  }
});

