'use strict';

const { Contract } = require('fabric-contract-api');

class PropertyContract extends Contract {
    
    // Initialize the chaincode
    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }
    
    // Create a new property
    async RegisterProperty(ctx, propertyId, address, ownerId, details) {
        console.info('============= START : Register Property ===========');
        
        const property = {
            docType: 'property',
            propertyId,
            address,
            ownerId,
            details: JSON.parse(details),
            status: 'active',
            history: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
        console.info('============= END : Register Property ===========');
        return JSON.stringify(property);
    }
    
    // Get property by ID
    async GetProperty(ctx, propertyId) {
        console.info('============= START : Get Property ===========');
        const propertyAsBytes = await ctx.stub.getState(propertyId);
        
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }
        
        console.info('============= END : Get Property ===========');
        return propertyAsBytes.toString();
    }
    
    // Update property details
    async UpdateProperty(ctx, propertyId, newDetails) {
        console.info('============= START : Update Property ===========');
        
        const propertyAsBytes = await ctx.stub.getState(propertyId);
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }
        
        const property = JSON.parse(propertyAsBytes.toString());
        const updatedDetails = JSON.parse(newDetails);
        
        // Update property details
        property.details = { ...property.details, ...updatedDetails };
        property.updatedAt = new Date().toISOString();
        
        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
        console.info('============= END : Update Property ===========');
        return JSON.stringify(property);
    }
    
    // Transfer property ownership
    async TransferProperty(ctx, propertyId, currentOwnerId, newOwnerId, transactionDetails) {
        console.info('============= START : Transfer Property ===========');
        
        const propertyAsBytes = await ctx.stub.getState(propertyId);
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }
        
        const property = JSON.parse(propertyAsBytes.toString());
        
        // Verify current owner
        if (property.ownerId !== currentOwnerId) {
            throw new Error(`Property ${propertyId} is not owned by ${currentOwnerId}`);
        }
        
        // Record ownership transfer in history
        const transaction = {
            type: 'transfer',
            fromOwnerId: currentOwnerId,
            toOwnerId: newOwnerId,
            details: JSON.parse(transactionDetails),
            timestamp: new Date().toISOString()
        };
        
        property.history.push(transaction);
        property.ownerId = newOwnerId;
        property.updatedAt = new Date().toISOString();
        
        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
        console.info('============= END : Transfer Property ===========');
        return JSON.stringify(property);
    }
    
    // Query properties by owner
    async QueryPropertiesByOwner(ctx, ownerId) {
        console.info('============= START : Query Properties By Owner ===========');
        
        const queryString = {
            selector: {
                docType: 'property',
                ownerId: ownerId
            }
        };
        
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = await this._GetAllResults(iterator);
        
        console.info('============= END : Query Properties By Owner ===========');
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

module.exports = PropertyContract;