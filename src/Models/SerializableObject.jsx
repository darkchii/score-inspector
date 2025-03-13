class SerializableObject {
    constructor() {
        if (this.constructor === SerializableObject) {
        throw new TypeError("Cannot construct SerializableObject instances directly");
        }
    }
    
    duplicate(){
        //If any property is also a SerializableObject, duplicate it as well
        //find all properties
        let properties = Object.keys(this);

        //duplicate the object
        let duplicate = Object.create(this);
        //duplicate the properties
        for (let property of properties) {
            if (this[property] instanceof SerializableObject) {
                duplicate[property] = this[property].duplicate();
            }else{
                duplicate[property] = this[property];
            }
        }

        return duplicate;
    }
}

export default SerializableObject;