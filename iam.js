const { CognitoJwtVerifier } = require("aws-jwt-verify")
// Verifier that expects valid access tokens:

const CLIENT_ID= process.env.CLIENT_ID;
const USER_POOL_ID= process.env.USER_POOL_ID;

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "id",
  clientId: CLIENT_ID,
});



module.exports.authorizer = async (event,context,callback) => {
console.log("clientId -->"+CLIENT_ID);
console.log("userPoolId -->"+USER_POOL_ID);
  try {
    const payload = await verifier.verify(event.authorizationToken// the JWT as string
    );
    console.log("Token is valid. Payload:", payload);
    callback(null, generatePolicy('user', 'Allow', event.methodArn));

  } catch {
    console.log("Token not valid!");
    callback("Unauthorized", generatePolicy('user', 'Deny', event.methodArn));
  }


   
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    
    };
    
    
    // Help function to generate an IAM policy
    var generatePolicy = function(principalId, effect, resource) {
      var authResponse = {};
      
      authResponse.principalId = principalId;
      if (effect && resource) {
          var policyDocument = {};
          policyDocument.Version = '2012-10-17'; 
          policyDocument.Statement = [];
          var statementOne = {};
          statementOne.Action = 'execute-api:Invoke'; 
          statementOne.Effect = effect;
          statementOne.Resource = resource;
          policyDocument.Statement[0] = statementOne;
          authResponse.policyDocument = policyDocument;
      }
      
      // Optional output with custom properties of the String, Number or Boolean type.
      authResponse.context = {
          "stringKey": "stringval",
          "numberKey": 123,
          "booleanKey": true
      };
      return authResponse;
    }