import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

type PieceType = '♜' | '♞' | '♝' | '♛' | '♚' | '♟' | '♙' | '♔' | '♕' | '♖' | '♗' | '♘' | ' ';
type BoardType = PieceType[][];
type PlayerType = 'white' | 'black';
type SelectedPieceType = { row: number; col: number } | null;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SQUARE_SIZE = SCREEN_WIDTH / 8;

const initialBoard:BoardType = [
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
];

const ChessGame = () => {
  const [board, setBoard] = useState<BoardType>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<SelectedPieceType>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>('white');
  
  const isWhitePiece = (piece:PieceType):boolean => {
    return '♔♕♖♗♘♙'.includes(piece);
  };

  const isBlackPiece = (piece:PieceType):boolean => {
    return '♚♛♜♝♞♟'.includes(piece);
  };

  const isValidMove = (fromRow:number, fromCol:number, toRow:number, toCol:number):boolean => {
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    // Basic validation: can't capture own pieces
    if (isWhitePiece(piece) && isWhitePiece(targetPiece)) return false;
    if (isBlackPiece(piece) && isBlackPiece(targetPiece)) return false;

    switch (piece) {
      case '♙': // White pawn
        if (fromCol === toCol && targetPiece === ' ' && fromRow - toRow === 1) return true;
        if (Math.abs(fromCol - toCol) === 1 && targetPiece === '♟' && fromRow - toRow === 1) return true;
        if (fromRow === 6 && fromCol === toCol && targetPiece === ' ' && fromRow - toRow === 2) return true; // Pawn two squares
        break;
      case '♟': // Black pawn
        if (fromCol === toCol && targetPiece === ' ' && toRow - fromRow === 1) return true;
        if (Math.abs(fromCol - toCol) === 1 && targetPiece === '♙' && toRow - fromRow === 1) return true;
        if (fromRow === 1 && fromCol === toCol && targetPiece === ' ' && toRow - fromRow === 2) return true;
        break;
      case '♞': // Knight
        if (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) return true;
        if (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2) return true;
        break;
      case '♖': // Rook
        if (fromRow === toRow) {
          let step = fromCol < toCol ? 1 : -1;
          for (let c = fromCol + step; c !== toCol; c += step) {
            if (board[fromRow][c] !== ' ') return false;
          }
          return true;
        }
        if (fromCol === toCol) {
          let step = fromRow < toRow ? 1 : -1;
          for (let r = fromRow + step; r !== toRow; r += step) {
            if (board[r][fromCol] !== ' ') return false;
          }
          return true;
        }
        break;
      case '♗': // Bishop
        if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
          let rowStep = fromRow < toRow ? 1 : -1;
          let colStep = fromCol < toCol ? 1 : -1;
          let r = fromRow + rowStep;
          let c = fromCol + colStep;
          while (r !== toRow && c !== toCol) {
            if (board[r][c] !== ' ') return false;
            r += rowStep;
            c += colStep;
          }
          return true;
        }
        break;
      case '♕': // Queen
        if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) return true;
        if (fromRow === toRow || fromCol === toCol) return true;
        break;
      case '♔': // King
        if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) return true;
        break;
      default:
        return false;
    }
    return false;
  };

  const handlePieceClick = (row:number, col:number) => {
    const piece = board[row][col];
    
    if (!selectedPiece && 
        ((currentPlayer === 'white' && isWhitePiece(piece)) ||
         (currentPlayer === 'black' && isBlackPiece(piece)))) {
      setSelectedPiece({ row, col });
    } 
    else if (selectedPiece) {
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = board[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = ' ';
        
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      }
      setSelectedPiece(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.playerText}>
        Current Player: {currentPlayer}
      </Text>
      <View style={styles.board}>
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((piece, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.square,
                  (rowIndex + colIndex) % 2 === 0 ? styles.whiteSquare : styles.blackSquare,
                  selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex && styles.selectedSquare
                ]}
                onPress={() => handlePieceClick(rowIndex, colIndex)}
              >
                <Text style={[styles.piece, isWhitePiece(piece) ? styles.whitePiece : styles.blackPiece]}>
                  {piece}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  playerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  board: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteSquare: {
    backgroundColor: '#fff',
  },
  blackSquare: {
    backgroundColor: '#769656',
  },
  selectedSquare: {
    backgroundColor: '#baca44',
  },
  piece: {
    fontSize: SQUARE_SIZE * 0.7,
  },
  whitePiece: {
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  blackPiece: {
    color: '#000',
  },
});

export default ChessGame;
