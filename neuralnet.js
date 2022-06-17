class NeuralNetwork {
    // an int array that sequentially defines the number of neuron in the ith layer of the network
    constructor(layerSizes) {
        this.layers = [] // store all layers created
        for (let i = 0; i < layerSizes.length-1; i++) {
            this.layers.push(new Layer(
                layerSizes[i], layerSizes[i+1]
            ))
        }
    }

    static feedForward(inputs, network) {
        let outputs = Layer.feedForward(inputs, network.layers[0])
        for (let i=1; i<network.layers.length; i++) {
            outputs=Layer.feedForward(outputs, network.layers[i])
        }
        return outputs
    }

}

class Layer {
    // inputLayerSize: int, the size of the layer feeding into this object
    // outputLayerSize: int, the size of the layer this object will feed into
    constructor (inputLayerSize, outputLayerSize) {
        this.inputs = new Array(inputLayerSize)
        this.outputs = new Array(outputLayerSize)
        this.biases = new Array(outputLayerSize) // biases that map from input layer neurons to output layers neurons
        this.weights = []; // recall each input neuron in a layer has a weight
        
        
        for (let i = 0; i<inputLayerSize; i++) {
            
            this.weights[i] = new Array(outputLayerSize) // each neuron must map to every output neuron with some weight
        }
        // randomize all weights and biases when this layer is initialized
        Layer.#randomize(this)

    }
    static #randomize(layer) {
        console.log("randomizing line 43")
        for (let i = 0; i < layer.inputs.length; i++) {
            for (let j = 0; j < layer.outputs.length; j++) {
                layer.weights[i][j] = Math.random()*2-1
            }
        }

        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random()*2-1
        }
    }

    static feedForward(receivedInputs, layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            layer.inputs[i] = receivedInputs[i]
        }

        for (let i = 0; i < layer.outputs.length; i++) {
            let sum = 0
            for (let j = 0; j < layer.inputs.length; j++) {
                sum += layer.inputs[j]*layer.weights[j][i]
            }

            if (sum > layer.biases[i]) {
                layer.outputs[i] = 1
            } else {
                layer.outputs[i] = 0
            }
        }
        return layer.outputs
    }
}
