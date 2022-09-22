import {v4 as uuidv4} from 'uuid';

export default class Doc {
    constructor(public name: string, public content: string, public documentId?: uuidv4) {
        if (documentId == undefined) {
            this.documentId = uuidv4();
        }
    }
}