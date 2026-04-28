import dayjs from '../dayjs';

const formatTime = (milliseconds: number) => {
  const duration = dayjs.duration(milliseconds, 'milliseconds');
  if (duration.asYears() >= 1) {
    return duration.format('Y:D:HH:mm:ss');
  } else if (duration.asDays() >= 1) {
    return duration.format('D:HH:mm:ss');
  } else if (duration.asHours() >= 1) {
    return duration.format('HH:mm:ss');
  }
  return duration.format('mm:ss');
};
export default formatTime;
