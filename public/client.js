$(document).ready(() => {
  startTime();

  createCalendar('http://localhost:3000/prov');
  createCalendar('http://localhost:3000/uppgifter');

  $('.table').fadeIn(1000).removeClass('hidden');

  $('.form-control-lg').keypress(e => {
    if (e.which == 13) {
      query = $('.form-control').val();
      window.location.href = "https://google.com/search?q=" + query;
    }
  });
});

function createCalendar(url) {
  var tableindex = (url == 'http://localhost:3000/prov') ? 0 : 1;
  var tablebody = document.getElementsByTagName('tbody')[tableindex];

  $.ajax({
    url: url,
    type: 'GET',
    success: (events) => {
      events.forEach((event) => {
        var row = document.createElement('tr');

        var subject = document.createElement('td');
        var name = document.createElement('td');
        var day = document.createElement('td');
        var time = document.createElement('td');

        subject.innerText = event.description;
        name.innerText = event.summary;

        if (event.start.dateTime) {
          start = new Date(event.start.dateTime);
          end = new Date(event.end.dateTime);

          if (start.getMonth() + 1 < 10)
            day.innerText = start.getFullYear() + '-' + ('0' + (start.getMonth() + 1)) + '-' + start.getDate();
          else
            day.innerText = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();

          if (tableindex == 0) {
            if (start.getMinutes() < 10)
              start = start.getHours() + ':' + start.getMinutes() + '0';
            else
              start = start.getHours() + ':' + start.getMinutes();

            if (end.getMinutes() < 10)
              end = end.getHours() + ':' + end.getMinutes() + '0';
            else
              end = end.getHours() + ':' + end.getMinutes();

            time.innerText = start + ' - ' + end;
          }
          else if (tableindex == 1) {
            if (start.getMinutes() < 10)
              time.innerText = start.getHours() + ':' + start.getMinutes() + '0';
            else
              time.innerText = start.getHours() + ':' + start.getMinutes();
          }

        }
        else if (event.start.date) {
          day.innerText = event.start.date;
          time.innerText = 'Ingen bestämd tid';
        }

        row.appendChild(subject);
        row.appendChild(name);
        row.appendChild(day);
        row.appendChild(time);

        tablebody.appendChild(row);
      });
    },
    error: (err) => {
      var row = document.createElement('tr');
      var message = document.createElement('td');

      message.innerHTML = (tableindex == 0) ? 'Inga prov \u{1F64F}' : 'Inga inlämmningar \u{1F605}';
      message.colSpan = 4;
      message.className = "text-center";

      row.appendChild(message);
      tablebody.appendChild(row);
    }
  });
}

function startTime() {
  var days = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
  var months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  var today = new Date();
  var h = today.getHours();
  var m = today.getMinutes();
  var day = days[today.getDay()];
  var month = months[today.getMonth()];
  m = checkTime(m);
  document.getElementsByClassName('clock')[0].children[0].innerText = h + ':' + m;
  document.getElementsByClassName('clock')[0].children[1].innerText = day + ', ' + today.getDate() + ' ' + month;
  setTimeout(startTime, 1000);
}

function checkTime(i) {
  if (i < 10) {
    i = '0' + i; // add a zero in front of numbers < 10
  }
  return i;
}