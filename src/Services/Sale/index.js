/* eslint-disable space-before-function-paren */
'use strict';

const { Sale } = require('../../Model/index').Models;
const SaleSchema = require('../../Model/Schema/Sale');

const { CustomError } = require('../../Errors/index');

const Errors = new CustomError();

/** Class User
 *  @kind class
 *  @return {Object} User - The user Object
 */
exports.SaleService = class {
  constructor() {
      
      
    // create new Sale
    this.createSale = (arg = {}) => {
        return new Promise(async (resolve, reject) => {
          if (!arg.location || !arg.customerName || !arg.amountPaid || !arg.volumeDispensed) {
            return reject(
              Errors.Error(
                'SaleError',
                400,
                'Request to create sale must contain valid arguments',
              ),
            );
          }
        const saleSchema = new SaleSchema(arg)
        if(!saleSchema.validate()) return reject(Errors.Error('SaleError', 400, 'Create sale called with incomplete args', err));

        const sale = await new Sale(saleSchema.mapToModel());
        sale.save((err) => {
            if (err) {
            reject(Errors.Error('SaleError', 400, 'Error saving Sale to db', err));
            return;
            }
            return resolve(sale);
        });

        });
    };
    
        // create new Sale
        this.updateSale = (id, arg = {}) => {
          return new Promise(async (resolve, reject) => {
            if (!arg.title || !arg.desc || !arg.contestantsList || !arg.date) {
              return reject(
                Errors.Error(
                  'SaleError',
                  400,
                  'Request must contain sale title, desc, date and contestants',
                ),
              );
            }
  
            const sale = await Sale.findById(id)
          if(!sale) return reject(Errors.Error('SaleError', 400, 'Cannot find sale'));
          
          try {sale.updateSale(arg)} catch (err) { if(err) return reject(Errors.Error('SaleError', 400, 'Error updating Sale to db', err));}
          sale.save((err) => {
              if (err) {
              reject(Errors.Error('SaleError', 400, 'Error saving Sale to db', err));
              return;
              }
              return resolve(sale);
          });
  
          });
    };
    
            // delete Sale
            this.deleteSale = (id) => {
              return new Promise(async (resolve, reject) => {
                if (!id) {
                  return reject(
                    Errors.Error(
                      'SaleError',
                      400,
                      'Request must contain delete id',
                    ),
                  );
                }
      
              const deleted = await Sale.findOneAndDelete(id).then(res => {
                  return resolve('Deleted')
                }).catch(err => {
                  return reject(Errors.Error('SaleError', 400, 'Cannot find to delete'))
              });      
              });
            };

      
    // find by id
    /** findById
     *  @param id {String} ID - the  id to search
     *  @param populate{Boolean} populate - return  with populated fields
     * or not
     */
    this.findById = (_id) => {
      try {
        console.log('finding by id service');
        return new Promise(async (resolve, reject) => {
            if (!_id || _id === null) {
                return reject(
                    Errors.Error('SaleError', 400, 'Request must contain _id'),
                );
            } else {
                await Sale.findById(_id, async (err, sale) => {
                    if (err) {
                        reject(
                            Errors.Error(
                                'SaleError',
                                500,
                                'Cannot find sale in database',
                                err,
                            ),
                        );
                        return;
                    }
                    if (sale) {
                        return resolve(sale);
                    } else {
                        return reject(Errors.Error('SaleError', 404, 'Sale not found'));
                    }
                });
            }
          });
      } catch (e) {
        return {
          message: 'failure',
          error: e,
        };
      }
    };

    // find all users
    this.getAll = () => {
      try {
        return new Promise(async (resolve, reject) => {
          await Sale.find({}, (err, sales) => {
            if (err) {
              reject(Errors.Error('SaleError', 500, 'Cannot find sales', err));
              return;
            }
            return resolve(sales);
          });
        });
      } catch (e) {
        return {
          message: 'failure',
          error: e,
        };
      }
    };
  }
};
