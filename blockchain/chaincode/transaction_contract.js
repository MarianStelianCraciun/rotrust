'use strict';

const { Contract } = require('fabric-contract-api');

class TransactionContract extends Contract {
    
    // Initialize the chaincode
    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }
    
    // Create a new transaction
    async CreateTransaction(ctx, transactionId, propertyId, sellerId, buyerId, price, paymentMethod, notes) {
        console.info('============= START : Create Transaction ===========');
        
        // Check if property exists
        const propertyAsBytes = await ctx.stub.getState(propertyId);
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }
        
        const property = JSON.parse(propertyAsBytes.toString());
        
        // Verify seller is the current owner
        if (property.ownerId !== sellerId) {
            throw new Error(`Property ${propertyId} is not owned by seller ${sellerId}`);
        }
        
        // Create transaction record
        const transaction = {
            docType: 'transaction',
            transactionId,
            propertyId,
            sellerId,
            buyerId,
            price: parseFloat(price),
            paymentMethod,
            notes: notes || '',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await ctx.stub.putState(transactionId, Buffer.from(JSON.stringify(transaction)));
        console.info('============= END : Create Transaction ===========');
        return JSON.stringify(transaction);
    }
    
    // Get transaction by ID
    async GetTransaction(ctx, transactionId) {
        console.info('============= START : Get Transaction ===========');
        const transactionAsBytes = await ctx.stub.getState(transactionId);
        
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`Transaction ${transactionId} does not exist`);
        }
        
        console.info('============= END : Get Transaction ===========');
        return transactionAsBytes.toString();
    }
    
    // Complete a transaction (transfer property ownership)
    async CompleteTransaction(ctx, transactionId) {
        console.info('============= START : Complete Transaction ===========');
        
        // Get transaction
        const transactionAsBytes = await ctx.stub.getState(transactionId);
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`Transaction ${transactionId} does not exist`);
        }
        
        const transaction = JSON.parse(transactionAsBytes.toString());
        
        // Check if transaction is pending
        if (transaction.status !== 'pending') {
            throw new Error(`Transaction ${transactionId} is not in pending status`);
        }
        
        // Get property
        const propertyAsBytes = await ctx.stub.getState(transaction.propertyId);
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`Property ${transaction.propertyId} does not exist`);
        }
        
        const property = JSON.parse(propertyAsBytes.toString());
        
        // Verify seller is still the current owner
        if (property.ownerId !== transaction.sellerId) {
            throw new Error(`Property ${transaction.propertyId} is not owned by seller ${transaction.sellerId}`);
        }
        
        // Record ownership transfer in property history
        const transferRecord = {
            type: 'transfer',
            transactionId: transaction.transactionId,
            fromOwnerId: transaction.sellerId,
            toOwnerId: transaction.buyerId,
            price: transaction.price,
            paymentMethod: transaction.paymentMethod,
            timestamp: new Date().toISOString()
        };
        
        property.history.push(transferRecord);
        property.ownerId = transaction.buyerId;
        property.updatedAt = new Date().toISOString();
        
        // Update transaction status
        transaction.status = 'completed';
        transaction.updatedAt = new Date().toISOString();
        
        // Update both records on the ledger
        await ctx.stub.putState(transaction.propertyId, Buffer.from(JSON.stringify(property)));
        await ctx.stub.putState(transactionId, Buffer.from(JSON.stringify(transaction)));
        
        console.info('============= END : Complete Transaction ===========');
        return JSON.stringify(transaction);
    }
    
    // Cancel a transaction
    async CancelTransaction(ctx, transactionId, reason) {
        console.info('============= START : Cancel Transaction ===========');
        
        // Get transaction
        const transactionAsBytes = await ctx.stub.getState(transactionId);
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`Transaction ${transactionId} does not exist`);
        }
        
        const transaction = JSON.parse(transactionAsBytes.toString());
        
        // Check if transaction can be cancelled
        if (transaction.status !== 'pending') {
            throw new Error(`Transaction ${transactionId} cannot be cancelled because it is not pending`);
        }
        
        // Update transaction status
        transaction.status = 'cancelled';
        transaction.cancellationReason = reason || 'No reason provided';
        transaction.updatedAt = new Date().toISOString();
        
        await ctx.stub.putState(transactionId, Buffer.from(JSON.stringify(transaction)));
        console.info('============= END : Cancel Transaction ===========');
        return JSON.stringify(transaction);
    }
    
    // Query transactions by property
    async QueryTransactionsByProperty(ctx, propertyId) {
        console.info('============= START : Query Transactions By Property ===========');
        
        const queryString = {
            selector: {
                docType: 'transaction',
                propertyId: propertyId
            }
        };
        
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = await this._GetAllResults(iterator);
        
        console.info('============= END : Query Transactions By Property ===========');
        return JSON.stringify(results);
    }
    
    // Query transactions by buyer or seller
    async QueryTransactionsByParty(ctx, partyId, role) {
        console.info('============= START : Query Transactions By Party ===========');
        
        let queryString;
        if (role === 'buyer') {
            queryString = {
                selector: {
                    docType: 'transaction',
                    buyerId: partyId
                }
            };
        } else if (role === 'seller') {
            queryString = {
                selector: {
                    docType: 'transaction',
                    sellerId: partyId
                }
            };
        } else {
            throw new Error('Role must be either "buyer" or "seller"');
        }
        
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = await this._GetAllResults(iterator);
        
        console.info('============= END : Query Transactions By Party ===========');
        return JSON.stringify(results);
    }
    
    // Helper function to process iterator results
    async _GetAllResults(iterator) {
        const allResults = [];
        let result = await iterator.next();
        
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            
            allResults.push(record);
            result = await iterator.next();
        }
        
        return allResults;
    }
}

module.exports = TransactionContract;