let numTeams = 2;
let numPlayersPerTeam = 2;

const teamSelection = {
  playerList: [],
  activeSelectList: [],
  leftoverList: []
}

function init() {
  // get cookies and apply their values to html elements
  const docs = _getInputDocs()

  const teamsNum = _getCookie("numTeams")
  const teamPlayersNum = _getCookie("numTeamPlayers")

  docs.numTeams.value = (teamsNum > 1) ? teamsNum : numTeams
  docs.numPlayers.value = (teamPlayersNum > 1) ? teamPlayersNum : numPlayersPerTeam
  docs.playerList.value = JSON.parse(_getCookie("playerListText")).join('\n')
  docs.priorityList.value = JSON.parse(_getCookie("priorityListText")).join('\n')

  adjustTextArea(docs.playerList)
  adjustTextArea(docs.priorityList)
}

// Public Functions
function randomizeTeams () {
  const players = _getPlayers()
  const teams = _createteams()
  const randomizedTeams = _randomizeTeams(players, teams)

  updatePage(players, randomizedTeams)
  saveCookies()
}

function updatePage(players, teams) {
  const priorityQueueText = players.leftoverList.join('\n')
  const priorityQueueTextArea = document.getElementById("priorityListText")

  priorityQueueTextArea.value = priorityQueueText
  adjustTextArea(priorityQueueTextArea)

  const teamsElement = document.getElementById("teams")
  _clearTeamsHTML(teamsElement)

  teams.forEach(team => {
    const teamBox = _createTeamHTMLElement(team)
    teamsElement.appendChild(teamBox)
  })
}

function saveCookies() {
  const docs = _getInputDocs()
  
  _setCookie("numTeams", docs.numTeams.value, 7)
  _setCookie("numTeamPlayers", docs.numPlayers.value, 7)
  _setCookie("playerListText", _encodeStringList(docs.playerList.value), 7)
  _setCookie("priorityListText", _encodeStringList(docs.priorityList.value), 7)

  console.log(decodeURIComponent(document.cookie))
}

function _getInputDocs() {
  return {
    numTeams: document.getElementById("numTeams"),
    numPlayers: document.getElementById("numTeamPlayers"),
    playerList: document.getElementById("playerListText"),
    priorityList: document.getElementById("priorityListText")
  }
}

function _encodeStringList(listString) {
  const arrayList = listString.split("\n").filter((name) => name.length > 1)
  const encodedList = encodeURIComponent(JSON.stringify(arrayList))

  return encodedList
}

function adjustTextArea(element) {
  element.style.height = ''
  element.style.height = `${element.scrollHeight + 5}px`
}

// Private Functions
function _createTeamHTMLElement(team) {
  const teamDiv = document.createElement("div")
  teamDiv.className = "tableClass"

  const teamTable = document.createElement("table")

  // Header
  const teamHeader = document.createElement("tr")
  const teamHeaderContent = document.createElement("th")
  teamHeaderContent.textContent = team.name
  teamHeader.appendChild(teamHeaderContent)
  teamTable.appendChild(teamHeader)

  // Content
  team.members.forEach(playerName => {
    const playerRow = document.createElement("tr")
    const playerCell = document.createElement("td")
    playerCell.textContent = playerName
    playerRow.appendChild(playerCell)
    teamTable.appendChild(playerRow)
  })

  teamDiv.appendChild(teamTable)
  
  return teamDiv
}

function _clearTeamsHTML(teamsElement) {
  teamsElement.innerHTML = ''
}

function _getPlayers() {
  // extract names from text area
  const players = document.getElementById("playerListText").value.split("\n").filter((name) => name.length > 1)

  teamSelection.playerList = players
  teamSelection.leftoverList = document.getElementById("priorityListText").value.split("\n").filter((name) => name.length > 1)
  teamSelection.activeSelectList = players.filter((player) => !teamSelection.leftoverList.includes(player))

  return teamSelection
}

function _createteams() {
  // get num players and teams
  const _numTeams = document.getElementById("numTeams").value
  const _numPlayersPerTeam = document.getElementById("numTeamPlayers").value

  numTeams = (_numTeams > 1) ? _numTeams : 1
  numPlayersPerTeam = (_numPlayersPerTeam > 1) ? _numPlayersPerTeam : 1

  const teams = []

  // create list of teams (list of objects)
  for (let i = 1; i <= numTeams; i++) {
    teams.push(
      {
        name: `Team ${i}`,
        members: []
      }
    )
  }

  return teams
}

function _randomizeTeams(players, teams) {
  for (let i = 0; i < numPlayersPerTeam; i++)
  {
    for (let j = 0; j < numTeams; j++) {
      if (players.leftoverList.length > 0) {
        _addPlayerToTeam(players.leftoverList, teams[j])
      } else {
        _addPlayerToTeam(players.activeSelectList, teams[j])
      }
    }
  }

  if (players.activeSelectList.length > 0) {
    players.leftoverList.push(...players.activeSelectList)
    players.activeSelectList = []
  }

  return teams
}

function _getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

function _addPlayerToTeam(playerList, team) {
  const index = _getRandomInt(playerList.length)
  const nextPlayer = playerList[index]

  playerList.splice(index, 1)
  team.members.push(nextPlayer)
}

function _setCookie(cname, cvalue, exdays) {
  const d = new Date()
  d.setTime(d.getTime() + (exdays*24*60*60*1000))
  let expires = "expires="+ d.toUTCString()
  document.cookie = `${cname}=${cvalue};${expires}`
}

function _getCookie(cname) {
  let name = `${cname}=`
  let decodedCookie = decodeURIComponent(document.cookie)
  let ca = decodedCookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return
}