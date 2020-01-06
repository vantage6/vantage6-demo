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

from pathlib import Path
from random import randint

from vantage.node.server_io import ClientContainerProtocol

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
    info("Retrieving organizations that are part of the collaboration")
    organizations = client.get_organizations_in_my_collaboration()
    ids = [organization.get("id") for organization in organizations]

    if ids < 3:
        info("Not enough parties in this collaboration")
        exit()

    # the first step is to generate a random number and add the value at 
    # the first node. 
    task = client.create_new_task(
        input_= {"method": "secure_sum_init"}, 
        organization_ids=ids[0]
    )
    result = wait_for_result(client, task)
    
    # in each step each nodes ads its value to this number
    for id_ in ids[1:]:
        task = client.create_new_task(
            input_ = {"method": secure_sum_step, "kwargs": result},
            organization_ids=[id_]
        )
        result = wait_for_result(task)

    # in the final step the initial node will subtract the random number
    # it added
    task = client.create_new_task(
        input_= {"method": "secure_sum_end"}, 
        organization_ids=ids[0]
    )
    result = wait_for_result(client, task)
    
    return result

def wait_for_result(client, task):
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
    return results

def secure_sum_init(token, *args, **kwargs):
    
    # compute random number
    info("Generating random numbers")
    r_age = randint(0,99)
    r_weight = randint(0,99)

    # read local values
    info("Reading database file")
    dataframe = pandas.read_csv(
        os.environ['DATABASE_URI'], 
        sep=";",
        decimal=","
    )
    age = int(dataframe["age"].iloc[0]) + r_age
    weight = int(dataframe["weight"].iloc[0]) + r_weight

    # write random values to temporary volume
    info("Writing random value to temp folder")
    file_ = Path(os.environ['TEMPORARY_FOLDER']) / "random.txt"
    with open(file_, "w") as f:
        f.write(f"{r_age}\n{r_weight}")

    # return to central part of algorithm
    return {"age": age, "weight": weight}

def secure_sum_step(token, age, weight):
    
    # read local values
    info("Reading database file")
    dataframe = pandas.read_csv(
        os.environ['DATABASE_URI'], 
        sep=";",
        decimal=","
    )

    info("Add local values to the incomming values")
    info(str(age))
    age = int(dataframe["age"].iloc[0]) + age
    weight = int(dataframe["weight"].iloc[0]) + weight

    return {"age": age, "weight": weight}

def secure_sum_end(token, age, weight):
    
    # read random number
    info("Reading random numbers from temporary file")
    file_ = Path(os.environ['TEMPORARY_FOLDER']) / "random.txt"
    with open(file_, "r") as f:
        random_numbers = f.read()
    
    # extract numbers from string
    numbers = random_numbers.splitlines()
    r_age = int(numbers[0])
    r_weight = int(numbers[1])
    
    # subtract value from the final
    info("Subtract random values to retrieve final result")
    age = age - r_age
    weight = weight - r_weight

    return {"age": age, "weight": weight}
