'use strict'

module.exports = class SaleSchema {
    constructor(electionObj) {
        this._location = electionObj.location;
        this._customerName = electionObj.customerName;       
        this._volumeDispensed = electionObj.volumeDispensed ; 
        this._amountPaid = electionObj.amountPaid ; 
        this.validate = () => {
            return this._location !== '' &&
            this.amountPaid !== '' && this._customerName !== '' && this._volumeDispensed !== ''
        };
        
    }
}



SaleSchema.prototype.mapToModel = () => ({
    location: this._location,
    amountPaid: this.amountPaid,          
    customerName: this._customerName,
    volumeDispensed: this._volumeDispensed
});