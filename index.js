
var EventUtil={
	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	},
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=null;
		}
	},
	getEvent:function(event){
		return event? event:window.event;
	},
	getTarget:function(event){
		return event.target || event.srcElement;
	},
	preventDefault:function(){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	},
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	},
	getRElatedTarget:function(event){
		if(event.relatedTarget){
			return event.relatedTarget;
		}else if(event.toElement){
			return event.toElement;
		}else if(event.formElement){
			return event.formElement;
		}else{
			return null;
		}
	},
	getButton:function(event){
		if(document.implementation.hasFeature("MouseEvents","2.0")){
			return event.button;
		}else{
			switch(event.button){
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;

			}
		}
	},
	getWheelDelta:function(event){
		if(event.wheelDelta){
			return (client.engine.opera && client.engine.opera < 9.5? -event.wheelDelta : event.wheelDelta );
		}else{
			return -event.detail*40;
		}
	},
	getCharCode:function(event){
		if(typeof event.charCode == "number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	},
	isSupported:function(element,pElement){
		return ("on"+element) in pElement;
	},
	selectText:function(textbox,startIndex,stopIndex){
		if(textbox.setSelectionRange){
			textbox.setSelectionRange(startIndex,stopIndex);
		}else if(textbox.createTextRange){
			var range=textbox.createTextRange();
			range.collapse(true);
			range.moveStart("character",startIndex);
			range.moveEnd("character",stopIndex-startIndex);
			range.select();
		}
		textbox.select();
	},
	justNumberIn:function(element,type){
		EventUtil.addHandler(element,type,function(event){
			event=EventUtil.getEvent(event);
			var target=EventUtil.getTarget(event);
			var charCode=EventUtil.getCharCode(event);
			var pattern=/\d/;
			if(!pattern.test( String.fromCharCode(charCode) ) && charCode>9 && !event.ctrlKey) {
				EventUtil.preventDefault(event);
				console.log("请输入数字")
			}
		});
	},
	getClipboardText:function(event){
		var clipboardData=(event.clipboardData || window.clipboardData );
		return clipboardData.getData("text");
	},
	setClipboardText:function(event,value){
		if(event.clipboardData){
			return event.clipboardData.setData("text/plain",value);
		}else if(window.clipboardData){
			return window.clipboardData.setData("text",value);
		}
	},
	serialize:function(form){
		var parts=[],field=null,i,len,j,optLen,option,optValue;
		for(var i=0,len=form.elements.length;i<len;i++){
			field=form.elements[i];
			switch(field.type){
				case "select-one":
				case "select-multiple":
					if(field.name.length){
						for(j=0,optLen=field.options.length; j<optLen; j++){
							option =field.options[j];
							if(option.selected){
								optValue="";
								if(option.hasAttribute){
									optValue=(option.hasAttribute("value")? option.value: option.text);
								}else{
									optValue=(option.attributes["value"].specified? option.value : option.text);
								}
								parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue) );
							}
						}
					}
					break;
				case undefined:
				case "field":
				case "submit":
				case "reset":
				case "button":
					break;
				case "radio":
				case "checkbox":
					if(!field.checked){
						break;
					}
				default:
					if(field.name.length){
						parts.push(encodeURIComponent(field.name) + "=" +encodeURIComponent(field.value) );
					}
			}
		}
		return parts.join("&");
	}

}
