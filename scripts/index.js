let numTeams = 2;
let numPlayersPerTeam = 2;

const teamSelection = {
  playerList: undefined,
  activeSelectList: [],
  leftoverList: []
}

function randomizeTeams () {
  const players = _getPlayers()
  const teams = _createteams()
  const randomizedTeams = _randomizeTeams(players, teams)

  console.log(teams)

  updatePage(players, randomizedTeams)
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

function _createTeamHTMLElement(team) {
  const teamDiv = document.createElement("div")
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
  numTeams = document.getElementById("numTeams").value
  numPlayersPerTeam = document.getElementById("numTeamPlayers").value

  const teams = []

  // create list of teams (list of objects)
  for (let i = 1; i <= numTeams; i++) {
    teams.push(
      {
        name: `team ${i}`,
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

function adjustTextArea(element) {
  element.style.height = ''
  element.style.height = `${element.scrollHeight + 5}px`
}

const playerList = document.getElementById("playerListText")
playerList.value = `jazzi_
Reeceboi
Taku
D_e_m_p_s_e_y
Fluff
Eri_Oniel
ChilledAnarchist
sarah ♡
DylPickle
suicidal__potato
Cyke0
shana
bronwin
latabo
snakely`

adjustTextArea(playerList)