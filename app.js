class Player {
  constructor(id, name, rank, hasPlayed = false) {
    this.id = id;
    this.name = name;
    this.rank = rank;
    this.hasPlayed = hasPlayed;
  }
}

const numPlayersInput = document.getElementById('numPlayers');
const playerInputs = document.getElementById('playerInputs');

numPlayersInput.addEventListener('change', () => {
  const numPlayers = parseInt(numPlayersInput.value);
  playerInputs.innerHTML = '';

  for (let i = 0; i < numPlayers; i++) {
    const playerInfoDiv = document.createElement('div');
    playerInfoDiv.className = 'player-info';

    const nameLabel = document.createElement('label');
    nameLabel.textContent = `Nome do jogador ${i + 1}:`;
    playerInfoDiv.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'player-name';
    playerInfoDiv.appendChild(nameInput);

    const rankLabel = document.createElement('label');
    rankLabel.textContent = 'Rank:';
    playerInfoDiv.appendChild(rankLabel);

    const rankInput = document.createElement('input');
    rankInput.type = 'range';
    rankInput.min = '1';
    rankInput.max = '5';
    rankInput.value = '3';
    rankInput.className = 'player-rank';
    playerInfoDiv.appendChild(rankInput);

    playerInputs.appendChild(playerInfoDiv);
  }
});

function randomName() {
  const names = ['Lucas', 'Maria', 'Pedro', 'Fernanda', 'Ricardo', 'Carla', 'José', 'Ana', 'Marcelo', 'Juliana'];
  return names[Math.floor(Math.random() * names.length)];
}

function randomRank() {
  return Math.floor(Math.random() * 5) + 1;
}

function generateTest() {
  const nameInputs = document.getElementsByClassName('player-name');
  const rankInputs = document.getElementsByClassName('player-rank');

  for (let i = 0; i < nameInputs.length; i++) {
    nameInputs[i].value = randomName();
    rankInputs[i].value = randomRank();
  }
}

function sortPlayersByRank(players) {
  return players.sort((a, b) => b.rank - a.rank);
}

function balanceTeams(players) {
  const sortedPlayers = sortPlayersByRank(players);
  const teamA = [];
  const teamB = [];
  const numPlayersPerTeam = 5;

  const rankCount = {
    teamA: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    teamB: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  while (sortedPlayers.length > 0 && (teamA.length < numPlayersPerTeam || teamB.length < numPlayersPerTeam)) {
    const player = sortedPlayers.shift();

    if (teamA.length < numPlayersPerTeam && isValidTeamAddition(player.rank, rankCount.teamA)) {
      teamA.push(player);
      rankCount.teamA[player.rank]++;
    } else if (teamB.length < numPlayersPerTeam && isValidTeamAddition(player.rank, rankCount.teamB)) {
      teamB.push(player);
      rankCount.teamB[player.rank]++;
    } else {
      sortedPlayers.push(player);
    }
  }

  const remaining = sortedPlayers;
  return [teamA, teamB, remaining];
}

function isValidTeamAddition(rank, rankCount) {
  if (rank === 5 && rankCount[5] < 1) {
    return true;
  } else if (rank === 4) {
    if (rankCount[5] === 0 && rankCount[4] < 2) {
      return true;
    } else if (rankCount[5] === 1 && rankCount[4] < 1) {
      return true;
    }
  } else if (rank === 3) {
    if (rankCount[5] === 0 && rankCount[4] === 0 && rankCount[3] < 2) {
      return true;
    }
  } else if (rank === 1 || rank === 2) {
    return true;
  }
  return false;
}

let remainingPlayers = [];

function generateTeams() {
  const playerNames = Array.from(document.getElementsByClassName('player-name')).map(input => input.value);
  const playerRanks = Array.from(document.getElementsByClassName('player-rank')).map(input => parseInt(input.value));
  const players = playerNames.map((name, index) => new Player(index + 1, name, playerRanks[index]));

  const [teamA, teamB, newRemainingPlayers] = balanceTeams(players);
  remainingPlayers = newRemainingPlayers;

  displayTeams(teamA, teamB);
}

function displayTeams(teamA, teamB) {
  const teamAElement = document.getElementById('teamA');
  const teamBElement = document.getElementById('teamB');

  teamAElement.innerHTML = '';
  teamBElement.innerHTML = '';

  teamA.forEach(player => {
    const listItem = document.createElement('li');
    listItem.textContent = `${player.name} (Rank: ${player.rank})`;
    teamAElement.appendChild(listItem);
  });

  teamB.forEach(player => {
    const listItem = document.createElement('li');
    listItem.textContent = `${player.name} (Rank: ${player.rank})`;
    teamBElement.appendChild(listItem);
  });

  const nextMatchElement = document.getElementById('nextMatch');
  nextMatchElement.innerHTML = '';

  if (remainingPlayers) { // Adicionado aqui
    for (let i = 0; i < remainingPlayers.length; i++) {
      const listItem = document.createElement('li');
      listItem.textContent = `${remainingPlayers[i].name} (Rank: ${remainingPlayers[i].rank})`;
      nextMatchElement.appendChild(listItem);
    }
  }

  const emptySpots = Math.max(10 - (remainingPlayers ? remainingPlayers.length : 0), 0); // Adicionado aqui
  for (let i = 0; i < emptySpots; i++) {
    const listItem = document.createElement('li');
    listItem.textContent = 'Aguardando resultado da partida atual';
    listItem.className = 'waiting';
    nextMatchElement.appendChild(listItem);
  }
}