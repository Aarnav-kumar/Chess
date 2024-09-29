var board, game = new Chess();

// Function to make the bot move
function makeBestMove() {
    var possibleMoves = game.moves();

    // Exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;

    // Random move (for simplicity, a stronger bot would use a better algorithm)
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);

    board.position(game.fen());
    updateStatus();
}

// Function to update the game status
function updateStatus() {
    var status = '';
    var moveColor = 'White';

    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // Checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
    // Draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position';
    }
    // Game still on
    else {
        status = moveColor + ' to move';

        // Check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    $('#status').html(status);
    $('#fen').html('FEN: ' + game.fen());
    $('#pgn').html('PGN: ' + game.pgn());
}

// Event for user moves
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Automatically promote to a queen
    });

    if (move === null) return 'snapback';

    updateStatus();
    window.setTimeout(makeBestMove, 250);
};

// Update the board position after the piece snap
var onSnapEnd = function () {
    board.position(game.fen());
};

// Initialize the board
var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = Chessboard('board', config);

// Button Events
$('#startBtn').on('click', function () {
    game.reset();
    board.start();
    updateStatus();
});

$('#resetBtn').on('click', function () {
    game.reset();
    board.position('start');
    updateStatus();
});

// Initial status
updateStatus();