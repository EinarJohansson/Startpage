$(document).ready(() => {
  startTime();

  getCoursework();
  getCalendars();

  $('.table').fadeIn(2000).removeClass('hidden');

  $('.form-control-lg').keypress(e => {
    if (e.which == 13) {
      query = $('.form-control').val();
      window.location.href = "https://google.com/search?q=" + query;
    }
  });
});

function getCoursework() {
  var tablebody = document.getElementsByTagName('tbody')[0];
  var url = 'http://localhost:3000/coursework';
  $.ajax({
    url: url,
    type: 'GET',
    dataType: "json",
    success: (events) => {
      console.log(events);

      const kurser = Object.keys(events)
      for (const kurs of kurser) {

        const uppgifter = Object.keys(events[kurs])
        for (const uppgift of uppgifter) {
          var row = document.createElement('tr');

          var course = document.createElement('td');
          var info = document.createElement('td');
          var name = document.createElement('td');
          var day = document.createElement('td');
          var time = document.createElement('td');

          course.className = 'text-truncate';
          info.className = 'text-truncate';
          name.className = 'text-truncate';
          day.className = 'text-truncate';
          time.className = 'text-truncate';

          course.innerText = kurs;
          info.innerText = "Uppgift";

          name.innerHTML = uppgift;

          if (events[kurs][uppgift].date) {
            var date = new Date(events[kurs][uppgift].date);

            day.innerText = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)) + '-' + date.getDate();
            time.innerText = date.getHours() + ':' + date.getMinutes();
          } else {
            day.innerText = 'Ingen bestämd dag';
            time.innerText = 'Ingen bestämd tid';
          }

          row.appendChild(course);
          row.appendChild(info);
          row.appendChild(name);
          row.appendChild(day);
          row.appendChild(time);

          tablebody.appendChild(row);
        }
      }
    }
  });
}


function getCalendars() {
  var tablebody = document.getElementsByTagName('tbody')[0];
  var urls = ['http://localhost:3000/prov', 'http://localhost:3000/uppgifter'];

  urls.forEach((url) => {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: "json",
      success: (events) => {
        events.forEach((event) => {
          var row = document.createElement('tr');

          var course = document.createElement('td');
          var info = document.createElement('td');
          var name = document.createElement('td');
          var day = document.createElement('td');
          var time = document.createElement('td');

          course.className = 'text-truncate';
          info.className = 'text-truncate';
          name.className = 'text-truncate';
          day.className = 'text-truncate';
          time.className = 'text-truncate';

          course.innerText = event.description;
          info.innerText = event.organizer.displayName;
          name.innerText = event.summary;

          if (event.start.dateTime) {
            start = new Date(event.start.dateTime);
            end = new Date(event.end.dateTime);

            day.innerText = start.getFullYear() + '-' + ('0' + (start.getMonth() + 1)) + '-' + start.getDate();

            if (info.innerText == "Prov") {
              time.innerText = start.getHours() + ':' + start.getMinutes() + ' - ' + end.getHours() + ':' + end.getMinutes();
            }
            else if (info.innerText == "Uppgift") {
              time.innerText = start.getHours() + ':' + start.getMinutes();
            }
          }
          else if (event.start.date) {
            day.innerText = event.start.date;
            time.innerText = 'Ingen bestämd tid';
          }

          row.appendChild(course);
          row.appendChild(info);
          row.appendChild(name);
          row.appendChild(day);
          row.appendChild(time);

          tablebody.appendChild(row);
        });
      }
    });
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