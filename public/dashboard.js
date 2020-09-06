// api url 
const api_url = 'http://localhost:4000/getUserDetails'; 
  
// Defining async function 
async function getapi(url) { 
    
    // Storing response 
    const response = await fetch(url);//GET
    
    // Storing data in form of JSON 
    var data = await response.json(); 
    console.log(data); 
  
    show(data); 
} 
// Calling that async function 
getapi(api_url); 
  

// Function to define innerHTML for HTML table 
function show(data) { 

    console.log(data)
    let tab =  
    `<tr> 
      <th>name</th> 
      <th>email</th> 
      
     </tr>`; 

    // Loop to access all rows  
    for (let r of data) { 
        tab += `<tr>  
        <td>${r.name} </td> 
        <td>${r.email}</td> 
      
    </tr>`; 
    } 
    // Setting innerHTML as tab variable 
    document.getElementById('data').innerHTML = tab; 

   
} 
