<img src="https://iknl.nl/images/default-source/images/.png?sfvrsn=3" align="right">

# d_boilerplate
Boilerplate for new algorithms. 

## main.py
Is the main entry-point of the docker-container. You need to specify the list
of methods which should be available in the node. 

## methods.py
Contains the individual functions that can be triggered by the researcher. 
You are free to use multiple files. Note that each function can only be 
called once per tasks, in other words if you would like to trigger multiple
functions in a single step you need to combine these in a single method.

If a method is finished it produces a result, which is stored at the local 
node. The node instance will handle the delivery to the central server. It 
also makes sure that the result is encrypted specifically for the intented 
receiver. 

Make sure to use plenty of `info` and `warn` messages, this makes debugging
a lot easier. 
