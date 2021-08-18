'use strict';

// Import user services
const { SaleService } = require('../../Services/Sale');
const SaleModel = require('../../Model/Schema/Sale');


// cloudinary config

/**
 * @type Class
 * @kind Controller
 * @extends sale Service
 * @return controller class
 */
exports.SaleController = class SaleController extends SaleService {
  constructor() {
    super();

    /** Get user by id
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */
    this.findSaleController = (req, res, next) => {
      const sale_id = req.params.sale_id;
      if (!sale_id) {
        return res.status(400).json({
          message: 'failure',
          error: 'FindSale must be called with Sale_id',
        });
      }
      this.findById(sale_id, true)
        .then((result) => {
          res.setHeader(
            'Access-Control-Allow-Origin',
            process.env.ORIGIN.toString(),
          );
          res.setHeader('Access-Control-Allow-Credentials', true);
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          return res.status(err.status).json({
            message: 'failure',
            error: err,
          });
        });
    };

    /** Add user
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */
    this.addSaleController = (req, res, next) => {
      const saleObj = {
        location: req.body.location,
        customerName: req.body.customerName,
        volumeDispensed: req.body.volumeDispensed,
        amountPaid: req.body.amountPaid
      };
      
      if (!saleObj.location || !saleObj.customerName || !saleObj.volumeDispensed || !saleObj.amountPaid || !saleObj.status ) {
        return res.status(400).json({
          message: 'failure',
          error: 'req must contain location, customerName, volumeDispensed and amountPaid amongst other optional fields',
        });
      }
      this.createSale(saleObj)
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          res.status(err.status || 400).json({
            message: 'failure',
            error: err,
          });
          return next(err);
        });
    };

    /** find all users
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */

    this.findAllSalesController = (req, res, next) => {
      return this.getAll()
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          res.status(err.status || 500).json({
            message: 'failure',
            error: 'Cannot get all sales',
            err,
          });
          return next(err);
        });
    };

    /** update sale
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */

    this.updateSaleController = (req, res, next) => {
      const id = req.params.sale_id;
      const update = req.body;

      console.log(req.body)

      for (let elem in Object.keys(update)) {
        if (!elem in ['location', 'customerName', 'volumeDispensed', 'amountPaid', 'status']) {
          return res.status(400).json({
            message: 'failure',
            error: 'malformed request. check request body properties'
          })
        }
      } 

      console.log(id, update);
      if (!id || !update) {
        return res.status(400).json({
          message: 'failure',
          error: 'req must contain id and update',
        });
      }
      return this.updateSale(id, update)
        .then((result) => {
          return res.status(200).json({
            message: 'success',
            data: result,
          });
        })
        .catch((err) => {
          res.status(err.status || 500).json({
            message: 'failure',
            error: err,
          });
          return next(err);
        });
    };

        /** delete sale
     *  @param req {Obj} - the request object
     *  @param res {Obj} - the response object
     *  @param next {Obj} - the next middleware in stack
     */

         this.deleteSaleController = (req, res, next) => {
          const id = req.params.sale_id;
          
          if (!id) {
            return res.status(400).json({
              message: 'failure',
              error: 'req must contain id',
            });
          }
          return this.deleteSale(id)
            .then((result) => {
              return res.status(200).json({
                message: 'success',
                data: result,
              });
            })
            .catch((err) => {
              res.status(err.status || 500).json({
                message: 'failure',
                error: err,
              });
              return next(err);
            });
        };
  }
};
