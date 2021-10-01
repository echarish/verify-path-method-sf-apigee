var proxy_name = context.getVariable("apiproxy.name");
var called_path = context.getVariable("proxy.pathsuffix");
var called_method = context.getVariable("request.verb");

var product_proxy_allowed_methods = context.getVariable("verifyapikey.VAK-VerifyKey.apiproduct."+proxy_name+"_AllowedMethods");
var product_proxy_allowed_paths = context.getVariable("verifyapikey.VAK-VerifyKey.apiproduct."+proxy_name+"_AllowedPaths");


function setFault(status, phrase, code, message, url) {
  context.setVariable("custom.error.code", code);
  context.setVariable("custom.error.message", message);
  context.setVariable(
    "custom.error.url",
    url ? url : "https://developers.example.com"
  );
  context.setVariable("custom.error.status", status);
  context.setVariable("custom.error.phrase", phrase);
}

if(called_path != null){
    
    if(product_proxy_allowed_methods != null){
    var allowed_methods = product_proxy_allowed_methods.split(",");
    var is_method_allowed = false;
    allowed_methods.forEach(function(allowed_method,index){
        if(!is_method_allowed){
            if(allowed_method == called_method){
                is_method_allowed = true;
                context.setVariable("custom.method.allowed", "true");
            }else{
                context.setVariable("custom.method.allowed", "false");
                setFault(
                  405,
                  "Method not allowed",
                  "403.99",
                  "Method not allowed"
                );
            }
        }
        
    });
}


if(product_proxy_allowed_paths != null){
    var allowed_paths = product_proxy_allowed_paths.split(",");
    var is_path_allowed = false;
    allowed_paths.forEach(function(allowed_path,index){
        if(!is_path_allowed){
             if(called_path.match(allowed_path)){
                is_path_allowed=true;
                context.setVariable("custom.path.allowed", "true");
            }else{
                context.setVariable("custom.path.allowed", "false");
                setFault(
                  403,
                  "Forbidden",
                  "403.99",
                  "Forbidden"
                );
            }
        }
       
    });
}
}
