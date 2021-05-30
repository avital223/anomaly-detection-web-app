# anomaly-detection-web-app

## Server Side

The server is a Node.js server (ver. 14.16.1) implementing the REST API.

#### how to run:
to run the server you need to use node.js 
```
node Sever/Controller/server.js
```


### additional features

1. worker pool - we added a worker pool (equivalent to threads) for learning and detecting anomalies in order to make the server asynchronous
and more efficient.
   
2. graceful exit - we added a code to make the sever exit gracefully in any situation.

3. Express.js - we used Express.js in order to implement the Rest API



### API 
Type       | Endpoint      | query      | body         | Explanation
----       | --------      | :---:      | :---:        | --------------------
**GET**    | _/api/model_  | model_id   | X            | send back a model with model_id
**POST**   | _/api/model_  | type       | train_data   | create a new model train it with train_data and send back its model_id
**DELETE** | _/api/model_  | model_id   | X            | delete the model with model_id
**GET**    | _/api/models_ | X          | X            | send back all the models on the server as an array 
**POST**   |_/api/anomaly_ | model_id   | predict_data | use the model with model_id to detect anomalies in predict_data 

### External Libraries:

name              | version  | usage
 ----             | -------- | ---
express           | _4.17.1_ | running the server
express-queue     | _0.0.12_ | limiting the number of running requests
express-validator | _6.11.1_ | validating the requests
nedb              | _1.8.0_  | database
workerpool        | _6.1.4_  | creating and handling workers

-------

## Client Side

this is a Client to communicate with the server using the [API](#API)

### how to use:
the web page is divided into _num_ section:

* **Buttons Row** - here there are 3 button -
  * add - after the user uploaded a csv and chose a type pressing on this button will add a new model with the csv data 
  * detect - after the user uploaded a csv and chose a model pressing on this button will detect the anomalies in the csv with the chosen model 
  * delete - pressing on this button will delete the selected model
  * type selection - select between `hybrid | regression` for the new detector
* **Chart Area** - the area in which the chart appear after data has been uploaded. If we detected anomalies, the time of the appeard anomalies will be colored in red.
* **Models list** - here all the models currently on the server appears in the format `model_id | upload date` if the model is ready it will show in green and if it is pending it will show in red
* **DropBox** - the users can drag over or use the button labeled `Choose File` to upload a csv file.
* **Data Table** - the area in which the table with the user data will appear after data has been uploaded. If we detected anomalies, they will be colored in red in the table.
* **Anomalies Table** - after pressing `detect` this table will appear if there wasn't any anomalies it will say `No Anomalies Detected` otherwise it will show all the anomalies with there reasons
  
to use this app you need to upload a csv with data, choose a detector type (hybrid by default) and press `add`. \
after that you see a new model in the model list, after it turnd green you can upload new data choose the model and press `detect`. \
you can also delete a model by choosing ine and pressing `delete`

### External Libraries:

name       | version
----       | --------
Charts.js | _3.3.0_

________
