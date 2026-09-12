import numpy as np


#the Convolution layer is so designed that you can not choose the padding and the stride freely but they depend on the filter size so the size of the input and of the output are equivalent
class ConvLayer:
    def __init__(self, in_channels, filter_amount, filter_size, learning_rate, adam):
        self.in_channels = in_channels
        self.filter_amount = filter_amount
        self.filter_size = filter_size
        self.out_channels = self.filter_amount
        self.padding = self.filter_size // 2
        self.learning_rate = learning_rate

        #initiating filters and biases
        self.filters = np.random.randn(self.out_channels, self.in_channels, self.filter_size, self.filter_size) / self.filter_size ** 2
        self.biases = np.zeros((1, self.out_channels, 1, 1))

        #if adam optimizer is used initiating adam
        self.adam = adam
        if self.adam:
            self._init_adam()



    def _init_adam(self):
        self.beta_1 = 0.9
        self.beta_2 = 0.999
        self.t = 0
        self.m_filters = np.zeros_like(self.filters)
        self.v_filters = np.zeros_like(self.filters)
        self.m_biases = np.zeros_like(self.biases)
        self.v_biases = np.zeros_like(self.biases)

    def _adam(self):
        #adam momentum and variance changes the gradient values
        self.t += 1
        self.m_filters = self.beta_1 * self.m_filters + (1-self.beta_1) * self.filters_grad
        self.m_biases = self.beta_1 * self.m_biases + (1-self.beta_1) * self.biases_grad

        self.v_filters = self.beta_2 * self.v_filters + (1-self.beta_2) * self.filters_grad**2
        self.v_biases= self.beta_2 * self.v_biases + (1-self.beta_2) * self.biases_grad**2

        m_hat_filters = self.m_filters / (1 - self.beta_1 ** self.t)
        m_hat_biases = self.m_biases / (1 - self.beta_1 ** self.t)
        v_hat_filters = self.v_filters / (1 - self.beta_2 ** self.t)
        v_hat_biases = self.v_biases / (1 - self.beta_2 ** self.t)

        self.filters_grad = m_hat_filters / (np.sqrt(v_hat_filters) + 1e-8)
        self.biases_grad = m_hat_biases / (np.sqrt(v_hat_biases) + 1e-8)
        return self



    def _im2col(self, input):
        #the input array gets transformed into a column form with which the output can be calculated with a single dot product
        input_col = np.zeros((self.batch_size, self.in_channels, self.filter_size, self.filter_size, self.h, self.w))
        for i in range(self.filter_size):
            for j in range(self.filter_size):
                input_col[:, :, i, j, :, :] = input[:, :, i:i+self.h, j:j+self.w]

        input_col = input_col.transpose(0, 4, 5, 1, 2, 3).reshape(self.batch_size * self.h * self.w, -1)
        return input_col

    def _flatten_filters(self, flip=False):
        #the filters are getting flattened to be used with the column arrays
        filters_new = self.filters.copy()
        if flip:
            filters_new = np.flip(self.filters, (2, 3))
            return filters_new.reshape(( -1))
        flattened_filters = filters_new.reshape((self.out_channels, -1))
        return flattened_filters

    def _col2im(self, output_col):
        #the calculated output gets reshaped into the image form
        output = output_col.reshape((self.out_channels, self.batch_size, self.h, self.w)).transpose(1, 0, 2, 3)
        return output



    def _relu(self, z):
        #relu outputs 0 if z < 0 or z if z > 0
        return np.maximum(0, z)

    def _relu_grad(self, z):
        #the relu gradient outputs 0 if z < 0 and 1 if z > 0
        return z > 0



    def forward(self, input, training):
        self.batch_size, self.in_channels, self.h, self.w = input.shape

        #padding of the input
        self.input_pad = np.pad(input,
                       ((0, 0),
                        (0, 0),
                        (self.padding, self.padding),
                        (self.padding, self.padding)),
                        'constant',
                       constant_values=0)

        #here the convolution between the input and the filters is getting calculated
        self.input_col = self._im2col(self.input_pad)
        self.flattened_filters = self._flatten_filters()
        output_col = np.dot(self.flattened_filters, self.input_col.T)
        output = self._col2im(output_col)

        self.z = output + self.biases
        output = self._relu(self.z)
        return output



    def _col2im_back(self, input_grad_col):
        #the input gradient gets transformed back to the padded input shape
        input_grad_col_reshaped = input_grad_col.reshape(self.batch_size, self.h, self.w, self.in_channels, self.filter_size, self.filter_size)
        input_grad_col_reshaped = input_grad_col_reshaped.transpose(0, 3, 4, 5, 1, 2)

        padded_h = self.h + 2 * self.padding
        padded_w = self.w + 2 * self.padding
        input_grad = np.zeros((self.batch_size, self.in_channels, padded_h, padded_w))

        for i in range(self.filter_size):
            for j in range(self.filter_size):
                input_grad[:, :, i:i + self.h, j:j + self.w] += input_grad_col_reshaped[:, :, i, j, :, :]

        return input_grad

    def backward(self, output_grad, y):
        #gradient of the relu function
        z_grad = output_grad * self._relu_grad(self.z)
        #bias gradients are getting calculated and reshaped
        self.biases_grad = np.sum(z_grad, axis=(0, 2, 3))
        self.biases_grad = self.biases_grad.reshape((1, self.out_channels, 1, 1)) / self.batch_size

        #the gradient of the filters are evaluated by a convolution between the input and the pre-relu gradients
        #the method used for the convolution is pretty much the same as the forward propagation
        z_grad_reshaped = z_grad.transpose(1, 0, 2, 3).reshape((self.out_channels, -1))
        filters_grad_flattened = np.dot(z_grad_reshaped, self.input_col)
        self.filters_grad = filters_grad_flattened.reshape((self.filters.shape)) / self.batch_size

        if self.adam:
            self._adam()

        #gradient descend
        self.filters -= self.learning_rate * self.filters_grad
        self.biases -=  self.learning_rate * self.biases_grad

        #computation of the gradient with respect to the input
        input_grad_col = np.dot(z_grad_reshaped.T, self.flattened_filters)
        input_grad_pad = self._col2im_back(input_grad_col)

        #remove padding
        input_grad = input_grad_pad[:, :, self.padding:-self.padding, self.padding:-self.padding]
        return input_grad




#Max pooling layer takes the maximum pixel value from a square with length self.size and minimizes this square to one value
class PoolLayer:
    def __init__(self, size=2):
        self.size = size

    def forward(self, input, training):
        self.input = input
        batch_size, in_channels, h, w = input.shape
        h_new = h//self.size
        w_new = w//self.size

        #the input gets reshaped into a format, which is similar to the one used in the convolution layer, that increases the computational speed because it does not require nested for loops
        input_reshaped = input.reshape((batch_size, in_channels, h_new, self.size, w_new, self.size))
        input_transposed = input_reshaped.transpose(0, 1, 2, 4, 3, 5).copy()
        output = np.max(input_transposed, axis=(4, 5))

        self.input_transformed = input_transposed
        self.output = output
        return output

    def backward(self, output_grad, y):
        #first the gradient of the previous layer gets multiplied with a mask so only the values which actually affected the loss function (the max values) are getting gradients
        mask = (self.input_transformed == self.output[:, :, :, :, np.newaxis, np.newaxis])
        output_grad_expanded = output_grad[:, :, :, :, np.newaxis, np.newaxis]

        input_grad_transposed = mask * output_grad_expanded
        #the gradient array is getting transformed back to match the shape of the input
        input_grad_reshaped = input_grad_transposed.transpose(0, 1, 2, 4, 3, 5)
        input_grad = input_grad_reshaped.reshape((self.input.shape))
        return input_grad



#Fully connected Layer like the ones used in an MLP
class FullyConnectLayer:
    def __init__(self, in_size, out_size, learning_rate, softmax=False, adam=False, dropout=0):
        self.in_size = in_size
        self.out_size = out_size
        self.learning_rate = learning_rate
        self.softmax = softmax
        self.adam = adam
        self.dropout = dropout

        #initiating weights and biases
        self.weights = np.random.randn(self.in_size, self.out_size) * np.sqrt(2/self.in_size)
        self.biases = np.zeros(self.out_size)

        #if adam is used initiating adam
        if self.adam:
            self._init_adam()

    def _init_adam(self):
        self.beta_1 = 0.9
        self.beta_2 = 0.999
        self.t = 0
        self.m_weights = np.zeros_like(self.weights)
        self.v_weights = np.zeros_like(self.weights)
        self.m_biases = np.zeros_like(self.biases)
        self.v_biases = np.zeros_like(self.biases)

    def _adam(self):
        #adam momentum and variance changes the gradient values
        self.t += 1
        self.m_weights = self.beta_1 * self.m_weights + (1-self.beta_1) * self.weights_grad
        self.m_biases = self.beta_1 * self.m_biases + (1-self.beta_1) * self.biases_grad

        self.v_weights = self.beta_2 * self.v_weights + (1-self.beta_2) * self.weights_grad**2
        self.v_biases= self.beta_2 * self.v_biases + (1-self.beta_2) * self.biases_grad**2

        m_hat_weights = self.m_weights / (1 - self.beta_1 ** self.t)
        m_hat_biases = self.m_biases / (1 - self.beta_1 ** self.t)
        v_hat_weights = self.v_weights / (1 - self.beta_2 ** self.t)
        v_hat_biases = self.v_biases / (1 - self.beta_2 ** self.t)

        self.weights_grad = m_hat_weights / (np.sqrt(v_hat_weights) + 1e-8)
        self.biases_grad = m_hat_biases / (np.sqrt(v_hat_biases) + 1e-8)
        return self



    def _create_dropout(self):
        #dropout deactivates some neurons while training to prevent overfitting
        scale = 1 / (1 - self.dropout)
        dropout_mask = (np.random.random(self.output.shape) > self.dropout) * scale
        return dropout_mask



    def _relu(self, z):
        #relu outputs 0 if z < 0 or z if z > 0
        return np.maximum(0, z)

    def _relu_grad(self, z):
        #the relu gradient outputs 0 if z < 0 and 1 if z > 0
        return z > 0

    def _softmax(self, z):
        #softmax is used to transform a vector of float numbers to according probabilities which add up to 1
        e_z = np.exp(z - np.max(z, axis=1, keepdims=True))
        return e_z / np.sum(e_z, axis=1, keepdims=True)



    def forward(self, input, training):
        self.original_shape = input.shape
        #the input gets flattened
        self.input = input.reshape(input.shape[0], -1)
        #the weights and biases get applied
        self.z = np.dot(self.input, self.weights) + self.biases

        #if this is not the last layer thus does not use softmax the function applies the relu function and in case of training creates the neuron dropout
        if not self.softmax:
            self.output = self._relu(self.z)
            if training:
                self.mask = self._create_dropout()
                self.output *= self.mask
        #if this is the last layer it uses the softmax function
        else:
            self.output = self._softmax(self.z)
        return self.output

    def backward(self, output_grad, y):
        #the gradient of the cross-entropy loss function with respect of the pre-softmax output is just the difference between the output and the true y value
        if self.softmax:
            grad_z = self.output - y
        #this is the gradient of the relu function and the inversion of the dropout
        else:
            grad_z = output_grad * self._relu_grad(self.z)
            if self.dropout > 0 and hasattr(self, 'mask'):
                grad_z *= self.mask

        #the weights and biases gradients get calculated
        self.weights_grad = np.dot(self.input.T, grad_z) / self.original_shape[0]
        self.biases_grad = np.sum(grad_z, axis=0) / self.original_shape[0]

        #the gradient of the loss function with respect to the input gets handed to the back propagation of the previous layer
        input_grad = np.dot(grad_z, self.weights.T)
        input_grad = input_grad.reshape(self.original_shape)

        if self.adam:
            self._adam()

        #gradient descend
        self.weights -= self.learning_rate * self.weights_grad
        self.biases -= self.learning_rate * self.biases_grad
        return input_grad




"""template for a structure list:
structure = [[layer="conv", channels=int, filter_amount=int, filter_size=int(3,5,7)],
            [layer="pool", size=int(2)],
            [layer="fc", in_size=int, out_size=int(layer_size), softmax=bool]]
"""

class CNN:
    def __init__(self, structure, epochs, batch_size, learning_rate, colour_channels, picture_h, picture_w, adam=False, dropout=0):
        self.epochs = epochs
        self.batch_size = batch_size
        self.y_size = structure[-1][2]
        self.colour_channels = colour_channels
        self.picture_h = picture_h
        self.picture_w = picture_w

        #interpreting structure and creating the layers
        self.layers = []
        for layer in structure:
            if layer[0] == "conv":
                self.layers.append(ConvLayer(layer[1], layer[2], layer[3], learning_rate, adam))

            elif layer[0] == "pool":
                self.layers.append(PoolLayer(layer[1]))

            elif layer[0] == "fc":
                self.layers.append(FullyConnectLayer(layer[1], layer[2], learning_rate, layer[3], adam, dropout))



    def _create_mini_batches(self, X, y):
        #shuffling the data and creating mini batches for training
        rows = X.shape[0]
        mini_batches = []
        for i in range(0, rows, self.batch_size):
            X_batch = X[i:i + self.batch_size]
            y_batch = y[i:i + self.batch_size]
            mini_batches.append((X_batch, y_batch))
        return mini_batches

    def _vectorize(self, y):
        #transforming the y values from a number that states the outcome to a vector of zeros with a the value one on the yth place
        y_vector = np.zeros((len(y), self.y_size))
        y_vector[np.arange(len(y)), y] = 1
        return y_vector

    def _calc_loss(self, y_hat, y):
        #calculates cross entropy loss for classification
        log_likelihood = -np.log(y_hat[range(y.shape[0]), np.argmax(y, axis=1)] + 1e-8)
        return np.mean(log_likelihood)

    def fit(self, X, y):
        #reshaping X and y into the preferred forms
        X = X.reshape(X.shape[0], self.colour_channels, self.picture_h, self.picture_w)
        if X.max() > 1.0:
            X = X / 255.0
        y = self._vectorize(y)
        for epoch in range(self.epochs):
            #create mini batches
            permutation = np.random.permutation(X.shape[0])
            X_shuffled = X[permutation]
            y_shuffled = y[permutation]
        
            mini_batches = self._create_mini_batches(X_shuffled, y_shuffled)
            Loss_mini_batch = []
            for mini_batch in mini_batches:
                X_input, y_input = mini_batch

                #forward propagation
                for layer in self.layers[0::]:
                    X_input = layer.forward(X_input, training=True)
                y_hat = X_input

                #storing the loss
                Loss_mini_batch.append(self._calc_loss(y_hat, y_input))

                #backward propagation
                output_grad = 0
                for layer in reversed(self.layers[0::]):
                    output_grad = layer.backward(output_grad, y_input)
            print(epoch, np.mean(np.array(Loss_mini_batch)))
        return self

    def predict(self, X):
        #reshaping X
        X = X.reshape(X.shape[0], self.colour_channels, self.picture_h, self.picture_w)
        if X.max() > 1.0:
            X = X / 255.0
        #calculating the output
        for layer in self.layers:
            X = layer.forward(X, training=False)
        #returning the value with the highest probability
        return X

    def save_weights(self, filepath="cnn_mnist_weights.npz"):
        weights_dict = {}

        for i, layer in enumerate(self.layers):
            if isinstance(layer, ConvLayer):
                weights_dict[f"layer_{i}_filters"] = layer.filters
                weights_dict[f"layer_{i}_biases"] = layer.biases

            if isinstance(layer, FullyConnectLayer):
                weights_dict[f"layer_{i}_weights"] = layer.weights
                weights_dict[f"layer_{i}_biases"] = layer.biases

        np.savez_compressed(filepath, **weights_dict)

    def load_weights(self, filepath="cnn_mnist_weights.npz"):
        data = np.load(filepath)

        for i, layer in enumerate(self.layers):
            if isinstance(layer, ConvLayer):
                layer.filters = data[f"layer_{i}_filters"]
                layer.biases = data[f"layer_{i}_biases"]

            if isinstance(layer, FullyConnectLayer):
                layer.weights = data[f"layer_{i}_weights"]
                layer.biases = data[f"layer_{i}_biases"]




