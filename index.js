const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "Task";



const sendResponse = (code, data)=>{
return {
  statusCode: code,
  body: JSON.stringify(data)
}

};

module.exports.create = async (event) => {

try{
  let requestJSON = JSON.parse(event.body);
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        category: requestJSON.category,
        taskName: requestJSON.taskName,
        description: requestJSON.description,

      },
      ConditionExpression: "attribute_not_exists(taskName)"
    })
  );
  body = 'Put item '+ requestJSON.taskName;
  return sendResponse(201,body)
 }
 catch(err){
  console.log(err);
  return sendResponse(500,err.message)

}


};
module.exports.update = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("update")
  };
};

module.exports.delete = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify("delete")
  };
};

module.exports.get = async (event) => {
  


  try{
    let requestJSON = JSON.parse(event.body);
    const response = await dynamo.send(
      new ScanCommand({
        TableName: tableName
      })
    );
   
    return sendResponse(200,response)
   }
   catch(err){
    console.log(err);
    return sendResponse(500,err.message)
  
  }

};

