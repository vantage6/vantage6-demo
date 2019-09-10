""" methods.py

This file contains all algorithm pieces that are executed on the nodes. 
It is important to note that the master method is also triggered on a 
node just the same as any other method. 

When a return statement is reached the result is send to the central 
server after encryption.
"""
import os
import pandas
import sys
import time
import json

from joey.node.server_io import ClientContainerProtocol

# loggers
info = lambda msg: sys.stdout.write("info > "+msg+"\n")
warn = lambda msg: sys.stdout.write("warn > "+msg+"\n")

def master(token, *args, **kwargs):
    """Master algoritm.
    
    The master algorithm is the chair of the Round Robin, which makes 
    sure everyone waits for their turn to identify themselfs.
    """

    # post task to all nodes in collaboration, the environment variables
    # are set by the node instance
    info("Setup (proxy)server communication client")
    client = ClientContainerProtocol(
        token=token, 
        host=os.environ["HOST"],
        port=os.environ["PORT"], 
        path=os.environ["API_PATH"]
    )

    # get all organizations (ids) that are within the collaboration
    # FlaskIO knows the collaboration to which the container belongs
    # as this is encoded in the JWT (Bearer token)
    organizations = client.get_organizations_in_my_collaboration()
    ids = [organization.get("id") for organization in organizations]

    # The input fot the algorithm is the same for all organizations
    # in this case  
    info("Defining input paramaeters")
    input_ = {
        "method": "some_example_method",
    }

    # create a new task for all organizations in the collaboration.
    task = client.create_new_task(
        input_=input_, 
        organization_ids=ids
    )

    # wait for node to return results. Instead of polling it is also
    # possible to subscribe to a websocket channel to get status
    # updates
    task_id = task.get("id")
    task = client.request(f"task/{task_id}")
    while not task.get("complete"):
        task = client.request(f"task/{task_id}")
        info("Waiting for results")
        time.sleep(1)

    info("Obtaining results")
    results = client.get_results(task_id=task.get("id"))
    results = [json.loads(result.get("result")) for result in results]

    info("master algorithm complete")

    # return all the messages from the nodes
    return results

def some_example_method(token, *args, **kwargs):
    """Some_example_method.
    
    loads the dataframe and reports if it succeeded by returning a 
    boolean value.
    """

    success = True
    try:
        dataframe = pandas.read_csv(
            os.environ['DATABASE_URI'], 
            sep=";",
            decimal=","
        )
    except Exception:
        succes = False
    
    # what you return here is send to the central server. So make sure 
    # no privacy sensitive data is shared
    return succes
