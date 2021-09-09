const { beforeEach, afterEach, test } = require('@jest/globals');
const Consumer = require('./consumer');

const realDateNow = Date.now.bind(global.Date);
let fakeDateNowValue;
let consumer;

const shiftCurrentTime = (minutes) => {
  fakeDateNowValue += minutes * 60 * 1000;
};

beforeEach(() => {
  jest.useFakeTimers();
  fakeDateNowValue = 0;
  global.Date.now = jest.fn(() => fakeDateNowValue);
  consumer = new Consumer();
});

afterEach(() => {
  jest.useRealTimers();
  global.Date.now = realDateNow;
});

test('calculates average', () => {
  expect(consumer.mean()).toBe(NaN);
  consumer.accept(2);
  expect(consumer.mean()).toBe(2);
  consumer.accept(3);
  expect(consumer.mean()).toBe(2.5);
  consumer.accept(4);
  expect(consumer.mean()).toBe(3);
  consumer.accept(-10);
  expect(consumer.mean()).toBe(-0.25);
  consumer.accept(0.5);
  expect(consumer.mean()).toBe(-0.1);
});

test('rejects old numbers', () => {
  consumer.accept(2);
  consumer.accept(3);
  consumer.accept(4);
  expect(consumer.mean()).toBe(3);
  shiftCurrentTime(2);
  expect(consumer.mean()).toBe(3);
  consumer.accept(1);
  consumer.accept(2);
  expect(consumer.mean()).toBe(2.4);
  shiftCurrentTime(4);
  expect(consumer.mean()).toBe(1.5);
  shiftCurrentTime(1.1);
  expect(consumer.mean()).toBe(NaN);
});

test('reallocates memory', () => {
  consumer.accept(2);
  consumer.accept(3);
  consumer.accept(4);
  expect(consumer.mean()).toBe(3);
  shiftCurrentTime(6);
  consumer.accept(30);
  expect(consumer.mean()).toBe(30);
  jest.runAllTimers();
  expect(consumer.mean()).toBe(30);
});
