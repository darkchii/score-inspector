import { Buffer } from "buffer";

export class OsuBuffer {
    constructor(input) {
        this.buffer = Buffer.from(input);
        this.position = 0;
    }

    get length() {
        return this.buffer.length;
    }

    toString(type = 'binary') {
        return this.buffer.toString(type);
    }

    static from() {
        if (arguments[0] instanceof OsuBuffer) {
            arguments[0] = arguments[0].buffer;
        }

        return new OsuBuffer(Buffer.from(...arguments));
    }

    canRead(length) {
        return length + this.position <= this.buffer.length;
    }

    EOF() {
        return this.position >= this.buffer.length;
    }

    Slice(length, asOsuBuffer = true) {
        this.position += length;
        return asOsuBuffer ? OsuBuffer.from(this.buffer.slice(this.position - length, this.position))
            : this.buffer.slice(this.position - length, this.position);
    }

    Peek() {
        return this.buffer[this.position];
    }

    ReadByte() {
        return this.buffer[this.position++];
    }

    ReadInt(byteLength){
        this.position += byteLength;
        return this.buffer.readIntLE(this.position - byteLength, byteLength);
    }

    ReadUInt(byteLength){
        this.position += byteLength;
        return this.buffer.readUIntLE(this.position - byteLength, byteLength);
    }

    ReadInt8(){
        return this.ReadInt(1);
    }

    ReadUInt8(){
        return this.ReadUInt(1);
    }

    ReadInt16(){
        return this.ReadInt(2);
    }

    ReadUInt16(){
        return this.ReadUInt(2);
    }

    ReadInt32(){
        return this.ReadInt(4);
    }

    ReadUInt32(){
        return this.ReadUInt(4);
    }

    ReadInt64(){
        return (this.ReadInt(4) << 8) + this.ReadInt(4);
    }

    ReadUInt64(){
        return (this.ReadUInt(4) << 8) + this.ReadUInt(4);
    }

    ReadFloat(){
        this.position += 4;
        return this.buffer.readFloatLE(this.position - 4);
    }

    ReadDouble(){
        this.position += 8;
        return this.buffer.readDoubleLE(this.position - 8);
    }

    ReadString(length){
        return this.Slice(length, false).toString();
    }

    ReadVarint(){
        let total = 0;
        let shift = 0;
        let byte = this.ReadUInt8();
        if((byte & 0x80) === 0) {
            total |= ((byte & 0x7F) << shift);
        } else {
            let end = false;
            do {
                if(shift) {
                    byte = this.ReadUInt8();
                }
                total |= ((byte & 0x7F) << shift);
                if((byte & 0x80) === 0) end = true;
                shift += 7;
            } while (!end);
        }

        return total;
    }

    ReadULeb128(){
        return this.ReadVarint();
    }

    ReadBoolean(){
        return Boolean(this.ReadInt(1));
    }

    ReadOsuString(){
        let isString = this.ReadByte() === 11;
        if(isString){
            let len = this.ReadVarint();
            return this.ReadString(len);
        }else{
            return '';
        }
    }
}