var url = 'https://pokeapi.co/api/v2/pokemon/'
var pokeImg = document.querySelector('#pokeImg')
var spinner = document.querySelector('#spinner')
var options = document.querySelectorAll('.option')
var streakEl = document.querySelector('#streak')
var highscoreEl = document.querySelector('#highscore')

var correctSFX = new Audio('./assets/audios/correct.ogg')
var wrongSFX = new Audio('./assets/audios/wrong.ogg')

var pokemons = []
var answer = {}
var streak = 0
var highscore = 0

async function fetchPokemonById(id) {
	var response = await fetch(url + id)
	return await response.json()
}

async function loadPokemons() {
	setImageState(false)

	for (var i = 0; i < 4; i++) {
		var randomIndex = Math.floor(Math.random() * 151)
		var pokemon = await fetchPokemonById(randomIndex)
		pokemons.push(pokemon)
	}

	answer = pokemons[0]
	pokemons = shuffle(pokemons)

	updateQuiz()
}

function updateQuiz() {
	pokeImg.classList.add('silhouette')
	pokeImg.src = answer.sprites.other['official-artwork'].front_default

	options.forEach((option, index) => {
		option.innerHTML = pokemons[index].name
	})

	setImageState(true)
}

function guessPokemon(choice) {
	setOptionsState(false)
	pokeImg.classList.remove('silhouette')

	if (choice.innerHTML.toLowerCase() == answer.name) {
		correctAnswer(choice)
	} else {
		wrongAnswer(choice)
	}

	setTimeout(newRound, 1000)
}

function newRound() {
	setOptionsState(true)
	pokemons = []
	answer = {}

	options.forEach(option => {
		option.classList.remove('btn-danger', 'btn-success')
		option.classList.add('btn-primary')
	})

	loadPokemons()
}

function correctAnswer(choice) {
	correctSFX.play()
	streak++

	if (highscore < streak) highscore++

	updateScore()

	choice.classList.replace('btn-primary', 'btn-success')
}

function wrongAnswer(choice) {
	wrongSFX.play()
	streak = 0
	updateScore()
	choice.classList.replace('btn-primary', 'btn-danger')
}

function updateScore() {
	streakEl.innerHTML = streak.toString().padStart(2, '0')
	highscoreEl.innerHTML = highscore.toString().padStart(2, '0')
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

function setImageState(state) {
	pokeImg.classList.toggle('visually-hidden', !state)
	spinner.classList.toggle('visually-hidden', state)
}

function setOptionsState(state) {
	options.forEach(option => {
		option.disabled = !state
	})
}

window.addEventListener('DOMContentLoaded', loadPokemons)
options.forEach(option => {
	option.addEventListener('click', event => guessPokemon(event.target))
})
