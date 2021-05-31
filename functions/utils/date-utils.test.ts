import { parseTime } from './date-utils';

describe('Date utils tests', function () {
  describe('#parseTime', function () {
    it('should return 12 hours for 12PM', function () {
      expect(parseTime('12:00PM')).toEqual({ hours: 12, minutes: 0 });
    });
  });
});
