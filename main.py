""" Main.py

This is the main entry-point when the docker-container is initialized.
It executes the following steps:

1) Read the input.txt
    This should contain the name of the method that should be executed.
    Optionally (but in most cases) it contains args and kwargs
2) The token is read from token.txt This is a JWT token that can be 
    used to interact with the server
3) The method is executed
4) The output it written to output.txt

If the docker container is terminated. The output of the method will be 
send to the server by the node.
"""
import json
import os
import sys

from methods import master, my_turn, info, warn

"""
You should add all functions that should be triggered at the node 
instances by either the researcher or master container. Also you 
should specify a default method in case the (user) defined method
can not be found
"""
method_map = {
    "my_turn": my_turn,
    "master": master
}
default_method = "master"

""" --------------------------------------------------------------------
(!) Do not edit anything bellow unless you really know what you are 
    doing! 
-------------------------------------------------------------------- """ 

# read input from the mounted inputfile.
info("Reading input")
with open(os.environ["INPUT_FILE"]) as fp:
    input_ = json.loads(fp.read())

# extract method/function from input file and get the args and kwargs 
# input for this function.
method_name = input_.get("method", default_method)
method = method_map.get(method_name)
if not method:
    warn(f"method name={method_name} not found!\n")
    exit()

# all containers receive a token, however this is usually only
# used by the master method. But can be used by regular containers also
# for example to find out the node_id.
info("Reading token")
with open(os.environ["TOKEN_FILE"]) as fp:
    token = fp.read().strip()
    
# make the actual call to the method/function
output = method(token)

# write output from the method to mounted output file. Which will be 
# transfered back to the server by the node-instance.
info("Writing output")
with open(os.environ["OUTPUT_FILE"], 'w') as fp:
    fp.write(json.dumps(output))
