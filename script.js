// Room Database
const roomsData = 
{
    'CR101': 
    {
        name: 'Classroom 101',
        id: 'CR101',
        floor: 'Ground Floor',
        navigation: 'Enter main entrance → Turn left → Straight 20m → Room on right',
        description: 'Main lecture hall with projector and 60 seats.',
        map: ''
    },
    'CR205': 
    {
        name: 'Classroom 205',
        id: 'CR205',
        floor: '1nd Floor',
        navigation: 'Back wing → Stairs/Elevator to 1nd floor → Turn right → Room 205',
        description: 'Computer lab with 30 workstations.',
        map: ''
    },
    'LIB': 
    {
        name: 'Main Library',
        id: 'LIB',
        floor: 'Ground Floor',
        navigation: 'Main entrance → Straight through lobby → Library entrance on left',
        description: 'Central library with 500+ seats and study areas.',
        map: ''
    },
    'Exam Office': 
    {
        name: 'Exam office',
        id: 'exam',
        floor: 'Basement',
        navigation: 'Gate no.1->Side Entrance->Stairs to Basement->stright from Fee cell',
        description: 'For the exam related quarry.',
        map: ''
    },
    'LAB 1': 
    {
        name: 'Computer Lab 1',
        id: 'LAB 1',
        floor: 'Ground Floor',
        navigation: 'Backwing entrance → Right at corridor → Lab 1',
        description: 'Computer Lab 1.',
        map: ''
    }
};

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const homeBtn = document.getElementById('homeBtn');
const resultsSection = document.getElementById('resultsSection');
const welcomeSection = document.getElementById('welcomeSection');
const notFoundAlert = document.getElementById('notFoundAlert');
const roomsGrid = document.getElementById('roomsGrid');
const quickAccessButtons = document.getElementById('quickAccessButtons');

// Initialize app
document.addEventListener('DOMContentLoaded', function() 
{
    initTheme();
    createRoomsGrid();
    createQuickAccess();
    setupEventListeners();
});

function initTheme() 
{
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme + '-theme';
    updateThemeIcons(savedTheme);
}

function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    // THEME TOGGLE 
    themeToggle.addEventListener('click', toggleTheme);

    // Quick access
    quickAccessButtons.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-secondary')) {
            const roomId = e.target.dataset.room;
            showRoom(roomId);
        }
    });

    // Home button
    homeBtn.addEventListener('click', showHome);
}

function handleSearch() {
    const query = searchInput.value.trim().toUpperCase();
    
    if (!query) 
    {
        alert('Please enter a room number');
        return;
    }

    const room = Object.values(roomsData).find(r => 
        r.id.toUpperCase() === query || r.name.toUpperCase().includes(query)
    );

    if (room) {
        showRoom(room.id);
    } else {
        showNotFound();
    }
}

function resolveRoom(key) 
{
    
    if (roomsData[key]) return roomsData[key];

    // Find by official room id or name
    const normalized = String(key || '').trim().toUpperCase();
    return Object.values(roomsData).find(r => 
        r.id.toUpperCase() === normalized || 
        r.name.toUpperCase() === normalized || 
        r.name.toUpperCase().includes(normalized)
    );
}

function showRoom(roomIdOrName) {
    const room = resolveRoom(roomIdOrName);
    if (!room) {
        showNotFound();
        return;
    }

    document.getElementById('roomName').textContent = room.name;
    document.getElementById('roomId').textContent = room.id;
    document.getElementById('roomNavigation').textContent = room.navigation;
    
    const descSection = document.getElementById('roomDescriptionSection');
    const descElement = document.getElementById('roomDescription');
    if (room.description) {
        descElement.textContent = room.description;
        descSection.style.display = 'block';
    } else {
        descSection.style.display = 'none';
    }
    
    document.getElementById('floorMapTitle').textContent = `${room.floor} Map`;
    document.getElementById('floorMapImage').src = room.map;
    
    hideAllSections();
    resultsSection.style.display = 'block';
    searchInput.value = room.id;
    
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showNotFound() {
    hideAllSections();
    notFoundAlert.style.display = 'flex';
    setTimeout(() => {
        notFoundAlert.style.display = 'none';
        welcomeSection.style.display = 'block';
    }, 3000);
}

function showHome() {
    hideAllSections();
    welcomeSection.style.display = 'block';
    searchInput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideAllSections() {
    resultsSection.style.display = 'none';
    welcomeSection.style.display = 'none';
    notFoundAlert.style.display = 'none';
}

function createRoomsGrid() {
    roomsGrid.innerHTML = '';
    Object.values(roomsData).forEach(room => {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        roomCard.innerHTML = `
            <svg class="icon room-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                <line x1="9" y1="6" x2="15" y2="6"></line>
                <line x1="9" y1="10" x2="15" y2="10"></line>
            </svg>
            <h4>${room.name}</h4>
            <p>${room.floor}</p>
        `;
        roomCard.addEventListener('click', () => showRoom(room.id));
        roomsGrid.appendChild(roomCard);
    });
}

function createQuickAccess() 
{
    quickAccessButtons.innerHTML = '';
    const quickRooms = ['CR101', 'CR205','Exam Office', 'LAB 1', 'LIB'];
    quickRooms.forEach(roomKey => {
        const room = resolveRoom(roomKey);
        if (!room) return;

        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.dataset.room = roomKey;
        btn.textContent = room.name;
        quickAccessButtons.appendChild(btn);
    });
}

//THEME FUNCTIONS
function toggleTheme() {
    console.log('Theme toggle clicked!'); // DEBUG
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.className = 'light-theme';
        localStorage.setItem('theme', 'light');
        updateThemeIcons('light');
        console.log('Switched to LIGHT theme');
    } else {
        body.className = 'dark-theme';
        localStorage.setItem('theme', 'dark');
        updateThemeIcons('dark');
        console.log('Switched to DARK theme');
    }
}

function updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (!sunIcon || !moonIcon) {
        console.error('Icons not found!');
        return;
    }
    
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}