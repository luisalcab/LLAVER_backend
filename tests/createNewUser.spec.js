const fetch = require('node-fetch-commonjs');



async function data(){
  return await fetch ('http://localhost:3002/paciente/obtenerPacienteId/25', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            // mode: 'cors', // no-cors, *cors, same-origin
            // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWREb2N0b3IiOjQ4LCJpYXQiOjE2NTEyMDM4MjMsImV4cCI6MTY1MTIxODI2M30.-wDW3ULpBF05LR4M1iN8QkJu4KABIX2JjqUuoM9CqZk',
            }
        })
        .then(async (response) => {
          
          const data = await response.json();
          return data.response.data
        })

}

data().then((data) => {console.log(data)})
;