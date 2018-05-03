class DOMNodeCollection {
  constructor (nodes) {
    this.nodes = nodes;
  }

  html(string) {
    if (string){
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].innerHTML = string;
      }
    }else{
      return this.nodes[0].innerHTML;
    }
  }

  empty(){
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].innerHTML = "";
    }
  }


  append(input){
    let stringInput = [];
    if (input.constructor.name === "String"){
      stringInput = [input];
    } else if (input instanceof HTMLElement){
      stringInput = [input.outerHTML];
    } else {
      for (let k = 0; k < input.length; k++) {
        stringInput[k].push(input[k].outerHTML);
      }
    }
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = 0; j < stringInput.length; j++) {
        this.nodes[i].innerHTML += stringInput[j];
      }
    }
  }

  val(value) {
     if (typeof value === "string") {
       this.nodes.forEach(node => {
         node.value = value;
       });
     } else {
       return this.nodes[0].value;
     }
  }

  attr(key, val) {
     if (typeof val === "string") {
       this.nodes.forEach(node => node.setAttribute(key, val));
     } else {
       return this.nodes[0].getAttribute(key);
     }
   }


   addClass(newClass) {
     this.nodes.forEach(node => node.classList.add(newClass));
   }

   removeClass(oldClass) {
     this.nodes.forEach(node => node.classList.remove(oldClass));
   }

  children (){
    let nodeChildren = [];
    for (let i = 0; i < this.nodes.length; i++) {
      nodeChildren = nodeChildren.concat(this.nodes[i].children);
    }
    return new DOMNodeCollection(nodeChildren);
  }

  parent (){
    let nodeParents = [];
    for (let i = 0; i < this.nodes.length; i++) {
      nodeParents.push(this.nodes[i].parentNode);
    }
    return new DOMNodeCollection(nodeParents);
  }

  find (selector) {
    let foundElements = [];
    for (let i = 0; i < this.nodes.length; i++) {
      foundElements = foundElements.concat(Array.from(this.nodes[i].querySelectorAll(selector)));
    }
    return new DOMNodeCollection(foundElements);
  }

  remove () {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].outerHTML = "";
    }
    this.nodes = [];
  }

  on (type, callback){
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].addEventListener(type, callback);
      if (!this.nodes[i][type + 'ing']){
        this.nodes[i][type + 'ing'] = [];
      }
      this.nodes[i][type + 'ing'].push(callback);
    }
  }

  off (type) {
    for (let i = 0; i < this.nodes.length; i++) {
      const callbacks = this.nodes[i][type + 'ing'];
      for (let j = 0; j < callbacks.length; j++) {
        this.nodes[i].removeEventListener(type, callbacks[j]);
      }
    }
  }
}

export default DOMNodeCollection;
