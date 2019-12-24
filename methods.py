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

from vantage.node.server_io import ClientContainerProtocol

from ui import app

# loggers
info = lambda msg: sys.stdout.write("info > "+msg+"\n")
warn = lambda msg: sys.stdout.write("warn > "+msg+"\n")

def supervisor(token, *args, **kwargs):
    """Supervisor
    
        Global process to host the DEMO on several nodes. It
        1) starts a UI on all nodes (which is also a Docker image)
        2) send a container to monitor the UI status
        3) in case this is "waiting", the secure sum algorithm is 
            kicked off.
        4) wait for the (master) algorithm to finish
        5) send the results to all nodes
        6) go to step (2)
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
        "method": "start_ui",
    }

    # start-up the UI on the nodes
    info("Starting UI on all nodes")
    task = client.create_new_task(
        input_=input_, 
        organization_ids=ids
    )

    i = 0
    while True:
        info(f"New round! {i}")

        # track the state of the UI at all nodes
        info("Start task to monitor UI status")
        task = client.create_new_task(
            input_ = {"method": "report_ui_status"},
            organization_ids=ids
        )

        # wait until all nodes report that it is waiting for the results
        task_id = task.get("id")
        task = client.request(f"task/{task_id}")
        while not task.get("complete"):
            task = client.request(f"task/{task_id}")
            info("Waiting till all nodes are ready")
            time.sleep(1)

        # kick of secure sum master algorithm on the first node
        info("Secure sum master algorithm is kicked off")
        task = client.create_new_task(
            input_ = {"method": "secure_sum_master"},
            organization_ids=ids[0]
        )

        info("Waiting for secure sum results")
        task_id = task.get("id")
        task = client.request(f"task/{task_id}")
        while not task.get("complete"):
            task = client.request(f"task/{task_id}")
            info("Waiting nodes to input data")
            time.sleep(1)

        info("Obtaining results")
        results = client.get_results(task_id=task.get("id"))
        result = [json.loads(result.get("result")) for result in results][0]

        info("Delivering results to all nodes")
        task = client.create_new_task(
            input_ = {
                "method": "deliver_final_results",
                "kwargs": {
                    "result": result
                }
            }
            organization_ids=ids
        )

    # return all the messages from the nodes
    return results

def start_ui(token, *args, **kwargs):
    """ Start DEMO UI on node.

        The UI manipulates files in the temporary volume. This way 
        the status of the UI can be red by a secondairy container with
        the same run_id. 
    """
    app.run(host="0.0.0.0", port=5000)

def catch_waiting_status(token, *args, **kwargs):
    
    while True:
        with open("/mnt/tmp/status.txt", "r") as f:
            status = f.read()
            if  == "waiting":
                info("UI Waiting for results")
                break
            else:
                info(f"File status is {status}")

def deliver_final_results(token, *args, **kwargs):
    with open("/mnt/tmp/results.txt", "w") as f:
        f.write(kwargs["results"])

def secure_sum_master(token, *args, **kwargs):
    """Master
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

    # run the initialization step on the first node
    task = client.create_new_task(
        input_={"method":"secure_sum_init"}, 
        organization_ids=ids[0]
    )

    # run the step on all other nodes



def secure_sum_init(token, *args, **kwargs):
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

def secure_sum_step(token, *args, **kwargs):
    pass

def secure_sum_end(token, *args, **kwargs):
    pass