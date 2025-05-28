import {
     JsonObject,
     JsonProperty,
     Any,
   } from 'json2typescript';
   
   @JsonObject('ODataResponse')
   export class ODataResponse {
  
   
     @JsonProperty('message', String, true)
     message: String = undefined as any;
   
     @JsonProperty('code', Number, true)
     code: number = undefined as any;
   
     @JsonProperty('result', Any, true)
     value: any = undefined;
   }
   