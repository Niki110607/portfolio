import torch
from model.dqn_agent import NeuralNetwork

def load_model():
    model = NeuralNetwork()
    model.load_state_dict(torch.load("model/blackjack_model_weights.pth"))
    return model

def cards_to_state(h_card, p_cards):
    card_values = {"2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11}
    is_soft = False
    double_poss = False
    split_poss = False
    ace_count = 0
    deductions = 0
    player_hand_value = 0


    if len(p_cards) == 2:
        double_poss = True
        if p_cards[0] == p_cards[1]:
            split_poss = True

    for card in p_cards:
        card = str(card)
        player_hand_value += card_values[card]
        if card == "A":
            ace_count += 1

    for ace in range(ace_count):
        if player_hand_value > 21:
            player_hand_value -= 10
            deductions += 1

    if ace_count > deductions:
        is_soft = True

    state = (float(player_hand_value), float(card_values[h_card]), float(is_soft))

    return state, double_poss, split_poss


def best_move(h_card, p_cards):
    actions_dic = {0: "stand", 1: "hit", 2: "double", 3: "split"}
    model = load_model()

    state, double_poss, split_poss = cards_to_state(h_card, p_cards)
    if state[0] > 21:
        return "o21"

    state = torch.tensor(state).float().unsqueeze(0)

    q_values = model(state).squeeze()

    if not double_poss:
        q_values[-2] = -99

    if not split_poss:
        q_values[-1] = -99
    action = torch.argmax(q_values).item()

    return actions_dic[action]