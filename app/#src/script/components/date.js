const dateTime = new Date();
const date = {
    day: dateTime.getDate(),
    month: dateTime.getMonth() + 1,
    year: dateTime.getFullYear(),
    hours: dateTime.getHours(),
    minutes: dateTime.getMinutes(),
}
const dateView = {
    day: document.querySelector('.date-select__day'),
    month: document.querySelector('.date-select__month'),
    year: document.querySelector('.date-select__year'),
    hours: document.querySelector('.time-select__hour'),
    minutes: document.querySelector('.time-select__minute'),
    meridiem: document.querySelector('.time-select__meridiem'),
}

dateView.day.options[date.day-1].selected = true;
dateView.month.options[date.month-1].selected = true;
dateView.year.options[date.year-2020].selected = true;

dateView.hours.options[date.hours > 11 ? date.hours-12 : date.hours].selected = true;
dateView.minutes.options[date.minutes].selected = true;
dateView.meridiem.options[date.hours > 11 ? 1 : 0].selected = true;




console.log(date.day, date.month , date.year, date.hours, date.minutes);
