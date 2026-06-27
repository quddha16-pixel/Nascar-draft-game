const drivers = [
  { name: 'Chase Rockett', number: 9, team: 'Apex Motorsports', cost: 28, speed: 94, future: 88, consistency: 91 },
  { name: 'Maddox Lane', number: 24, team: 'Heritage Racing', cost: 25, speed: 89, future: 94, consistency: 84 },
  { name: 'Tyson Vale', number: 45, team: 'Thunder Row', cost: 22, speed: 86, future: 91, consistency: 83 },
  { name: 'Cole Maverick', number: 3, team: 'Iron Horse Garage', cost: 19, speed: 82, future: 87, consistency: 86 },
  { name: 'Jett Parsons', number: 12, team: 'Velocity Club', cost: 18, speed: 84, future: 79, consistency: 89 },
  { name: 'Nico Steele', number: 6, team: 'Blue Ridge Racing', cost: 16, speed: 79, future: 85, consistency: 82 },
  { name: 'Rowan Sparks', number: 88, team: 'Summit Drafting Co.', cost: 15, speed: 77, future: 90, consistency: 74 },
  { name: 'Beck Ford', number: 17, team: 'Pit Wall Performance', cost: 13, speed: 75, future: 82, consistency: 80 },
  { name: 'Dale Archer', number: 41, team: 'Redline Reserve', cost: 11, speed: 72, future: 78, consistency: 79 },
  { name: 'Riley Knox', number: 2, team: 'Blacktop Alliance', cost: 9, speed: 69, future: 76, consistency: 75 },
  { name: 'Sawyer Quinn', number: 51, team: 'Rookie Factory', cost: 7, speed: 64, future: 88, consistency: 62 },
  { name: 'Cam Bishop', number: 78, team: 'Underdog Motors', cost: 5, speed: 61, future: 73, consistency: 68 }
];

const MAX_ROSTER = 5;
const STARTING_BUDGET = 100;
const state = { roster: [], budget: STARTING_BUDGET, sortBy: 'value' };

const board = document.querySelector('#driver-board');
const roster = document.querySelector('#roster');
const score = document.querySelector('#score');
const round = document.querySelector('#round');
const budget = document.querySelector('#budget');
const rosterCount = document.querySelector('#roster-count');
const message = document.querySelector('#message');

document.querySelector('#sort-value').addEventListener('click', () => setSort('value'));
document.querySelector('#sort-cost').addEventListener('click', () => setSort('cost'));
document.querySelector('#reset').addEventListener('click', resetDraft);

function dynastyValue(driver) {
  return Math.round(driver.speed * 0.4 + driver.future * 0.35 + driver.consistency * 0.25);
}

function sortedDrivers() {
  return [...drivers].sort((a, b) => {
    if (state.sortBy === 'cost') return b.cost - a.cost;
    return dynastyValue(b) - dynastyValue(a);
  });
}

function draftDriver(driverName) {
  const driver = drivers.find((candidate) => candidate.name === driverName);
  if (!driver || state.roster.includes(driverName)) return;

  if (state.roster.length >= MAX_ROSTER) {
    message.textContent = 'Your garage is full. Start a new draft to try a different build.';
    return;
  }

  if (driver.cost > state.budget) {
    message.textContent = `${driver.name} costs $${driver.cost}M, which breaks your remaining cap.`;
    return;
  }

  state.roster.push(driver.name);
  state.budget -= driver.cost;
  message.textContent = `${driver.name} joins your dynasty garage. Nice pick!`;
  render();
}

function setSort(sortBy) {
  state.sortBy = sortBy;
  message.textContent = sortBy === 'cost' ? 'Draft board sorted by highest salary.' : 'Draft board sorted by best dynasty value.';
  renderBoard();
}

function resetDraft() {
  state.roster = [];
  state.budget = STARTING_BUDGET;
  state.sortBy = 'value';
  message.textContent = 'New draft started. Pick five drivers while staying under the cap.';
  render();
}

function calculateScore() {
  return state.roster.reduce((total, driverName) => {
    const driver = drivers.find((candidate) => candidate.name === driverName);
    return total + dynastyValue(driver);
  }, 0);
}

function renderBoard() {
  board.innerHTML = '';
  sortedDrivers().forEach((driver) => {
    const isDrafted = state.roster.includes(driver.name);
    const card = document.createElement('article');
    card.className = `driver-card${isDrafted ? ' drafted' : ''}`;
    card.tabIndex = isDrafted ? -1 : 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Draft ${driver.name}`);
    card.innerHTML = `
      <span class="driver-number">#${driver.number}</span>
      <h3>${driver.name}</h3>
      <p>${driver.team}</p>
      <div class="driver-meta">
        <span>Cost: <strong>$${driver.cost}M</strong></span>
        <span class="value">Value: ${dynastyValue(driver)}</span>
        <span>Speed: ${driver.speed}</span>
        <span>Future: ${driver.future}</span>
      </div>
    `;

    card.addEventListener('click', () => draftDriver(driver.name));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        draftDriver(driver.name);
      }
    });
    board.appendChild(card);
  });
}

function renderRoster() {
  roster.innerHTML = '';
  roster.classList.toggle('empty', state.roster.length === 0);

  if (state.roster.length === 0) {
    roster.innerHTML = '<li>No drivers drafted yet.</li>';
    return;
  }

  state.roster.forEach((driverName) => {
    const driver = drivers.find((candidate) => candidate.name === driverName);
    const item = document.createElement('li');
    item.innerHTML = `<span>#${driver.number} ${driver.name}</span><strong>${dynastyValue(driver)} pts</strong>`;
    roster.appendChild(item);
  });
}

function renderStats() {
  const currentRound = Math.min(state.roster.length + 1, MAX_ROSTER);
  score.textContent = calculateScore();
  round.textContent = `${currentRound} / ${MAX_ROSTER}`;
  budget.textContent = `$${state.budget}M`;
  rosterCount.textContent = `${state.roster.length} / ${MAX_ROSTER}`;

  if (state.roster.length === MAX_ROSTER) {
    message.textContent = `Draft complete! Final dynasty score: ${calculateScore()}.`;
  }
}

function render() {
  renderStats();
  renderRoster();
  renderBoard();
}

render();
