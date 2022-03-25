# ProofSpace Webhooks Overview


## ProofSpace provides the following integration points:



Called by ProofSpace:
1. Action Interaction Webhook
2. Credential Check Webhook

Called by third-party:
1. Credential Issuing Webhook

Webhook calls are performed as HTTPS Post requests, where input and output are json encoded values.


## Authentication Schemas


## We support two authentication schema:



1. Request Signature
    Each call should have an additional  **X-Body-Signature** header with the value of the third-party’s sha3-256 signature in base64 encoding. ProofSpace and third-parties should exchange public keys before integration.
2. Bearer Token
    Each call should have an **Authorization** header with the value `Bearer {token}`, where the token is a base64 representation of the JsonWebToken as defined in RFC 7519.

         



* In the request from ProofSpace,  'iss'  field is a public DID of the service[^1].


* In request to ProofSpace, 'aud' field should be a public DID of the service.
* ProofSpace and third-parties should exchange public keys of sha secrets before integration.

Repository [https://github.com/zakaio/docs-and-examples](https://github.com/zakaio/docs-and-examples) contains examples.


## Description of calls


### **Interaction Webhook**

An interaction webhook can be called while the user performs an interaction.

It receives information about current activity and received credentials (details below) and may return information about issued credentials.

The input contains the following fields:



* _publicServiceDid_: string;  -- public DID of service which owns the action.
* subscriberConnectDid: string; -- connect DID of the subscriber to this service.
* _actionId_: string;  // action template
* _actionInstanceId_: string;  // action instance.
* _actionEventId_: string;  // id of the event  (unique for service)
* _actionParams_: {_name_: string, _value_: string}[];  // array of parameters, configured in action
* _receivedCredentials_: WebhookCredentialValuesDTO[ ] ;  //array of required credentials. 

Where WebhookCredentialValuesDTO consists of:



* _credentialId_: string;  // credentialId
* _schemaId_: string;   //   schemaId
* _fields_: { _name_: string, _value_: string }[];  // credentials from phone
* _utcIssuedAt_: number; // utc   time in milliseconds
* _revoked_: boolean; //  is this credential revoked.  (optional)
* _utcRevokedAt_?: number; // time when credential was revoked (optional).

 Webhook in case of success invocation should return json with the following fields:



* _serviceDid_: string; //  public service DID, should be the same as in request
* _subscriberConnectDid_: string; // connect DID, should be the same as in request
* _actionEventId_: string;  //  event
* _issuedCredentials_:  WebhookCredentialValuesDTO[ ];  // array of issued credentials.
* _revokedCredentials_: [] // can be kept as an empty array

     


Note: if third-party systems want to deny or postpone the issuing of a credential back to a user, then it should return credentials with empty fields and the revoked flag set to true.


### **Credential Check Webhook**

Can be configured to perform validation of credentials behind ProofSpace (such as checking that the hash is present in the blockchain or checking the root authority of the certificate).

It should accept json with the following fields:



* _serviceDid_: string;  //  public DID of service, which call action
* _subscriberDid_: string;  //  connect DID of subscriber
* _credentialId_: string;  //  credentialId, registered in blockchain
* _schemaId_: string;  // schema id
* _fields_: { name: string, value: string } [];  // array of fields.

and return the structure with the following fields:



* _ok_: boolean;   // true if check was successful, false otherwise.
* _errorMessage_?: string //  optional error message if check was unsuccessful
* _extra_: //   optional extra information which contains
    * _schemaId_?: string;   //  optional schemaId of returned fields.  If present - _info_ should contain fields from this schema, otherwise _info_ contains fields in any form.
    * _info_: { name: string, value: string }[]; //values 
    * _format_: string;  // optional format description for values, encoded in _info_.  should be ‘plain’ or ‘json’.


### **Credential Issue Webhook**

Credential issued webhook is called by the third-party to ProofSpace server via URL:

&lt;container-root>/service/:serviceDid/webhook-accept/credendials-issued

i.e. for the SaaS installation, this should be:

[https://platform.proofspace.id/service/:serviceDid/webhook-accept/credentials-issued](https://platform.proofspace.id/service/:serviceDid/webhook-accept)/.

where: serviceDid  is a public DID of the credential owner.

ProofSpace accepts the structure with the following fields:



* _serviceDid: string;_  //  public DID of service which issues credential, the same as in the query path.
* _subscriberConnectDid_: string;  //  connect DID of  subscriber for this service
* _credentials_: WebhookCredentialValuesDTO[];  //  array of credentials issued.  (the same as in ‘action’ webhook).
* _issuedAt_:  UTC timestamp of issued date in milliseconds.

And the returned structure is:



* _ok_: boolean   //  if credential setting was successful
* _error_?:   // optional block which contains message
    *  message: string;


### **Retrieving Service Public Key webhook**

This functionality by the third-party to ProofSpace server via URL:

&lt;container-root>/service/:serviceDid/public-info/public-key/name


<!-- Footnotes themselves at the bottom. -->
## Notes

[^1]:

     A “service” is an instance of the ProofSpace Dashboard. ProofSpace charges a subscription fee per service and all interactions for a service will be created and monitored in the Dashboard for that service.
