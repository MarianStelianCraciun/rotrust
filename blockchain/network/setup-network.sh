#!/bin/bash
# This script sets up the Hyperledger Fabric network for RoTrust

# Exit on first error
set -e

# Define variables
CHANNEL_NAME="rotrust-channel"
CHAINCODE_NAME="rotrust-chaincode"
CHAINCODE_VERSION="1.0"
CHAINCODE_PATH="../chaincode"

# Print the current directory
echo "Current directory: $(pwd)"

# Check if crypto-config directory exists
if [ -d "crypto-config" ]; then
  echo "Removing existing crypto-config directory..."
  rm -rf crypto-config
fi

# Check if channel-artifacts directory exists
if [ -d "channel-artifacts" ]; then
  echo "Removing existing channel-artifacts directory..."
  rm -rf channel-artifacts
fi

# Create directories
echo "Creating crypto-config and channel-artifacts directories..."
mkdir -p crypto-config
mkdir -p channel-artifacts

# Generate crypto material
echo "Generating crypto material..."
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config

# Generate genesis block
echo "Generating genesis block..."
configtxgen -profile RoTrustOrdererGenesis -channelID system-channel -outputBlock ./channel-artifacts/genesis.block

# Generate channel configuration transaction
echo "Generating channel configuration transaction..."
configtxgen -profile RoTrustChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID $CHANNEL_NAME

# Generate anchor peer transactions for each org
echo "Generating anchor peer transactions..."
configtxgen -profile RoTrustChannel -outputAnchorPeersUpdate ./channel-artifacts/NotaryMSPanchors.tx -channelID $CHANNEL_NAME -asOrg NotaryMSP
configtxgen -profile RoTrustChannel -outputAnchorPeersUpdate ./channel-artifacts/LandRegistryMSPanchors.tx -channelID $CHANNEL_NAME -asOrg LandRegistryMSP
configtxgen -profile RoTrustChannel -outputAnchorPeersUpdate ./channel-artifacts/BankMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BankMSP

# Start the network
echo "Starting the network..."
docker-compose -f docker-compose.yaml up -d

# Wait for the network to start
echo "Waiting for the network to start..."
sleep 10

# Create the channel
echo "Creating the channel..."
docker exec cli peer channel create -o orderer.rotrust.ro:7050 -c $CHANNEL_NAME -f /etc/hyperledger/configtx/channel.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem

# Join peers to the channel
echo "Joining peers to the channel..."
# Notary peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/users/Admin@notary.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.notary.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="NotaryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/peers/peer0.notary.rotrust.ro/tls/ca.crt cli peer channel join -b $CHANNEL_NAME.block

# Land Registry peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/users/Admin@landregistry.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.landregistry.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="LandRegistryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/peers/peer0.landregistry.rotrust.ro/tls/ca.crt cli peer channel join -b $CHANNEL_NAME.block

# Bank peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/users/Admin@bank.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.bank.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="BankMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/peers/peer0.bank.rotrust.ro/tls/ca.crt cli peer channel join -b $CHANNEL_NAME.block

# Update anchor peers
echo "Updating anchor peers..."
# Notary anchor peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/users/Admin@notary.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.notary.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="NotaryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/peers/peer0.notary.rotrust.ro/tls/ca.crt cli peer channel update -o orderer.rotrust.ro:7050 -c $CHANNEL_NAME -f /etc/hyperledger/configtx/NotaryMSPanchors.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem

# Land Registry anchor peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/users/Admin@landregistry.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.landregistry.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="LandRegistryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/peers/peer0.landregistry.rotrust.ro/tls/ca.crt cli peer channel update -o orderer.rotrust.ro:7050 -c $CHANNEL_NAME -f /etc/hyperledger/configtx/LandRegistryMSPanchors.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem

# Bank anchor peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/users/Admin@bank.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.bank.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="BankMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/peers/peer0.bank.rotrust.ro/tls/ca.crt cli peer channel update -o orderer.rotrust.ro:7050 -c $CHANNEL_NAME -f /etc/hyperledger/configtx/BankMSPanchors.tx --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem

# Install chaincode
echo "Installing chaincode..."
# Package the chaincode
docker exec cli peer lifecycle chaincode package ${CHAINCODE_NAME}.tar.gz --path ${CHAINCODE_PATH} --lang node --label ${CHAINCODE_NAME}_${CHAINCODE_VERSION}

# Install on Notary peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/users/Admin@notary.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.notary.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="NotaryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/peers/peer0.notary.rotrust.ro/tls/ca.crt cli peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Install on Land Registry peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/users/Admin@landregistry.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.landregistry.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="LandRegistryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/peers/peer0.landregistry.rotrust.ro/tls/ca.crt cli peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Install on Bank peer
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/users/Admin@bank.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.bank.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="BankMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/peers/peer0.bank.rotrust.ro/tls/ca.crt cli peer lifecycle chaincode install ${CHAINCODE_NAME}.tar.gz

# Get the package ID
PACKAGE_ID=$(docker exec cli peer lifecycle chaincode queryinstalled | grep "${CHAINCODE_NAME}_${CHAINCODE_VERSION}" | awk '{print $3}' | sed 's/,//')
echo "Package ID: ${PACKAGE_ID}"

# Approve chaincode for each org
echo "Approving chaincode for each organization..."
# Approve for Notary org
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/users/Admin@notary.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.notary.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="NotaryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/peers/peer0.notary.rotrust.ro/tls/ca.crt cli peer lifecycle chaincode approveformyorg -o orderer.rotrust.ro:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence 1

# Approve for Land Registry org
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/users/Admin@landregistry.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.landregistry.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="LandRegistryMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/peers/peer0.landregistry.rotrust.ro/tls/ca.crt cli peer lifecycle chaincode approveformyorg -o orderer.rotrust.ro:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence 1

# Approve for Bank org
docker exec -e CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/users/Admin@bank.rotrust.ro/msp -e CORE_PEER_ADDRESS=peer0.bank.rotrust.ro:7051 -e CORE_PEER_LOCALMSPID="BankMSP" -e CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/peers/peer0.bank.rotrust.ro/tls/ca.crt cli peer lifecycle chaincode approveformyorg -o orderer.rotrust.ro:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --package-id $PACKAGE_ID --sequence 1

# Check commit readiness
echo "Checking commit readiness..."
docker exec cli peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --sequence 1 --output json

# Commit chaincode
echo "Committing chaincode..."
docker exec cli peer lifecycle chaincode commit -o orderer.rotrust.ro:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem --channelID $CHANNEL_NAME --name $CHAINCODE_NAME --version $CHAINCODE_VERSION --sequence 1 --peerAddresses peer0.notary.rotrust.ro:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/peers/peer0.notary.rotrust.ro/tls/ca.crt --peerAddresses peer0.landregistry.rotrust.ro:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/peers/peer0.landregistry.rotrust.ro/tls/ca.crt --peerAddresses peer0.bank.rotrust.ro:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/peers/peer0.bank.rotrust.ro/tls/ca.crt

# Query committed chaincode
echo "Querying committed chaincode..."
docker exec cli peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name $CHAINCODE_NAME

# Initialize the ledger
echo "Initializing the ledger..."
docker exec cli peer chaincode invoke -o orderer.rotrust.ro:7050 --tls --cafile /etc/hyperledger/crypto/ordererOrganizations/rotrust.ro/orderers/orderer.rotrust.ro/msp/tlscacerts/tlsca.rotrust.ro-cert.pem -C $CHANNEL_NAME -n $CHAINCODE_NAME --peerAddresses peer0.notary.rotrust.ro:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/notary.rotrust.ro/peers/peer0.notary.rotrust.ro/tls/ca.crt --peerAddresses peer0.landregistry.rotrust.ro:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/landregistry.rotrust.ro/peers/peer0.landregistry.rotrust.ro/tls/ca.crt --peerAddresses peer0.bank.rotrust.ro:7051 --tlsRootCertFiles /etc/hyperledger/crypto/peerOrganizations/bank.rotrust.ro/peers/peer0.bank.rotrust.ro/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'

echo "Network setup complete!"