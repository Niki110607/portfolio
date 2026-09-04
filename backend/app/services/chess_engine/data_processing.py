import chess
import numpy as np
import torch


def board_to_array(board, color):
    """
    Transforms a chess.Board() to a array of bitboards.
    """
    color = binary_to_array(int(color))
    us_mask = board.occupied_co[chess.WHITE]
    them_mask = board.occupied_co[chess.BLACK]

    bitboards = np.array([
        us_mask & board.pawns,
        us_mask & board.knights,
        us_mask & board.bishops,
        us_mask & board.rooks,
        us_mask & board.queens,
        us_mask & board.kings,
        them_mask & board.pawns,
        them_mask & board.knights,
        them_mask & board.bishops,
        them_mask & board.rooks,
        them_mask & board.queens,
        them_mask & board.kings,
        ~board.occupied & 0xffffffffffffffff
    ], dtype=np.uint64)

    board_array = bitboards_to_array(bitboards)

    bcK = binary_to_array(int(board.has_kingside_castling_rights(chess.BLACK)))
    bcQ = binary_to_array(int(board.has_queenside_castling_rights(chess.BLACK)))
    wcK = binary_to_array(int(board.has_kingside_castling_rights(chess.WHITE)))
    wcQ = binary_to_array(int(board.has_queenside_castling_rights(chess.WHITE)))

    ep = ep_to_array(board.ep_square)

    final_tensor = np.concatenate((board_array, bcK, bcQ, wcK, wcQ, color, ep), axis=0)

    return final_tensor


def bitboards_to_array(bb):
    """
    Transforms a bitboard into a numpy array
    """
    bb = np.asarray(bb, dtype=np.uint64)[:, np.newaxis]
    s = 8 * np.arange(7, -1, -1, dtype=np.uint64)
    b = (bb >> s).astype(np.uint8)
    b = np.unpackbits(b, bitorder="little")

    return b.reshape(-1, 8, 8)


def binary_to_array(b):
    """
    Transforms a single number into a numpy array of shape 1x8x8 of this number
    """
    if b == 0:
        return np.zeros((1, 8, 8))

    return np.ones((1, 8, 8))


def ep_to_array(ep):
    """
    Returns an array of zeros with a one on the position a pawn can capture with en passent.
    """
    ep_square = np.zeros((1, 8, 8))
    if ep != None:
        ep_square[0, 7 - ep//8, ep % 8] = 1

    return ep_square


def transform_board(board):
    """
    Mirrors the board if it is blacks turn
    """
    if board.turn == chess.BLACK:
        board = board.mirror()

    return board


def get_all_moves():
    """
    Returns a list of all moves in a game of chess in uci notation and a dictionary that maps the moves to indices.
    """
    all_moves = set()

    for start_sq in range(64):
        for end_sq in range(64):
            move = chess.Move(start_sq, end_sq)
            all_moves.add(move.uci())

    all_unique_moves = sorted(all_moves)
    move_to_idx = {move: i for i, move in enumerate(all_unique_moves)}

    return all_unique_moves, move_to_idx


def create_moves_mask(board, move_to_idx):
    """
    Creates a move mask for a legal moves.
    """
    mask = torch.full((64*64,), -1e9, dtype=torch.float32)

    for move in board.legal_moves:
        uci = move.uci()[:4]

        if uci in move_to_idx:
            idx = move_to_idx[uci]
            mask[idx] = 0.0

    return mask


def process_test_data(orig_board, move_to_idx):
    """
    Transforms a chess.Board() to a bitboard and creates a legal move mask for inference.
    """
    color = orig_board.turn
    board = transform_board(orig_board)

    input = torch.from_numpy(board_to_array(board, color))
    input = input.view(19, -1)
    input = torch.transpose(input, 0, 1)

    legal_mask = create_moves_mask(board, move_to_idx)

    return input, legal_mask