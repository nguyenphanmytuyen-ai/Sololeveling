import test from 'node:test';
import assert from 'node:assert/strict';
import { vietnamTaskGroup, vietnamDateKey, msUntilVietnamMidnight } from './vietnamCalendar.js';
import { CAMPUS_EVENTS } from '../data/events.js';
test('Vietnam Friday/Saturday and Sunday/Monday boundaries are independent of device time', () => {
  for (const [instant, group] of [
    ['2026-11-20T16:59:59Z','WEEKDAY'], ['2026-11-20T17:00:00Z','WEEKEND'],
    ['2026-11-22T16:59:59Z','WEEKEND'], ['2026-11-22T17:00:00Z','WEEKDAY'],
  ]) assert.equal(vietnamTaskGroup(new Date(instant)),group);
  assert.equal(vietnamDateKey(new Date('2026-11-20T17:00:00Z')),'2026-11-21');
  assert.equal(msUntilVietnamMidnight(new Date('2026-11-20T16:59:59Z')),1050);
});
test('Weekly groups are exclusive, cover all weekdays and preserve occurrence keys', () => {
  const weekday = CAMPUS_EVENTS.find(e=>e.id==='ev-study-marathon')!;
  const weekend = CAMPUS_EVENTS.find(e=>e.id==='ev-weekend-boss')!;
  for(let day=16;day<=22;day++) {
    const now = new Date(`2026-11-${day}T12:00:00+07:00`);
    assert.equal(weekday.isActive(now,'').active,day<=20);
    assert.equal(weekend.isActive(now,'').active,day>=21);
    if(day<=20) assert.equal(weekday.isActive(now,'').occurrenceKey,'marathon-2026-11-16');
  }
  assert.equal(weekend.isActive(new Date('2026-11-22T12:00:00+07:00'),'').occurrenceKey,'sat-2026-11-21');
});
