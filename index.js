console.log('Live reloading');

const startButton = document.getElementById('startButton');
const gameButtons = document.getElementsByClassName('square');
const level = document.getElementById('level');
const counter = document.getElementById('counter');
const resetButton = document.getElementById('resetButton');
const header = document.getElementById('header');
const gameBox = document.getElementsByClassName('gameBox-greed');
const normalButton = document.getElementById('menuNormalButton');
const hardButton = document.getElementById('menuHardButton');
const back = document.getElementById('backButton');
const difficultText = document.getElementById('difficulty');

class SimonSays {
    constructor(gameButtons, startButton, level, counter, resetButton, header, gameBox, normalButton, hardButton, back, difficultText) {
        this.display = {startButton, level, counter, resetButton, header, gameBox, normalButton, hardButton, back, difficultText}

        this.userStep = 0; // User secuence
        this.level = 0; // Actual game level
        this.totalLevels = 20; // Finishing game
        this.totalsteps = 0; // Total steps to follow

        this.sequence = []; // Game secuence
        this.speed = 1000; // 1 second

        this.blockedButtons = true; // This is when the game is showing the secuense to follow player can't press buttons
        this.buttons = Array.from(gameButtons); // Array for save the game buttons information
        this.errorSound = new Audio('./sounds/errorSound.mp3');
        this.buttonSounds = [
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
            new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
        ]
        //Add the sounds for the game buttons

        this.isHard = false;
    }

    // ================= Methods ====================================

    // Initialize the Simon program
    //Pure function
    init() {
        // With an onclick event execute the startGame method
        this.display.resetButton.disabled = true; // disable the start game button
        this.display.startButton.onclick = () => this.startGame();
        this.display.resetButton.onclick = () => this.resetGame();

        this.display.normalButton.onclick = () => this.normalGame();
        this.display.hardButton.onclick = () => this.hardGame();
        this.display.back.onclick = () => this.backMenu();
    }

    // This method hide the menu buttons and show the game interface
    normalGame(){

        this.display.normalButton.style.display = 'none';
        this.display.hardButton.style.display = 'none';

        this.display.gameBox[0].style.display = 'inline-grid';
        this.display.startButton.style.display = 'inline-grid';
        this.display.resetButton.style.display = 'inline-grid';
        this.display.back.style.display = 'inline-grid';

        this.display.difficultText.textContent = '';
    }

    // This method hide the menu buttons and show the game interface
    hardGame(){
        this.display.normalButton.style.display = 'none';
        this.display.hardButton.style.display = 'none';

        this.display.gameBox[0].style.display = 'inline-grid';
        this.display.startButton.style.display = 'inline-grid';
        this.display.resetButton.style.display = 'inline-grid';
        this.display.back.style.display = 'inline-grid';

        this.display.difficultText.textContent = '';

        this.isHard = true;
    }

    // This method hide the game interface buttons and show the game menu buttons, also sets the initial configuration
    backMenu(){
        this.display.normalButton.style.display = 'inline';
        this.display.hardButton.style.display = 'inline';

        this.display.gameBox[0].style.display = 'none';
        this.display.startButton.style.display = 'none';
        this.display.resetButton.style.display = 'none';
        this.display.back.style.display = 'none';

        this.userStep = 0; // User secuence
        this.level = 0; // Actual game level
        this.totalLevels = 20; // Finishing game
        this.totalsteps = 0;

        this.sequence = []; // Game secuence
        this.speed = 1000; // 1 second

        this.updateLevel(0);  // Reset the levels
        this.blockedButtons = true; // This is when the game is showing the secuense to follow player can't press buttons

        this.display.level.textContent = '';
        this.display.counter.textContent = '';
        this.display.difficultText.textContent = 'Choose difficulty:';

        this.display.startButton.disabled = false; // disable the start game button
    }

    // Starts the game loop
    //Pure function
    startGame() {
        this.display.header.textContent = 'Simon Says Game';

        this.display.startButton.disabled = true; // disable the start game button
        this.userStep = 0; // Reset the user secuences to press

        this.updateLevel(0);  // Reset the levels
        this.updatecounter(this.level);
        this.sequence = this.createSequence(); // Creates the random secuence of the inputs
        this.showSequence(); // Shows the secuense to repat (1 button at start)

        this.buttons.forEach((element, i) => {  // To each button
            element.onclick = () => this.clickButton(i); // Gets the button value with a click
        });
        
        this.display.resetButton.disabled = false; // disable the start game button
        //this.display.gameBox[0].style.display = 'inline-grid';
    }

    // Updates the level and the buttons
    //Pure function
    updateLevel(n) {
        this.level = n;
        this.display.level.textContent = `level: ${this.level + 1}`; // Change the content for the amount of level player have beat (starts at 0)
    }
    //Pure function
    updatecounter(n)   {
        this.totalsteps = n + 1;
        this.display.counter.textContent = `Following steps: ${this.totalsteps}`;
    }

    // This methot sets the randoms input secuence
    //Impure function
    createSequence() {
        return Array.from({ length: this.totalLevels }, () => this.getRandomColor()); // Create an array with length of the total level of the game and returns each of the random colors 
    }

    // Gets the random color for the secuence to follow
    //Impure function
    getRandomColor() {
        return Math.floor(Math.random() * 4); // Returns a number between 0 and 3 randomly
        // Math.random() returns a random number between 0 and 1
        // It multiplays to 4 the random values to get numbers before 4 (0 to 3)
        // The Math.floor() method rounds a number down to the nearest integer, without this the numbers would be floats
    }
    //Impure function
    showSequence() {
        this.blockedButtons = true;  // blocks the buttons to player
        let sequenceNumber = 0; // Starts the secuense

        let t = setInterval(() => { // Interavl timer
            const button = this.buttons[this.sequence[sequenceNumber]];
            this.buttonSounds[this.sequence[sequenceNumber]].play(); //Call the button sounds to play in the sequence
            this.toggleButtonStyle(button);
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);
            sequenceNumber++;

            if (sequenceNumber > this.level) { // Unlocks the buttons when the game finishes show the sequence
                this.blockedButtons = false;
                clearInterval(t); // Stops the inverval timer
            }
        }, this.speed);
    }
    //Pure function
    toggleButtonStyle(button) {
        button.classList.toggle('active'); // Adds the class to the buttons and simulates that the button is pressed

    }
    //Impure function
    gameLost() { //Function used to notify a mistake to the player
        this.errorSound.play(); //Play an error sound
        this.userStep = 0; // Reset the user secuences to press
        
        if (this.isHard === true) { // If player chooses the hard difficulty
            this.startGame(); // When player made a mistake restarts the game
        }

        else{
            this.showSequence(); //Call the current sequence again
        }
    }
    
    clickButton(value) {
        !this.blockedButtons && this.validateChosenColor(value); // if buttons arent blocked so validates the color secuence
    }
    //Impure function
    validateChosenColor(value) {
        if (this.sequence[this.userStep] === value) { //if the user stept secuense matches with the game secuense button is true
            this.totalsteps = this.totalsteps-1;
            this.display.counter.textContent = `Following steps: ${this.totalsteps}`;
            this.buttonSounds[value].play(); // Plays the sound to confirm that the button secuense is correct
            if (this.level === this.userStep) { // This is when the secuense is not over but he is still playing
                this.updateLevel(this.level + 1); // sums the level counter
                this.updatecounter(this.level); // Update the max step to follow
                this.GameOver(); // Validates if the match is over
            }

            else {
                this.userStep++;
            }
        }
        else {  
            this.gameLost(); //Call a function for when the player presses a wrong button
            this.updatecounter(this.level); // Reset the steps counter
        }
    }
    //Pure function
    GameOver() {
        if (this.level === this.totalLevels) { // If player completes the game
            this.display.startButton.textContent = 'Play again'; // Changes the Play button text
            this.display.header.textContent = 'You Won!'; // Shows the mensaje which indicates that players won

            this.display.startButton.disabled = false; 
            this.blockedButtons = true;
        }
        
        else{
            this.userStep = 0; // Reset the player step secuence
            this.showSequence(); // Show new secuence
        }

    }
    //Impure function
    resetGame(){
        this.userStep = 0; // Reset the user secuences to press

        this.updateLevel(0);  // Reset the levels
        this.updatecounter(this.level);
        this.sequence = this.createSequence(); // Creates the random secuence of the inputs
        this.showSequence(); // Shows the secuense to repat (1 button at start)

        this.buttons.forEach((element, i) => {  // To each button
            element.onclick = () => this.clickButton(i); // Gets the button value with a click
        });
    }

}

const simon = new SimonSays(gameButtons, startButton, level, counter, resetButton, header, gameBox, normalButton, hardButton, back, difficultText);
simon.init();