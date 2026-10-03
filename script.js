const UNICODE_PIECES = {
    'w_p': '&#9817;', 'w_r': '&#9814;', 'w_n': '&#9816;', 'w_b': '&#9815;', 'w_q': '&#9813;', 'w_k': '&#9812;',
    'b_p': '&#9823;', 'b_r': '&#9820;', 'b_n': '&#9822;', 'b_b': '&#9821;', 'b_q': '&#9819;', 'b_k': '&#9818;'
};

const INITIAL_BOARD = [
    ['b_r', 'b_n', 'b_b', 'b_q', 'b_k', 'b_b', 'b_n', 'b_r'],
    ['b_p', 'b_p', 'b_p', 'b_p', 'b_p', 'b_p', 'b_p', 'b_p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['w_p', 'w_p', 'w_p', 'w_p', 'w_p', 'w_p', 'w_p', 'w_p'],
    ['w_r', 'w_n', 'w_b', 'w_q', 'w_k', 'w_b', 'w_n', 'w_r']
];

let board = JSON.parse(JSON.stringify(INITIAL_BOARD));
let turn = 'w';
let selectedSquare = null;
let validMoves = [];
let movedStatus = {
    '0_0': false, '0_7': false, '7_0': false, '7_7': false,
    '0_4': false, '7_4': false
};
let enPassantTarget = null;

$(document).ready(() => {
    renderBoard();
    $('#chessboard').on('click', '.square', handleSquareClick);
});

function renderBoard() {
    const $board =$('#chessboard').empty();
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const isLight = (r + c) % 2 === 0;
            const piece = board[r][c];
            const $sq =$('<div>')
                .addClass(`square ${isLight ? 'light' : 'dark'}`)
                .attr('data-row', r)
                .attr('data-col', c);

            if (piece) {
                $sq.html(UNICODE_PIECES[piece]);
            }

            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                $sq.addClass('selected');
            }

            if (validMoves.some(m => m.r === r && m.c === c)) {
                $sq.addClass('highlight');
                if (piece) $sq.addClass('has-piece');
            }

            $board.append($sq);
        }
    }
    $('#turn-banner').text(`${turn === 'w' ? "White's" : "Black's"} Turn`);
}

function handleSquareClick() {
    const r = parseInt($(this).attr('data-row'));
    const c = parseInt($(this).attr('data-col'));
    const piece = board[r][c];

    if (selectedSquare) {
        const isMoveValid = validMoves.some(m => m.r === r && m.c === c);
        if (isMoveValid) {
            executeMove(selectedSquare.r, selectedSquare.c, r, c);
            selectedSquare = null;
            validMoves = [];
            renderBoard();
            return;
        }
    }

    if (piece && piece.startsWith(turn)) {
        selectedSquare = { r, c };
        validMoves = getLegalMoves(r, c, board);
    } else {
        selectedSquare = null;
        validMoves = [];
    }

    renderBoard();
}

function executeMove(fromR, fromC, toR, toC) {
    const piece = board[fromR][fromC];
    const color = piece[0];

    if (piece.endsWith('_p') && enPassantTarget && toR === enPassantTarget.r && toC === enPassantTarget.c) {
        const captureRow = color === 'w' ? toR + 1 : toR - 1;
        board[captureRow][toC] = null;
    }

    if (piece.endsWith('_p') && Math.abs(toR - fromR) === 2) {
        enPassantTarget = { r: (fromR + toR) / 2, c: fromC };
    } else {
        enPassantTarget = null;
    }

    if (piece.endsWith('_k') && Math.abs(toC - fromC) === 2) {
        if (toC === 6) {
            board[fromR][5] = board[fromR][7];
            board[fromR][7] = null;
        } else if (toC === 2) {
            board[fromR][3] = board[fromR][0];
            board[fromR][0] = null;
        }
    }

    board[toR][toC] = piece;
    board[fromR][fromC] = null;
    movedStatus[`${fromR}_${fromC}`] = true;

    if (piece.endsWith('_p') && (toR === 0 || toR === 7)) {
        board[toR][toC] = `${color}_q`;
    }

    turn = turn === 'w' ? 'b' : 'w';

    if (isCheckmate(turn, board)) {
        setTimeout(() => alert(`Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins!`), 100);
    } else if (isStalemate(turn, board)) {
        setTimeout(() => alert('Stalemate! Game ended in a draw.'), 100);
    }
}

function getLegalMoves(r, c, b) {
    const rawMoves = getPseudoMoves(r, c, b);
    return rawMoves.filter(m => !wouldBeInCheck(r, c, m.r, m.c, b));
}

function getPseudoMoves(r, c, b) {
    const piece = b[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[2];
    const moves = [];

    const addIfValid = (nr, nc) => {
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = b[nr][nc];
            if (!target) {
                moves.push({ r: nr, c: nc });
                return true;
            } else if (target[0] !== color) {
                moves.push({ r: nr, c: nc });
                return false;
            }
        }
        return false;
    };

    if (type === 'p') {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;

        if (r + dir >= 0 && r + dir < 8 && !b[r + dir][c]) {
            moves.push({ r: r + dir, c });
            if (r === startRow && !b[r + 2 * dir][c]) {
                moves.push({ r: r + 2 * dir, c });
            }
        }
        [-1, 1].forEach(dc => {
            const nc = c + dc;
            const nr = r + dir;
            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                const target = b[nr][nc];
                if (target && target[0] !== color) {
                    moves.push({ r: nr, c: nc });
                }
                if (enPassantTarget && enPassantTarget.r === nr && enPassantTarget.c === nc) {
                    moves.push({ r: nr, c: nc });
                }
            }
        });
    }

    if (type === 'n') {
        const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
        offsets.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));
    }

    if (type === 'b' || type === 'q') {
        const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        dirs.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (addIfValid(nr, nc)) { nr += dr; nc += dc; }
        });
    }

    if (type === 'r' || type === 'q') {
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        dirs.forEach(([dr, dc]) => {
            let nr = r + dr, nc = c + dc;
            while (addIfValid(nr, nc)) { nr += dr; nc += dc; }
        });
    }

    if (type === 'k') {
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        dirs.forEach(([dr, dc]) => addIfValid(r + dr, c + dc));

        if (!movedStatus[`${r}_${c}`] && !isSquareAttacked(r, c, color, b)) {
            if (!b[r][5] && !b[r][6] && !movedStatus[`${r}_7`] && !isSquareAttacked(r, 5, color, b) && !isSquareAttacked(r, 6, color, b)) {
                moves.push({ r, c: 6 });
            }
            if (!b[r][1] && !b[r][2] && !b[r][3] && !movedStatus[`${r}_0`] && !isSquareAttacked(r, 2, color, b) && !isSquareAttacked(r, 3, color, b)) {
                moves.push({ r, c: 2 });
            }
        }
    }

    return moves;
}

function cloneBoard(b) {
    return b.map(row => [...row]);
}

function wouldBeInCheck(fromR, fromC, toR, toC, b) {
    const tempBoard = cloneBoard(b);
    const piece = tempBoard[fromR][fromC];
    const color = piece[0];

    tempBoard[toR][toC] = piece;
    tempBoard[fromR][fromC] = null;

    let kingR = -1, kingC = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (tempBoard[r][c] === `${color}_k`) {
                kingR = r;
                kingC = c;
                break;
            }
        }
    }
    return isSquareAttacked(kingR, kingC, color, tempBoard);
}

function isSquareAttacked(r, c, myColor, b) {
    const enemyColor = myColor === 'w' ? 'b' : 'w';
    for (let er = 0; er < 8; er++) {
        for (let ec = 0; ec < 8; ec++) {
            const p = b[er][ec];
            if (p && p[0] === enemyColor) {
                let moves = [];
                const type = p[2];
                if (type === 'p') {
                    const dir = enemyColor === 'w' ? -1 : 1;
                    if (er + dir === r && (ec - 1 === c || ec + 1 === c)) return true;
                } else if (type === 'k') {
                    if (Math.abs(er - r) <= 1 && Math.abs(ec - c) <= 1) return true;
                } else {
                    moves = getPseudoMoves(er, ec, b);
                    if (moves.some(m => m.r === r && m.c === c)) return true;
                }
            }
        }
    }
    return false;
}

function hasAnyLegalMoves(color, b) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c] && b[r][c][0] === color) {
                if (getLegalMoves(r, c, b).length > 0) return true;
            }
        }
    }
    return false;
}

function isCheckmate(color, b) {
    let kingR = -1, kingC = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c] === `${color}_k`) {
                kingR = r; kingC = c; break;
            }
        }
    }
    return isSquareAttacked(kingR, kingC, color, b) && !hasAnyLegalMoves(color, b);
}

function isStalemate(color, b) {
    let kingR = -1, kingC = -1;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (b[r][c] === `${color}_k`) {
                kingR = r; kingC = c; break;
            }
        }
    }
    return !isSquareAttacked(kingR, kingC, color, b) && !hasAnyLegalMoves(color, b);
}
