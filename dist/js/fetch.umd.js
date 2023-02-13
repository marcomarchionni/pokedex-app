!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.WHATWGFetch={})}(this,function(t){"use strict";var e="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==e&&e,r={searchParams:"URLSearchParams"in e,iterable:"Symbol"in e&&"iterator"in Symbol,blob:"FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in e,arrayBuffer:"ArrayBuffer"in e};if(r.arrayBuffer)var o=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],n=ArrayBuffer.isView||function(t){return t&&o.indexOf(Object.prototype.toString.call(t))>-1};function i(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t)||""===t)throw TypeError('Invalid character in header field name: "'+t+'"');return t.toLowerCase()}function s(t){return"string"!=typeof t&&(t=String(t)),t}function a(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return r.iterable&&(e[Symbol.iterator]=function(){return e}),e}function h(t){this.map={},t instanceof h?t.forEach(function(t,e){this.append(e,t)},this):Array.isArray(t)?t.forEach(function(t){this.append(t[0],t[1])},this):t&&Object.getOwnPropertyNames(t).forEach(function(e){this.append(e,t[e])},this)}function f(t){if(t.bodyUsed)return Promise.reject(TypeError("Already read"));t.bodyUsed=!0}function u(t){return new Promise(function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}})}function c(t){var e=new FileReader,r=u(e);return e.readAsArrayBuffer(t),r}function d(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function y(){return this.bodyUsed=!1,this._initBody=function(t){if(this.bodyUsed=this.bodyUsed,this._bodyInit=t,t){if("string"==typeof t)this._bodyText=t;else if(r.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(r.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(r.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else{var e;r.arrayBuffer&&r.blob&&(e=t)&&DataView.prototype.isPrototypeOf(e)?(this._bodyArrayBuffer=d(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):r.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(t)||n(t))?this._bodyArrayBuffer=d(t):this._bodyText=t=Object.prototype.toString.call(t)}}else this._bodyText="";!this.headers.get("content-type")&&("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},r.blob&&(this.blob=function(){var t=f(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(!this._bodyFormData)return Promise.resolve(new Blob([this._bodyText]));throw Error("could not read FormData body as blob")},this.arrayBuffer=function(){if(!this._bodyArrayBuffer)return this.blob().then(c);var t=f(this);return t||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer))}),this.text=function(){var t,e,r,o=f(this);if(o)return o;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=u(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function t(e){for(var r=new Uint8Array(e),o=Array(r.length),n=0;n<r.length;n++)o[n]=String.fromCharCode(r[n]);return o.join("")}(this._bodyArrayBuffer));if(!this._bodyFormData)return Promise.resolve(this._bodyText);throw Error("could not read FormData body as text")},r.formData&&(this.formData=function(){return this.text().then(b)}),this.json=function(){return this.text().then(JSON.parse)},this}h.prototype.append=function(t,e){t=i(t),e=s(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},h.prototype.delete=function(t){delete this.map[i(t)]},h.prototype.get=function(t){return t=i(t),this.has(t)?this.map[t]:null},h.prototype.has=function(t){return this.map.hasOwnProperty(i(t))},h.prototype.set=function(t,e){this.map[i(t)]=s(e)},h.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},h.prototype.keys=function(){var t=[];return this.forEach(function(e,r){t.push(r)}),a(t)},h.prototype.values=function(){var t=[];return this.forEach(function(e){t.push(e)}),a(t)},h.prototype.entries=function(){var t=[];return this.forEach(function(e,r){t.push([r,e])}),a(t)},r.iterable&&(h.prototype[Symbol.iterator]=h.prototype.entries);var p=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function l(t,e){if(!(this instanceof l))throw TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r,o,n=(e=e||{}).body;if(t instanceof l){if(t.bodyUsed)throw TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new h(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",(e.headers||!this.headers)&&(this.headers=new h(e.headers)),this.method=(o=(r=e.method||this.method||"GET").toUpperCase(),p.indexOf(o)>-1?o:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(n),("GET"===this.method||"HEAD"===this.method)&&("no-store"===e.cache||"no-cache"===e.cache)){var i=/([?&])_=[^&]*/;i.test(this.url)?this.url=this.url.replace(i,"$1_="+new Date().getTime()):this.url+=(/\?/.test(this.url)?"&":"?")+"_="+new Date().getTime()}}function b(t){var e=new FormData;return t.trim().split("&").forEach(function(t){if(t){var r=t.split("="),o=r.shift().replace(/\+/g," "),n=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(o),decodeURIComponent(n))}}),e}function m(t,e){if(!(this instanceof m))throw TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText=void 0===e.statusText?"":""+e.statusText,this.headers=new h(e.headers),this.url=e.url||"",this._initBody(t)}l.prototype.clone=function(){return new l(this,{body:this._bodyInit})},y.call(l.prototype),y.call(m.prototype),m.prototype.clone=function(){return new m(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new h(this.headers),url:this.url})},m.error=function(){var t=new m(null,{status:0,statusText:""});return t.type="error",t};var w=[301,302,303,307,308];m.redirect=function(t,e){if(-1===w.indexOf(e))throw RangeError("Invalid status code");return new m(null,{status:e,headers:{location:t}})},t.DOMException=e.DOMException;try{new t.DOMException}catch(v){t.DOMException=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack},t.DOMException.prototype=Object.create(Error.prototype),t.DOMException.prototype.constructor=t.DOMException}function A(o,n){return new Promise(function(i,a){var f=new l(o,n);if(f.signal&&f.signal.aborted)return a(new t.DOMException("Aborted","AbortError"));var u=new XMLHttpRequest;function c(){u.abort()}u.onload=function(){var t,e,r={status:u.status,statusText:u.statusText,headers:(t=u.getAllResponseHeaders()||"",e=new h,t.replace(/\r?\n[\t ]+/g," ").split("\r").map(function(t){return 0===t.indexOf("\n")?t.substr(1,t.length):t}).forEach(function(t){var r=t.split(":"),o=r.shift().trim();if(o){var n=r.join(":").trim();e.append(o,n)}}),e)};r.url="responseURL"in u?u.responseURL:r.headers.get("X-Request-URL");var o="response"in u?u.response:u.responseText;setTimeout(function(){i(new m(o,r))},0)},u.onerror=function(){setTimeout(function(){a(TypeError("Network request failed"))},0)},u.ontimeout=function(){setTimeout(function(){a(TypeError("Network request failed"))},0)},u.onabort=function(){setTimeout(function(){a(new t.DOMException("Aborted","AbortError"))},0)},u.open(f.method,function t(r){try{return""===r&&e.location.href?e.location.href:r}catch(o){return r}}(f.url),!0),"include"===f.credentials?u.withCredentials=!0:"omit"===f.credentials&&(u.withCredentials=!1),"responseType"in u&&(r.blob?u.responseType="blob":r.arrayBuffer&&f.headers.get("Content-Type")&&-1!==f.headers.get("Content-Type").indexOf("application/octet-stream")&&(u.responseType="arraybuffer")),!n||"object"!=typeof n.headers||n.headers instanceof h?f.headers.forEach(function(t,e){u.setRequestHeader(e,t)}):Object.getOwnPropertyNames(n.headers).forEach(function(t){u.setRequestHeader(t,s(n.headers[t]))}),f.signal&&(f.signal.addEventListener("abort",c),u.onreadystatechange=function(){4===u.readyState&&f.signal.removeEventListener("abort",c)}),u.send(void 0===f._bodyInit?null:f._bodyInit)})}A.polyfill=!0,e.fetch||(e.fetch=A,e.Headers=h,e.Request=l,e.Response=m),t.Headers=h,t.Request=l,t.Response=m,t.fetch=A,Object.defineProperty(t,"__esModule",{value:!0})});