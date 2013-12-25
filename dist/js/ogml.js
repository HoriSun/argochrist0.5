"use strict";

//V3.01.A - http://www.openjs.com/scripts/jx/
var jx = {
	//Create a xmlHttpRequest object - this is the constructor. 
	getHTTPObject : function() {
		var http = false;
		//Use IE's ActiveX items to load the file.
		if(typeof ActiveXObject != 'undefined') { //[@HORISUN](?) ActiveXObject for IE 5 or 6 ?
			try {http = new ActiveXObject("Msxml2.XMLHTTP");}     //[@HORISUN] To use ajax, it's different in IE 5/6
			catch (e) {
				try {http = new ActiveXObject("Microsoft.XMLHTTP");}  
				catch (E) {http = false;}
			}
		//If ActiveX is not available, use the XMLHttpRequest of Firefox/Mozilla etc. to load the document.
		} else if (window.XMLHttpRequest) {
			try {http = new XMLHttpRequest();}   //[@HORISUN] IE 7+ and most main browsers uses XMLHttpRequest.
			catch (e) {http = false;}
		}
		return http;
	},
	// This function is called from the user's script. 
	//Arguments - 
	//	url	- The url of the serverside script that is to be called. Append all the arguments to 
	//			this url - eg. 'get_data.php?id=5&car=benz'
	//	callback - Function that must be called once the data is ready.
	//	format - The return type for this function. Could be 'xml','json' or 'text'. If it is json, 
	//			the string will be 'eval'ed before returning it. Default:'text'
	load : function (url,callback,format) {
		var http = this.init(); //The XMLHttpRequest object is recreated at every call - to defeat Cache problem in IE
								//[@HORISUN]Get rid of the caches which stop files refreshing in the browser
		if(!http||!url) return;
		if (http.overrideMimeType) http.overrideMimeType('text/xml');

		if(!format) var format = "text";//Default return type is 'text'
		format = format.toLowerCase();
		
		//Kill the Cache problem in IE.   //[@HORISUN] Append the current time (to the url) as the ID to get rid of caches.
		var now = "uid=" + new Date().getTime();
		url += (url.indexOf("?")+1) ? "&" : "?"; 
		url += now;

		http.open("GET", url, true);
		
		//[@HORISUN] readyState changes between 0 to 4, each change trigger the function 
		http.onreadystatechange = function () {//Call a function when the state changes.
			if (http.readyState == 4) {//Ready State will be 4 when the document is loaded.
				if(http.status == 200) {
					var result = "";
					if(http.responseText) result = http.responseText;
					
					//If the return is in JSON format, eval the result before returning it.
					if(format.charAt(0) == "j") {
						//\n's in JSON string, when evaluated will create errors in IE
						result = result.replace(/[\n\r]/g,"");
						result = eval('('+result+')'); 
					}
	
					//Give the data to the callback function.
					if(callback) callback(result);
				} else { //An error occured
					if(error) error(http.status);
				}
			}
		}
		http.send(null);
	},
	init : function() {return this.getHTTPObject();}
}

var Base64 = {
 
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },
 
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0, c1, c2, c3;
        var c = c1 = c2 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    } 
}

var keepdata = 'Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Owo7OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7Cjs7ICAgIHpybyBcIFlvdSBoYWNrIHRoaXMgZmlsZSBzdWNjZXNzIC8gb3J6ICAgICAgOzsKOzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7Owo7Oy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLTs7Cjs7IFRoaXMgaXMganVzdCB0aGUgc291cmNlIGRhdGEgb2YgdGhlIE9nTUwgZ2FtZS4gOzsKOzsgSXQganVzdCBzaW1wbGUgYmFzZTY0IGVuY29kZS4gV2Ugbm90aWNlIHRoYXQgICA7Owo7OyBpdCBpcyB1bnNhZmUgZm9yIGV4cG9zZSB0aGUgc291cmNlIGRhdGEuIEJ1dCAgIDs7Cjs7IFdlIGNhbm5vdCBmaW5kIGFueSBzb2x1dGlvbiBmb3IgdHJhbnNmZXIgdGhlICAgOzsKOzsgYnJvd3Nlci1oYW5kbGVhYmxlIGdhbWUgZGF0YSBhbmQga2VlcCB0aGUgICAgICA7Owo7OyBzb3VyY2UgY29kZSBvcGVuLiBJZiB5b3UgaGF2ZSBzb21lIGlkZWEsIGZlZWwgIDs7Cjs7IGZyZWUgdG8gY29udGFjdCB1cy4gSG93ZXZlciwgeW91IHNob3VsZCBub3QgICAgOzsKOzsgcmVhZCB0aGlzIHNvdXJjZSB0ZXh0IGRhdGEuICAgICAgICAgICAgICAgICAgICA7Owo7OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDs7Cjs7IENoZWF0IGlzIG5vIGZ1bi4gSGFja2VycyBrbm93LiA6LSkgICAgICAgICAgICAgOzsKOzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7Owo7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7CgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoK';

function encode_data(data){
	var temp = Base64.encode(data);
	var decoded = Base64.decode(temp);
    return keepdata + temp;
}

function decode_data(data){
	var sliced = data.slice(0,keepdata.length);
    if(sliced != keepdata)
        return false;
    return Base64.decode(data.slice(keepdata.length));
}

function $$(id){
    return document.getElementById(id);
}

function defer(func){ 
    var args = Array.prototype.slice(arguments, 1); // what is `arguments` ?
    return setTimeout(function(){  
        return func.apply(null, args); //
    }, 1);  // Time delay for 0.001 secomds to run the funtion
}

function typename(object){
    return object.constructor.name;
}

/* resource alisa */
var alisa = {};
var imageList = {};

function showOnload(){
	this.style.display = "";
}

/* reset the node display `str` img, or return a new one */
function imgtag(str){
	//alert(str+"[imgtag]"+(str[0])+(typeof(str))); //[@HORISUN]DEBUG
    var d = document.createElement('img');
    if(str == '_'){
        return d;
    }
    if(str[0] == '@'){
		//alert(str+alisa[str]);
        if(str in alisa){
            str = alisa[str];
			
        }else
            throw 'No such alias [' + str + '].';
    }
    d.src = str;
	d.style.display = "none";
	d.onload = showOnload.call(d);
    return d;
}

function istype(object, metatype){
    return object.constructor.prototype == metatype.prototype;
}

function OgMLException(msg){
    this._msg = msg;
}

OgMLException.prototype.toString = function(){
    return 'OgMLException: ' + this._msg;
}

function OgMLCompileError(msg, code, lineno, data){
    this._msg = msg;
    this._code = code;
    this._lineno = lineno;
    this._data = data;
}

OgMLCompileError.prototype = new OgMLException;

function OgMLRuntimeError(msg, code, runner){
    this._msg = msg;
    this._code = code;
    this._runner = runner;
}
OgMLRuntimeError.prototype = OgMLException;
    

function lex(rules, context, text){
    var nowlength, rule, rules, i, mat;
    while(text.length){
        nowlength = text.length;
        for(i=0; i<rules.length; ++i){
            rule = rules[i];
            mat = text.match(rule[0]);
            if(mat && mat.index == 0){
                rule[1](mat, context);
                text = text.substr(mat[0].length);
                break;
            }
        }
        if(text.length == nowlength){
            throw new OgMLCompileError(
                'Unhandleable pattern.', 1, undefined,
                '[' + text.concat('...').slice(20) + ']');
        }
    }
}

function split_token(text){
    var ret = [], text = text.split(' '), i, r;
    for(i=0; i<text.length; ++i)
        if(text[i] && (r = text[i].trim()))
            ret.push(r);
    return ret;
}

function split_array(arr, sep){
    var ret = [], buf=[], i;
    for(i=0; i<arr.length; ++i){
        if(arr[i] == sep){
            ret.push(buf);
            buf = [];
        } buf.push(arr[i]);
    }
    if(buf.length) ret.push(buf);
    return ret;
}

function expr_parse(arr){
    var stack = [], top = [], i;
    stack.push(top);
    for(i=0; i<arr.length; ++i){
        if(arr[i] == '('){
            top = [];
            stack[stack.length-1].push(top);
            stack.push(top);
        }else if(arr[i] == ')'){
            stack.pop();
            top = stack[stack.length-1];
        }else top.push(arr[i]);
    }
    if(!stack.length == 1) return false;
    if(!stack[0].length == 1) return false;
    return stack[0][0];
}

function eval_expr(arr, expr_scope){
    var f, args, i, ret = [];
    for(i=1; i<arr.length; ++i){
        if(arr[i].constructor.name == "Array")
            ret.push(eval_expr(arr[i]));
        else ret.push(arr[i]);
    }
    return expr_scope[arr[0]].apply(null, ret);
}

var SYMBOL_A = "A"
, SYMBOL_S = "S"
, SYMBOL_C = "C"
, SYMBOL_E = "E"
, EMPTY = '_';



/* @c : context object
 * - ret : compile return value
 * - ret.ins : instruction
 * - ret.lbs : label
 * - _lineno : line number
 * - action_parser : action use parser
 * - i18n_symbol : i18n use symbol
 */
var ogml_rules = [  // parsing with these rules will be finished before UI shows 
    [/;;.*\n/, function(m, c){ //comments  // m is the matched rule, c is context 
        c._lineno += 1;
    }],
    [/(@.+)=>(.*)\n/, function(m, c){ // @ alias
        if(m[1][0] == ' '){
            throw new OgMLCompileError(
                'Alias cannot start with space.', 4, c._lineno,
                '['+m[1]+']');
        }
        c._lineno += 1; 
        alisa[m[1].replace(/-ava\d*\s/,"").trim()] = m[2].trim(); //alisa['@...']=...
		try{
			var tmp = m[1].trim().match(/-ava(\d*)/);
			if(tmp)
				if(tmp.length==2)
					for(var i=0;i<parseInt(tmp[1]);i++){
						new Image().src = m[2].trim()+"_"+i+".png";
						imageList[m[1].replace(/-ava\d*\s/,"").trim()+"_"+i] = new Image().src = m[2].trim()+"_"+i+".png";
					}
				else
					new Image().src = m[2].trim();
		}
		catch(e){console.log(e.toString());}
    }],
    [/\$(.+)=>(.*)\n/, function(m, c){ // $ for action alias
        if(m[1][0] == ' '){
            throw new OgMLCompileError(
                'Alias cannot start with space.', 4, c._lineno,
                '['+m[1]+']');
        }
        if(m[1][0] == '@'){
            throw new OgMLCompileError(
                'Action alias cannot start with `@`.', 4, c._lineno,
                '['+m[1]+']');
        }            
        c._lineno += 1;
        alisa[m[1].trim()] = m[2].trim();
    }],
    [/#(.*)\n/, function(m, c){  // labels
        c._lineno += 1;
        c.ret.lbs[m[1].trim()] = c.ret.ins.length;
        c.ret.ins.push([SYMBOL_S, m[1].trim()]);
    }],
    [/!!(.*)\{\n(([^\}]*\n)*)\}\n/, function(m, c){  // !! ... { ... }
        var aname = m[1].trim(), args, aname1;
        c._lineno += m[0].match(/\n/g).length;
        if(aname in alisa){
            aname1 = alisa[aname];
        }else aname1 = aname;
        if(!(aname1 in c.action_parser)){
            throw new OgMLCompileError(
                'No such action.', 3, c._lineno,
                '[' + aname + ']');
        }
        try{
            args = c.action_parser[aname1](m[2], c);
        }catch(e){
            if(e instanceof OgMLCompileError){
                e._lineno = c._lineno;
            }
            throw e;
        }
        c.ret.ins.push([SYMBOL_A, aname, args]);
    }],
    [/!!([^\ \n]+)(.*)?\n/, function(m, c){   // !! ... ?
        var aname = m[1].trim(), args, aname1;
        c._lineno += 1;
        if(aname in alisa){
            aname1 = alisa[aname];
        }else aname1 = aname;
        if(!(aname1 in c.action_parser)){
            throw new OgMLCompileError(
                'No such action.', 2, c._lineno,
                '[' + aname1 + ']');
        }
        try{
            args = c.action_parser[aname1](m[2], c);
        }catch(e){
            if(e instanceof OgMLCompileError){
                e._lineno = c._lineno;
            }
            throw e;
        }
        c.ret.ins.push([SYMBOL_A, aname, args]);
    }],
	[/(.*)-(\d)\s*:\s*\{\n(([^\}]*\n)*)\}\n/, function(m, c){  // ... : ... {... } say in multiline
	c._lineno += m[0].match(/\n/g).length;
	try{
		c.ret.ins.push([SYMBOL_C, m[1].trim(), m[3].trimLeft(),m[2]]);
	}
	catch(e){
		c.ret.ins.push([SYMBOL_C, m[1].trim(), m[3].replace(/^\s\s*/, ''),m[2]]);
	}
    }],
    [/(.*):\s*\{\n(([^\}]*\n)*)\}\n/, function(m, c){  // ... : ... {... } say in multiline
        c._lineno += m[0].match(/\n/g).length;
		try{
			c.ret.ins.push([SYMBOL_C, m[1].trim(), m[2].trimLeft(),0]);
		}
		catch(e){
			c.ret.ins.push([SYMBOL_C, m[1].trim(), m[2].replace(/^\s\s*/, ''),0]);
		}
    }],
	[/(.*)-(\d)\s*:(.*)\n/, function(m, c){   // ... : ...  say in a line
	c._lineno += 1;
	try{
		c.ret.ins.push([SYMBOL_C, m[1].trim(), m[3].trimLeft(),m[2]]);
	}
	catch(e){
		c.ret.ins.push([SYMBOL_C, m[1].trim(), m[3].replace(/^\s\s*/, ''),m[2]]);
	}
    }],
    [/(.*):(.*)\n/, function(m, c){   // ... : ...  say in a line
        c._lineno += 1;
		try{
			c.ret.ins.push([SYMBOL_C, m[1].trim(), m[2].trimLeft(),0]);
		}
		catch(e){
			c.ret.ins.push([SYMBOL_C, m[1].trim(), m[2].replace(/^\s\s*/, ''),0]);
		}
    }],

    [/.*{/, function(m, c){   
        throw new OgMLCompileError(
            'Unnkown command.',
            4, c._lineno, 'Unmatch "{" [' + m[0] + ']');
    }],
    [/\n/, function(m, c){   // kill empty lines
        c._lineno += 1;
        c.ret.ins.push([SYMBOL_E]);
    }],
    [/(.*)：(.*)\n/, function(m, c){
        throw new OgMLCompileError(
            'Unknow command.', 4, c._lineno, "Don't use Chinese comma.");
    }],
    [/[\w\W]*/, function(m, c){  
        throw new OgMLCompileError(
            'Unknow command.', 4, c._lineno, '[' + m[0] +']');
    }]        
];

var ogml_action_parse = {
    '!' : function(text){
        var group = split_token(text);
        var args = {}, i;
        for(i=0; i<group.length; ++i){
            switch(group[i]){
                case ':BG' : args.BG = group[++i]; break;
                case ':FG' : args.FG = group[++i]; break;
                case ':CA' : args.CA = group[++i].split('+'); break;
                case ':AN' : args.AN = group[++i].split('+'); break;
                default:
                throw new OgMLCompileError(
                    'Wrong action arguments format.', 5, undefined,
                    'Unknow keyword "' + group[i] + '"');
            }
        }
        return args;
    },
    '?' : function(text){
        var args = { text: false, ops: []}, i, buf=[];
        var group = text.split('\n');
        group.pop();
        for(i=0; i<group.length; ++i){
            if(group[i][0] == '>'){
                buf.push(group[i].slice(1).trim());
            }else break;
        }
        args.text = buf.join('\n');
        for(; i<group.length; ++i){
            group[i] = split_token(group[i]);
            if((group[i][1] != '=>') || (group[i].length != 3)){
                throw new OgMLCompileError(
                    'Wrong action arguments format.', 5, undefined,
                    'Every branch should be like "Text" => label')
            }
            if(group[i][2][0] == '#'){
                group[i][2] = group[i][2].slice(1);
            }
            args.ops.push([group[i][0], group[i][2]]);
        }
        return args;
    },
    '>>' : function(text){
		console.log('>>'+text);
        var group = split_token(text), args = true;
        if(group.length > 1){
            if(!(args = expr_parse(group.slice(1)))){
                throw new OgMLCompileError(
                    'Wrong action arguments format.', 5, undefined,
                    'Wrong expression format.');
            }
        }
        return [group[0], args];
    },
    'audio' : function(text){
        var group = split_token(text), args = {}, i;
        for(i=0; i<group.length; ++i){
			console.log(group[i]);
            switch(group[i]){
                case ':LOOP' : args.loop = true; break;
                case ':PLAY' : args.play = true; break;
                case ':STOP' : args.stop = true; break;
                case ':PAUSE' : args.pause = true; break;
                case ':SRC' : args.src = group[++i]; break;
                case ':SE' : args.se = group[++i]; break;
                default:
                throw new OgMLCompileError(
                    'Wrong action arguments format', 5, undefined,
                    'Unknown keyword. [' + group[i] + ']');
            }
        }
        return args;
    }
}

function add_action_parse(name, handler){  //[@HORISUN] Seem to be left for future development
    ogml_action_parse[name] = handler;
}

function compile_ogml(text){
    var context = {
        ret : {  // return parsed instructions and labels
            ins : [],
            lbs : {}
        },
        _lineno : 0,   // line number for current line
        action_parser : ogml_action_parse,
        i18n_symbol : {} // may be change
    };
    lex(ogml_rules, context, text);
    return context.ret;
}    

var ogml_action_hander = {
    '!' : function(args, runner, callback){
        runner._view.set_page(args, function(){
            if(args.BG) runner._status._BG = args.BG;
            if(args.FG) runner._status._FG = args.FG;
            if(args.CA) runner._status._CA = args.CA;
            ++runner._status._PC;
            callback();
        },runner);
    },
    '?' : function(args, runner, callback){
        runner._view.select(args, function(label, index){
            if(!(label in runner._code.lbs)){
                throw new OgMLRuntimeError(
                    'No such label. [' + label +']', 1002, runner);
            }
            runner._status._PC = runner._code.lbs[label];
            callback();
        });
    },
    '>>' : function(args, runner, callback){
        var label = args[0];
        if((args[1] !== true) && 
           !eval_expr(args[1], runner._expr_ns)){
            callback();
            return;
        }
        if(!(label in runner._code.lbs)){
            throw new OgMLRuntimeError(
                'No such label. [' + label +']', 1002, runner);
        }
        runner._status._PC = runner._code.lbs[label];
        callback();
    },
    'audio' : function(args, runner, callback){
        ++runner._status._PC;
        runner._view.audio(args, callback)
    }
};



var home_option = [
	['home-start',function(){
		console.log('start');
		$$('home').style.display ="none";
		window.r._view.unlock();
		window.r._status._PC = 0;
		window.r._lock = false;
		window.r._view.homepage_on = false;
		window.r._view.lock_talk = false;
		window.r.step_one();
	},'../resources/home-start-over.png'],
	['home-continue',function(){
		console.log('continue');
		$$('home').style.display ="none";
		window.r._view.unlock();
		window.r._status._PC--;
		window.r._view.homepage_on = false;
		window.r._view.lock_talk = false;
		if(window.r._status._PC<0){
			window.r._status._PC = 0;
		}
		window.r._lock = false;
		window.r.step_one();
	},'../resources/home-continue-over.png'],
	['home-argo',function(){
		console.log('argo');
		window.open('http://argo.sysu.edu.cn');
	},'../resources/home-argo.png'],
];


var homeLoader = function(){
	window.r._status._PC--;
	window.r._view.try_lock();
	window.r._view.homepage_on = true;
	window.r._view.lock_talk = true;
	try{
		if(!$$('home-bg')){
			var home_bg = imgtag('@home-bg');
			home_bg.id="home-bg";
			$$('home').appendChild(home_bg);
		}
		else{
			$$('home-bg').src = alisa['@home-bg'];
		}
		var home_child;
		if(!$$('home-start')){
			for(var i=0;i<home_option.length;i++){
				home_child = document.createElement('div');
				$$('home').appendChild(home_child);		
				$$('home').children[i+2].id = home_option[i][0];
				$$('home').children[i+2].addEventListener('click',home_option[i][1]);
				$$('home').children[i+2].style.backgroundImage = home_option[i][2];
			}
		}
	}
	catch(e){console.log(e);}
	console.log("homeLoader");
	$$('home').setAttribute("style","");
	//window.r._view._bind_click(null);
}


function OgMLRunner(text, view){
    var self = this;
    this._text = text;
    this._view = view;
    this._code = false;
    this._status = false;
    this._expr_ns = {};        
}
OgMLRunner.prototype._action_hander = ogml_action_hander;
OgMLRunner.prototype.compile = function(){
    return this._code = compile_ogml(this._text);
}
OgMLRunner.prototype.init = function(){
    this._view.init();
    this._status = {
        _BG : false,
        _FG : false,
        _CA : false,
        _PC : false,
        _BGM : false,
    };
}
OgMLRunner.prototype.restart = function(){
    var self = this;
    self._status._PC = 0;
    self._view.set_page({
        BG: '_',
        FG: '_',
        CA: '_'
    }, function(){
        self._view.talk('_', '_', function(){
            self.step_one();
        });
    },self);
}        
        
OgMLRunner.prototype.restore_status = function(status){
	var temp = this._status;
	//temp._PC;
	//console.log(decode_data(status));
	this._status = JSON.parse(decode_data(status));
	if(!(this._status))this._status = temp;
}
OgMLRunner.prototype.dump_status = function(){
	return encode_data(JSON.stringify(this._status));
}

OgMLRunner.prototype.step_one = function(){
    var self = this;
    if(self._lock)
        throw 'Locking';
    self._lock = true;
    if(self._status._PC < self._code.ins.length){
        var ins = self._code.ins[self._status._PC], aname;
        switch(ins[0]){
            case SYMBOL_S:
            ++self._status._PC; self.ins_done();break;
            case SYMBOL_E:
            ++self._status._PC; self.ins_done(); break;
            case SYMBOL_A:
            aname = ins[1];
            if(aname in alisa){
                aname = alisa[aname];
            }
            self._action_hander[aname](ins[2], self,
                                       function(){self.ins_done();});
            break;
            case SYMBOL_C:
			if(ins.length==4){
				//console.log(ins);
				self._view.talk(ins[1], ins[2],
								function(){ ++self._status._PC;
											self.ins_done(); },ins[3]);
			}
			else
				self._view.talk(ins[1], ins[2],
								function(){ ++self._status._PC;
											self.ins_done(); });
            break;
            default:
            throw new OgMLRuntimeError(
                'Unknown instructions.', 1001, self);
        }
    }
	// must initialize the following properties here;
	//$$('select-outer').style.display = "none";
}

OgMLRunner.prototype.ins_done = function(){
    var self = this;
    defer(function(){
        self._lock = false;
        self.step_one();
    });
}

function OgMLView(op){
    if(!op) op = {};
    if(op.container){
        this._container = istype(op.container, String)?
            $$(op.container):op.container;
    }else this._container = $$('container');
}

OgMLView.prototype.init = function(){
    var self = this;
    this._container.innerHTML = '<div id="wrapper"><div id="bg"><div id="bg-img"></div></div><div id="ca"><div id="ca-img"></div></div><div id="fg"><div id="fg-img"></div></div><div id="ctrl"><div id="talker"></div><div id="avatar"><div id="avatar-inner"><img id="ava-img"></div><div id="nametag"><img id="name-img" width="280px" height="160px"></div></div><div id="words"></div><div id="select-outer"><div id="select"></div></div><div id="ctrl-bar"></div></div><div id="home" style=""><img id="home-bg"><div id="home-title"></div></div><div id="system"></div><div id="hidden"><audio id="bgm" loop="loop" autoplay="autoplay"><source></audio></div>';

	this._lock = false;
    this._talk_callback = false;
    this._container.addEventListener('click', function(event){
        self._handle_click(event);
    },false);
    this._click_bind = false;
	this.homepage_on = true;
	this.lock_talk = false;
}

OgMLView.prototype.try_lock = function(){
    if(this._lock)
        return false;
    return this._lock = true;
}

OgMLView.prototype.unlock = function(){
    if(this._lock){
        this._lock = false;
        return true;
    }
    return false;
}

OgMLView.prototype._handle_click = function(event){
    if(this._click_bind) this._click_bind(event);  
}

OgMLView.prototype._bind_click = function(handler){
    this._click_bind = handler; 
}


OgMLView.prototype.set_page = function(args, callback){
	var self=this;
	//$$('home').style.display = "none";
    if(!this.try_lock()) return; // lock on to occupy 
	//[@HORISUN][updated] control bar in dialogue box
	// must initialize the following properties here;
	$$('select-outer').style.display = "none";
	$$("ctrl-bar").innerHTML = '';  	
	for(var i=0; i<ctrl_option.length; i++){	
		if(i) $$("ctrl-bar").innerHTML += "|";
		var ctrl_btn = document.createElement("div");
		//ctrl_btn.setAttribute("class","ctrl-button");
		ctrl_btn.setAttribute("id",ctrl_option[i][0]);
		$$("ctrl-bar").appendChild(ctrl_btn);
		$$(ctrl_option[i][0]).innerHTML = ctrl_option[i][0];
	}
	var tmpfun;
	for(var i=0; i<ctrl_option.length; i++){
		tmpfun = new Function(ctrl_option[i][2]);
		$$("ctrl-bar").children[i].addEventListener('click',tmpfun,true);
	}
	
    if(args.BG){   //  onload background
		var bg_img = imgtag(args.BG);
		bg_img.id = "bg-imgtag";
		bg_img.alias = args.BG;
        $$('bg-img').innerHTML = '';
		if(bg_img.src)  //[@HORISUN] in case imgtag(str) returns an empty image tag
			$$('bg-img').appendChild(bg_img);
    }
    if(args.CA){   // onload a people here
		var ca_img;
        var ncad = document.createElement('div');
        ncad.id = 'ca-box';
		//alert(typeof(args.CA)+args.CA+"[set_page]"); //[@HORISUN]DEBUG
		if(typeof(args.CA)=="string"){
	
			ca_img = imgtag(args.CA);
			if(ca_img.src)
				ncad.appendChild(ca_img);
		}
		else{
			//alert(args.CA[0]+typeof(args.CA[0])); //[@HORISUN]DEBUG
			for(var i=0; i<args.CA.length; ++i){
				ca_img = imgtag(args.CA[i]);
				//alert(ca_img.toString());
				if(ca_img.src)
					ncad.appendChild(ca_img);
			}
		}
        $$('ca-img').innerHTML = '';
        $$('ca-img').appendChild(ncad);
    }    //  onload foreground
    if(args.FG){
		var fg_img;
        $$('fg-img').innerHTML = '';
		fg_img = imgtag(args.FG);
        if(fg_img.src)
			$$('fg-img').appendChild(fg_img);
    }
    this.unlock(); // release the lock
    callback(args);
	$$('avatar').style.display="none";
	$$('talker').style.display="none";
	//$$('home').style.display="none";
};



OgMLView.prototype.talk = function(talker, words, callback,ava_num){
	var holdAvatar = talker.match(/~/);
	talker = talker.replace(/~/,'');
	if(this.homepage_on){
		homeLoader();
	}
	if(ava_num != ava_num) // when ava_num == NaN
		ava_num = 0;

    if(!callback){ 
        throw 'No supply callback function.';
        return;
        throw new OgMLRuntimeError(
            'No supply callback function. Wrong args format.',
            1003, 0);
    }
    var cid = null, word, inner, ava_loc = "", name_loc = ""; // ava_loc:location of avatar image
    if(!this.try_lock()) return;
    this._talk_callback = callback;
    var d = $$('words');
	
	if(('@'+talker) in alisa)
		ava_loc = alisa['@'+talker];
	if(window.r._status._BG)
		try{
			if($$('bg-imgtag').alias!=window.r._status._BG){
				$$('bg-imgtag').src=imgtag(window.r._status._BG).src;
				$$('bg-imgtag').alias=window.r._status._BG;
			}
		}
		catch(e){}
	if(('@'+talker) in alisa);
    if(talker == '_' || talker == ''){     // no talker 
		$$('avatar').style.display="none";
		$$('talker').style.display="none";
        $$('talker').innerHTML = '';
		if(talker == '_'){
			this.unlock();
			callback();
			return;
		}
    }
	else 
	{
		$$('avatar').style.display="";
		$$('talker').style.display="";
	}
	if(('@'+talker+'-name') in alisa){
		name_loc = alisa['@'+talker+'-name'];
		$$('talker').style.display = "none";
	}

	if(ava_loc){
		$$('name-img').setAttribute("src",name_loc); // set name image location
		if(!holdAvatar)
			$$('ava-img').setAttribute("src",ava_loc+"_"+Number(ava_num).toString()+".png"); // set avatar image location
			$$('avatar').style.display="";
	}
	else
		$$('avatar').style.display="none";
    $$('talker').innerHTML = talker; 

    words = words.split('');
    cid = true;
    d.innerHTML = '';
	var words_save = words;
    inner = function(){
        var next;
        if(words.length){
            next = words.shift();
            if(next == '\n'){
                next = '<br/>';
            }         
            d.innerHTML += next;
        }else{
            clearTimeout(cid);
            cid = null;
        }
    }
    cid = setInterval(inner, 50);
    this._bind_click(function(event){
		if(this.homepage_on || this.lock_talk)return;
        if(cid == null){
            this.unlock();
            this._bind_click(null);
            callback();
        }else{	
            d.innerHTML += words.join('').replace(/\n/g,'<br/>');
            clearTimeout(cid);
            cid = null;
        }
    });
}



OgMLView.prototype.audio = function(args, callback){
    var c;
    if(args.se){
        c = document.createElement('audio');
        if(args.se[0] == '@'){
            args.se = alisa[args.se];
        }
        c.innerHTML = '<source src="' + args.se + '">';
        c.addEventListener('ended', function(){
			c.parentNode.removeChild(c);
        });
        $$('hidden').appendChild(c);
        c.play();
        callback();
        return;
    }
    c = $$('bgm');
    if(args.src){
        if(args.src){
            c.src = '';
            if(args.src[0] == '@'){
                args.src = alisa[args.src];
            }
            c.src = args.src;
        }
		
		c.innerHTML = '<source src="' + args.src + '">';
		c.autoplay = true;
        c.play();
		c.loop = true;
        //console.log(c);
	    //setTimeout(function(){window.r._view.audio(args,function(){})},c.duration*100000);
        callback();
        return;
    }
    c = $$('bgm');
    if(args.stop){
        c.pause();
        c.currentTime = 0;
    }
    if(args.pause){
        c.pause();
    }
    if(args.loop){
        c.loop = true;
    }
    if(args.play){
        c.play();
    }
    callback();
}

  
function setCookie(arg,value){
	var rec = document.cookie, head = 0, tail = 0;
	if(rec.length>0){
		head = rec.indexOf(arg);
		if(head!=-1){
			rec = rec.slice(head);
			tail = rec.indexOf(';');
		}
	}	
	rec = document.cookie;
	document.cookie = arg + "=" + value + ";";
	
	//var date=new Date(); 
	//将date设置为过去的时间 
	//date.setTime(date.getTime()-100000); 
	//将userId这个cookie删除 

	//document.cookie="expire="+date.toGMTString(); 
	//console.log(document.cookie);
}

function getCookie(arg){
	var rec, head, tail, value;
	 rec = document.cookie;
	if(rec.length>0){
		head = rec.indexOf(arg);
		if(head!=-1){
			rec = rec.slice(head);
			if(rec.indexOf(";")+1)
				value = rec.slice(arg.length + 1,rec.indexOf(";"));
			else 
				value = rec.slice(arg.length + 1,rec.length);
			return value;
		}
	}
	return "";
}


//[@HORISUN]
var ctrl_option = [  // Asynchronous control ,for each element, [0]name [1]function [2]click_binding function string
	["save",function save(rec){
		if(rec >= 9)
			return false;
		if(getCookie("rec0")==""){
			for(var i=0;i<9;i++)
				setCookie("rec"+i,"0");
		}
		window.r._status._PC--;	
		setCookie("rec"+rec,window.r.dump_status());
		console.log("Saved as record " + rec);
		return true;
	},("return saveLoadGame(ctrl_option["+0+"]["+0+"])")],
	["load",function load(rec){
		if(rec >= 9 || getCookie("rec0")=="")
			return false;
		window.r.restore_status(getCookie("rec"+rec));
		if(window.r._status._BG)
		try{
			if($$('bg-imgtag').alias!=window.r._status._BG){
				$$('bg-imgtag').src=imgtag(window.r._status._BG).src;
				$$('bg-imgtag').alias=window.r._status._BG;
			}
		}
		catch(e){}
		window.r._status._PC--;
		console.log("Loaded record "+rec);
		return true;
	},("return saveLoadGame(ctrl_option["+1+"]["+0+"])")],
	["menu",function menu(){
		window.r._status._PC--;
		return homeLoader;
	},("return homeLoader()")],
	["help",function help(){
		window.r._view.lock_talk = true;
		var args={};
		args.text = "   小伙伴们，欢迎你们来到argo的世界。下面是这个世界的温馨提示，要好好记住哦～ =___,=\n\
    1，如果你顺利通过重重难关，达到游戏的最后，那么我们将为你提供很多精美礼品哦～（先到先得，送完为止）并且将由可爱的妹子亲手送到你宿舍！那么，如何领取奖品呢？XD等你玩到游戏的最后自然就看到啦！\n\
    2，如果你在游戏中有任何问题，对我们有任何意见，或者遇到了不会的题目，都可以去 http://argo.sysu.edu.cn 寻找答案，或者发帖询问！发帖请发到7区“逸仙时空圣诞嘉联华”版！\n\
    3，如果游戏图片一时未加载出来，请耐心等一下哦！下一秒就会出现啦！\n\
";
		window.r._status._PC--;
		args.ops=[["返回", "return"]];
		window.r._view.select(args, function(step, number){
            window.r.ins_done();
			window.r._view.lock_talk = false;
        });
	},("return ctrl_option[3][1]()")],
];	

var saveLoadGame =function(op){
		// var self = this;
		// if(self._lock);
        // else 
			// self._lock = true;
		window.r._view.lock_talk = true;
		var self=this, args={}, time="", step = "", decoded_status;
		var d = new Date();
		time = (d.getYear()+1900) + "/" + (d.getMonth()+1) + "/" + (d.getDate()) + " " + (d.getHours()) + ":" + (d.getMinutes()) + ":" + (d.getSeconds());
		args.text = "进度记录";
		args.ops = new Array(9);
		for(var i=0;i<9;i++){
			step = getCookie("rec"+i);
			decoded_status = JSON.parse(decode_data(step));
			if(decoded_status)
				args.ops[i]=["记录点"+ i + "  Step " + decoded_status['_PC'], decoded_status['_PC']];
			else
				args.ops[i]=["",""];
		}
		args.ops[9]=["返回", decoded_status['_PC']];
        window.r._view.select(args, function(step, number){
			//move to some step or save the game
			if(op=="save")ctrl_option[0][1](number);
			else if(op=="load")ctrl_option[1][1](number);
            window.r.ins_done();
			window.r._view.lock_talk = false;
        });
};  
  
  
OgMLView.prototype.select = function(args, callback){
    //console.log(args);
	var outer = $$('select-outer');
	//outer.id = "select-outer";
    var d = $$('select'), title, ops=args.ops, i, o;
	title = document.createElement('span');
	title.innerHTML = args.text;
	d.innerHTML = '';
	d.appendChild(title);
	
    var lock = false;
    function click(){
        if(lock) return;
        lock = true;
        var lbs = this.getAttribute('data-label');
        var index = this.getAttribute('data-index');
		$$('select-outer').style.display = "none";
        callback(lbs, index);
    }        
    for(i=0; i<ops.length; ++i){
        o = document.createElement('div');
        o.innerHTML = String.fromCharCode(i+'A'.charCodeAt()) + "   " + ops[i][0];
        o.setAttribute('data-label', ops[i][1]);
        o.setAttribute('data-index', i);
        o.addEventListener('click', click,false);
        d.appendChild(o);
    }
	if(ops.length==1){
		d.children[1].style.textAlign = "center";
		d.children[1].style.textIndent = "0px";
		d.children[1].style.setProperty("float","none");
		d.children[1].innerHTML = ops[0][0];
	}
    //console.log(d);
	$$('select-outer').style.display = "";
	if(window.r._status._BG)
		try{
			if($$('bg-imgtag').alias!=window.r._status._BG){
				$$('bg-imgtag').src=imgtag(window.r._status._BG).src;
				$$('bg-imgtag').alias=window.r._status._BG;
			}
		}
		catch(e){
			console.log(e);
		}
	//outer.innerHTML = '';
	//outer.appendChild(d);
	
	// [Prepare Note] if talker is empty, hide the name and avatar 
	//  (1.avatar should be binded with name 2.they display independently)
    // $$('talker').innerHTML = '';	
	// $$('avatar').style.display="none";
    // $$('words').innerHTML = args.text;
};

function main(){
    jx.load('script', function(data){
        data = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        var v = new OgMLView();
        var r = new OgMLRunner(data, v);
        try{
            r.compile();
        }catch(e){
            console.log(e);
            throw e;
        }
        r.init();
        window.r = r;
        r.restart(function(){});
    });
}
