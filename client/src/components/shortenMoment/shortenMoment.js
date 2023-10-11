import moment from 'moment';

function shortenMoment(time) {
  let dur = moment.duration(moment().diff(time));
  let seconds = dur.asSeconds();
  let minutes = dur.asMinutes();
  let hours = dur.asHours();
  let days = dur.asDays();
  let weeks = dur.asWeeks();
  let months = dur.asMonths();
  let years = dur.asYears();

  if (years >= 1) return Math.round(years) + 'y';
  if (months >= 1) return Math.round(months) + 'm';
  if (weeks >= 1) return Math.round(weeks) + 'w';
  if (days >= 1) return Math.round(days) + 'd';
  if (hours >= 1) return Math.round(hours) + 'h';
  if (minutes >= 1) return Math.round(minutes) + 'm';
  if (seconds >= 1) return '1m';
}

export default shortenMoment;
