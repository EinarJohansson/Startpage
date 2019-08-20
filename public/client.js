fetch('http://localhost:3000/assignments')
  .then((res) => {
    return res.json();
  })
  .then((tests) => {
    /* 
    name        - tests[n].summary
    description - tests[n].description
    location    - tests[n].location
    start       - tests[n].start.dateTime
    end         - tests[n].end.dateTime
    event id    - tests[n].id
    */
    console.log(tests[0]);
    
  });