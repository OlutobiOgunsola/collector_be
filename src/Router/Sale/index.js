'use strict';

const express = require('express');
const Router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Import user services
const { SaleController } = require('../../Controllers/Sale');

// Import token middleware
const { checkToken } = require('../../middleware');


/** Initialize user class
 *  @kind Router
 *  @type class
 *  @return Router {Object} - Router object
 */

class SaleRouter extends SaleController {
  constructor() {
    super();

    Router.post('/add',  this.addSaleController);
    Router.get('/all', this.findAllSalesController);
    Router.get('/:sales_id', this.findSaleController);
    Router.put('/:sales_id', this.updateSaleController);
    Router.delete('/:sales_id', this.deleteSaleController);

    return Router;
  }
}

const salesRouter = new SaleRouter();
salesRouter;


module.exports = Router;
