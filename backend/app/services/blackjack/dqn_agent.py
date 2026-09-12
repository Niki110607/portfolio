import torch.nn as nn
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(3, 64),
            nn.ReLU(),
            nn.Linear(64, 64),
            nn.ReLU(),
            nn.Linear(64, 4)
        )

    def forward(self, x):
        x_norm = x.clone()
        x_norm[:, 0] = x[:, 0] / 21.0
        x_norm[:, 1] = x[:, 1] / 11.0
        logits = self.layers(x_norm)
        return logits