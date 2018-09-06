document.addEventListener(`DOMContentLoaded`, function(){;
  console.log ('We have pignition 🐖');
  document.getElementById('form').addEventListener('submit', newHog)
  hogFetcher();
});

function hogFetcher(){
  // console.log (`load 'em up`)
  fetch(`http://localhost:3000/hogs`)
  .then(data => data.json())
  .then(jsonData => hogParse(jsonData))
};

function hogParse(jsonData){
  jsonData.forEach(function(hog){
    renderHog(hog)
  })
}

function renderHog(hog){
  let hogHouse = document.getElementById(`hog-container`)

  let hogPen = document.createElement('div')
  let hogName = document.createElement('h2')
  let hogSpec = document.createElement('li')
  let hogWeight = document.createElement('li')
  let hogMedal = document.createElement('li')
  let hogImg = document.createElement('img')
  let hogGreased = document.createElement(`div`)
  let greasedCheck = document.createElement('input')
  let greasedCheckLbl = document.createElement('label')
  let deleteBtn = document.createElement('button')
  let greaseStatus

  hogPen.className = "hog-card"
  hogPen.id = `hogPenId_${hog.id}`
  hogName.innerText = hog.name
  hogSpec.innerText = `Specialty: ${hog.specialty}`
  hogWeight.innerText = `Weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water: ${hog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water']}`
  hogMedal.innerText = `Highest medal achieved: ${hog['highest medal achieved']}`
  hogImg.src = hog.image
  deleteBtn.innerText = `Delete Hog`
  deleteBtn.id = `hogId_${hog.id}`
  deleteBtn.addEventListener('click', deleteHog)

  greasedCheckLbl.innerText = "Greased: "
  greasedCheck.setAttribute("type", "checkbox")
  greasedCheck.id = `hogCheckId_${hog.id}`
  greasedCheck

  greasedCheck.addEventListener('change', fetchPatch)
  greasedCheck.checked = hog.greased
  hogGreased.appendChild(greasedCheckLbl)
  hogGreased.appendChild(greasedCheck)

  hogPen.appendChild(hogName)
  hogPen.appendChild(hogImg)
  hogPen.appendChild(hogSpec)
  hogPen.appendChild(hogWeight)
  hogPen.appendChild(hogMedal)
  hogPen.appendChild(hogGreased)
  hogPen.appendChild(deleteBtn)
  hogHouse.appendChild(hogPen)
}

function newHog(e){
  e.preventDefault()
  let newHog = {}
  newHog["name"] = e.target[0].value
  newHog["specialty"] = e.target[1].value
  newHog[`highest medal achieved`] = e.target[2].value
  newHog['weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water'] = e.target[3].value
  newHog['image'] = e.target[4].value
  newHog['greased'] = e.target[5].checked
  fetchPost(newHog)
}

function fetchPost(newHog){
  fetch("http://localhost:3000/hogs", {
    method: "POST",
    body: JSON.stringify(newHog),
    headers:{
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(json => renderHog(json))
  document.getElementById('hog-form').reset()
  scrollTo(0,document.body.scrollHeight)
}

function deleteHog(e){
  let hogId = e.target.id.split("_")[1]
  fetch(`http://localhost:3000/hogs/${hogId}`, {
    method: "DELETE"
  })
  .then(document.getElementById(`hogPenId_${hogId}`).remove())
}

function fetchPatch(e){
  fetch(`http://localhost:3000/hogs/${e.target.id.split("_")[1]}`,
  {
    method: "PATCH",
    body: JSON.stringify({greased: e.target.checked}
    ),
    headers:{
      'Content-Type': 'application/json'
    }
  })
}
