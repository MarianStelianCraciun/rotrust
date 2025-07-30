'use strict';

const { Contract } = require('fabric-contract-api');

class EscrowContract extends Contract {
    
    // Initialize the chaincode
    async InitLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }
    
    // Create a new escrow
    async CreateEscrow(ctx, escrowId, transactionId, propertyId, sellerId, buyerId, price, conditions) {
        console.info('============= START : Create Escrow ===========');
        
        // Check if transaction exists
        const transactionAsBytes = await ctx.stub.getState(transactionId);
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`Transaction ${transactionId} does not exist`);
        }
        
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
        
        // Create escrow record
        const escrow = {
            docType: 'escrow',
            escrowId,
            transactionId,
            propertyId,
            sellerId,
            buyerId,
            price: parseFloat(price),
            conditions: JSON.parse(conditions),
            status: 'created',
            payments: [],
            documents: [],
            conditions_met: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Initialize conditions_met based on provided conditions
        const conditionsObj = JSON.parse(conditions);
        for (const condition of conditionsObj) {
            escrow.conditions_met[condition.id] = false;
        }
        
        await ctx.stub.putState(escrowId, Buffer.from(JSON.stringify(escrow)));
        console.info('============= END : Create Escrow ===========');
        return JSON.stringify(escrow);
    }
    
    // Get escrow by ID
    async GetEscrow(ctx, escrowId) {
        console.info('============= START : Get Escrow ===========');
        const escrowAsBytes = await ctx.stub.getState(escrowId);
        
        if (!escrowAsBytes || escrowAsBytes.length === 0) {
            throw new Error(`Escrow ${escrowId} does not exist`);
        }
        
        console.info('============= END : Get Escrow ===========');
        return escrowAsBytes.toString();
    }
    
    // Add payment to escrow
    async AddPayment(ctx, escrowId, paymentId, amount, paymentMethod, paymentDetails) {
        console.info('============= START : Add Payment ===========');
        
        // Get escrow
        const escrowAsBytes = await ctx.stub.getState(escrowId);
        if (!escrowAsBytes || escrowAsBytes.length === 0) {
            throw new Error(`Escrow ${escrowId} does not exist`);
        }
        
        const escrow = JSON.parse(escrowAsBytes.toString());
        
        // Check if escrow is in valid state for payment
        if (escrow.status !== 'created' && escrow.status !== 'in_progress') {
            throw new Error(`Cannot add payment to escrow in ${escrow.status} status`);
        }
        
        // Add payment record
        const payment = {
            paymentId,
            amount: parseFloat(amount),
            paymentMethod,
            details: JSON.parse(paymentDetails),
            timestamp: new Date().toISOString()
        };
        
        escrow.payments.push(payment);
        
        // Calculate total paid amount
        const totalPaid = escrow.payments.reduce((sum, p) => sum + p.amount, 0);
        
        // Update escrow status if needed
        if (escrow.status === 'created' && totalPaid > 0) {
            escrow.status = 'in_progress';
        }
        
        // Update escrow
        escrow.updatedAt = new Date().toISOString();
        await ctx.stub.putState(escrowId, Buffer.from(JSON.stringify(escrow)));
        
        console.info('============= END : Add Payment ===========');
        return JSON.stringify(escrow);
    }
    
    // Add document to escrow
    async AddDocument(ctx, escrowId, documentId, documentType, documentHash, documentMetadata) {
        console.info('============= START : Add Document ===========');
        
        // Get escrow
        const escrowAsBytes = await ctx.stub.getState(escrowId);
        if (!escrowAsBytes || escrowAsBytes.length === 0) {
            throw new Error(`Escrow ${escrowId} does not exist`);
        }
        
        const escrow = JSON.parse(escrowAsBytes.toString());
        
        // Check if escrow is in valid state for adding documents
        if (escrow.status !== 'created' && escrow.status !== 'in_progress') {
            throw new Error(`Cannot add document to escrow in ${escrow.status} status`);
        }
        
        // Add document record
        const document = {
            documentId,
            documentType,
            documentHash,
            metadata: JSON.parse(documentMetadata),
            timestamp: new Date().toISOString()
        };
        
        escrow.documents.push(document);
        
        // Update escrow
        escrow.updatedAt = new Date().toISOString();
        await ctx.stub.putState(escrowId, Buffer.from(JSON.stringify(escrow)));
        
        console.info('============= END : Add Document ===========');
        return JSON.stringify(escrow);
    }
    
    // Mark condition as met
    async MarkConditionMet(ctx, escrowId, conditionId, verifierId, verificationDetails) {
        console.info('============= START : Mark Condition Met ===========');
        
        // Get escrow
        const escrowAsBytes = await ctx.stub.getState(escrowId);
        if (!escrowAsBytes || escrowAsBytes.length === 0) {
            throw new Error(`Escrow ${escrowId} does not exist`);
        }
        
        const escrow = JSON.parse(escrowAsBytes.toString());
        
        // Check if escrow is in valid state
        if (escrow.status !== 'created' && escrow.status !== 'in_progress') {
            throw new Error(`Cannot update conditions for escrow in ${escrow.status} status`);
        }
        
        // Check if condition exists
        if (!(conditionId in escrow.conditions_met)) {
            throw new Error(`Condition ${conditionId} does not exist in escrow ${escrowId}`);
        }
        
        // Mark condition as met
        escrow.conditions_met[conditionId] = true;
        
        // Add verification record
        if (!escrow.verifications) {
            escrow.verifications = [];
        }
        
        const verification = {
            conditionId,
            verifierId,
            details: JSON.parse(verificationDetails),
            timestamp: new Date().toISOString()
        };
        
        escrow.verifications.push(verification);
        
        // Check if all conditions are met
        const allConditionsMet = Object.values(escrow.conditions_met).every(met => met === true);
        
        // Calculate total paid amount
        const totalPaid = escrow.payments.reduce((sum, p) => sum + p.amount, 0);
        
        // Update escrow status if all conditions are met and full payment received
        if (allConditionsMet && Math.abs(totalPaid - escrow.price) < 0.01) {
            escrow.status = 'ready_for_completion';
        }
        
        // Update escrow
        escrow.updatedAt = new Date().toISOString();
        await ctx.stub.putState(escrowId, Buffer.from(JSON.stringify(escrow)));
        
        console.info('============= END : Mark Condition Met ===========');
        return JSON.stringify(escrow);
    }
    
    // Complete escrow and transfer property
    async CompleteEscrow(ctx, escrowId) {
        console.info('============= START : Complete Escrow ===========');
        
        // Get escrow
        const escrowAsBytes = await ctx.stub.getState(escrowId);
        if (!escrowAsBytes || escrowAsBytes.length === 0) {
            throw new Error(`Escrow ${escrowId} does not exist`);
        }
        
        const escrow = JSON.parse(escrowAsBytes.toString());
        
        // Check if escrow is ready for completion
        if (escrow.status !== 'ready_for_completion') {
            throw new Error(`Escrow ${escrowId} is not ready for completion`);
        }
        
        // Get property
        const propertyAsBytes = await ctx.stub.getState(escrow.propertyId);
        if (!propertyAsBytes || propertyAsBytes.length === 0) {
            throw new Error(`Property ${escrow.propertyId} does not exist`);
        }
        
        const property = JSON.parse(propertyAsBytes.toString());
        
        // Verify seller is still the current owner
        if (property.ownerId !== escrow.sellerId) {
            throw new Error(`Property ${escrow.propertyId} is not owned by seller ${escrow.sellerId}`);
        }
        
        // Get transaction
        const transactionAsBytes = await ctx.stub.getState(escrow.transactionId);
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`Transaction ${escrow.transactionId} does not exist`);
        }
        
        const transaction = JSON.parse(transactionAsBytes.toString());
        
        // Record ownership transfer in property history
        const transferRecord = {
            type: 'transfer',
            transactionId: escrow.transactionId,
            escrowId: escrow.escrowId,
            fromOwnerId: escrow.sellerId,
            toOwnerId: escrow.buyerId,
            price: escrow.price,
            timestamp: new Date().toISOString()
        };
        
        property.history.push(transferRecord);
        property.ownerId = escrow.buyerId;
        property.updatedAt = new Date().toISOString();
        
        // Update transaction status
        transaction.status = 'completed';
        transaction.updatedAt = new Date().toISOString();
        
        // Update escrow status
        escrow.status = 'completed';
        escrow.updatedAt = new Date().toISOString();
        
        // Update all records on the ledger
        await ctx.stub.putState(escrow.propertyId, Buffer.from(JSON.stringify(property)));
        await ctx.stub.putState(escrow.transactionId, Buffer.from(JSON.stringify(transaction)));
        await ctx.stub.putState(escrowId, Buffer.from(JSON.stringify(escrow)));
        
        console.info('============= END : Complete Escrow ===========');
        return JSON.stringify(escrow);
    }
    
    // Cancel escrow
    async CancelEscrow(ctx, escrowId, reason) {
        console.info('============= START : Cancel Escrow ===========');
        
        // Get escrow
        const escrowAsBytes = await ctx.stub.getState(escrowId);
        if (!escrowAsBytes || escrowAsBytes.length === 0) {
            throw new Error(`Escrow ${escrowId} does not exist`);
        }
        
        const escrow = JSON.parse(escrowAsBytes.toString());
        
        // Check if escrow can be cancelled
        if (escrow.status === 'completed' || escrow.status === 'cancelled') {
            throw new Error(`Escrow ${escrowId} cannot be cancelled because it is already ${escrow.status}`);
        }
        
        // Update escrow status
        escrow.status = 'cancelled';
        escrow.cancellationReason = reason || 'No reason provided';
        escrow.updatedAt = new Date().toISOString();
        
        // Get transaction
        const transactionAsBytes = await ctx.stub.getState(escrow.transactionId);
        if (transactionAsBytes && transactionAsBytes.length > 0) {
            const transaction = JSON.parse(transactionAsBytes.toString());
            
            // Update transaction status if it's not already completed
            if (transaction.status !== 'completed') {
                transaction.status = 'cancelled';
                transaction.updatedAt = new Date().toISOString();
                await ctx.stub.putState(escrow.transactionId, Buffer.from(JSON.stringify(transaction)));
            }
        }
        
        await ctx.stub.putState(escrowId, Buffer.from(JSON.stringify(escrow)));
        console.info('============= END : Cancel Escrow ===========');
        return JSON.stringify(escrow);
    }
    
    // Query escrows by property
    async QueryEscrowsByProperty(ctx, propertyId) {
        console.info('============= START : Query Escrows By Property ===========');
        
        const queryString = {
            selector: {
                docType: 'escrow',
                propertyId: propertyId
            }
        };
        
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const results = await this._GetAllResults(iterator);
        
        console.info('============= END : Query Escrows By Property ===========');
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

module.exports = EscrowContract;