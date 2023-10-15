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

  if (years >= 1)
    return (
      moment().format('MMM') +
      ' ' +
      moment().format('D') +
      ', ' +
      moment(time).format('YYYY')
    );
  if (months >= 1)
    return (
      moment(time).format('MMM') +
      ' ' +
      moment().format('D') +
      ' ' +
      'at' +
      ' ' +
      moment().format('h:mm A')
    );
  if (weeks >= 1) return Math.round(weeks) + 'w';
  if (days >= 1) return Math.round(days) + 'd';
  if (hours >= 1) return Math.round(hours) + 'h';
  if (minutes >= 1) return Math.round(minutes) + 'm';
  if (seconds >= 1) return '1m';
  if (seconds === 0) return 'Just now';
}

export default shortenMoment;
