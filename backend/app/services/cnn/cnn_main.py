from app.services.cnn.CNN_framework import CNN


def init_model():
    structure = [
        ["conv", 1, 16, 3],
        ["pool", 2],
        ["conv", 16, 32, 3],
        ["pool", 2],
        ["fc", 1568, 128, False],
        ["fc", 128, 10, True]
    ]

    model = CNN(structure,
            epochs=20,
            batch_size=1,
            learning_rate=0.0005,
            colour_channels=1,
            picture_h=28,
            picture_w=28,
            adam=True,
            dropout=0.0
            )

    model.load_weights(filepath="models/cnn_model_weights.npz")

    return model
