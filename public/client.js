$(document).ready(() => {
  $.ajax({
    url: 'http://localhost:3000/tests',
    type: 'GET',
    success: (tests) => {
      /* 
      name        - tests[n].summary
      description - tests[n].description
      location    - tests[n].location
      start       - tests[n].start.dateTime
      end         - tests[n].end.dateTime
      event id    - tests[n].id
      */

      var calendar = document.getElementsByTagName('tbody')[0];

      tests.forEach(test => {
        var row = document.createElement('tr');
        var name = document.createElement('td');
        var date = document.createElement('td');

        name.innerText = test.summary;

        start = new Date(test.start.dateTime) || new Date(test.start.date);
        end = new Date(test.end.dateTime) || new Date(test.end.date);

        date.innerText = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " " + start.getHours() + ":" + start.getMinutes() + ":" + start.getSeconds() + ' - ' + end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " " + end.getHours() + ":" + end.getMinutes() + ":" + end.getSeconds()

        row.appendChild(name);
        row.appendChild(date);

        calendar.appendChild(row);
      });
    }
  });
});