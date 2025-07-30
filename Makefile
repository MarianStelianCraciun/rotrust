# RoTrust Makefile
# A blockchain-based platform for real estate transactions in Romania

# Variables
POETRY = poetry
BACKEND_DIR = backend
FRONTEND_DIR = frontend
BLOCKCHAIN_DIR = blockchain
NETWORK_DIR = $(BLOCKCHAIN_DIR)\network

.PHONY: all setup clean test run-backend run-frontend run-all setup-blockchain install-deps install-dev-deps

# Default target
all: setup

# Setup the entire project
setup: install-deps setup-blockchain setup-frontend

# Install Python dependencies
install-deps:
	@echo "Installing Python dependencies with Poetry..."
	$(POETRY) install --no-dev

# Install development dependencies
install-dev-deps:
	@echo "Installing development dependencies with Poetry..."
	$(POETRY) install

# Setup frontend
setup-frontend:
	@echo "Setting up frontend..."
	cd $(FRONTEND_DIR) && npm install

# Setup blockchain network
setup-blockchain:
	@echo "Setting up blockchain network..."
	cd $(NETWORK_DIR) && powershell -Command ".\setup-network.sh"

# Run backend server
run-backend:
	@echo "Starting backend server..."
	cd $(BACKEND_DIR) && $(POETRY) run uvicorn main:app --reload

# Run frontend development server
run-frontend:
	@echo "Starting frontend development server..."
	cd $(FRONTEND_DIR) && npm start

# Run both backend and frontend (requires two separate terminals)
run-all:
	@echo "Please run these commands in separate terminals:"
	@echo "make run-backend"
	@echo "make run-frontend"

# Run tests
test: test-backend test-frontend

# Run backend tests
test-backend:
	@echo "Running backend tests..."
	cd $(BACKEND_DIR) && $(POETRY) run pytest

# Run frontend tests
test-frontend:
	@echo "Running frontend tests..."
	cd $(FRONTEND_DIR) && npm test

# Clean up
clean: clean-venv clean-frontend clean-blockchain

# Clean Poetry virtual environment
clean-venv:
	@echo "Cleaning Poetry virtual environment..."
	$(POETRY) env remove --all

# Clean frontend build artifacts
clean-frontend:
	@echo "Cleaning frontend build artifacts..."
	if exist $(FRONTEND_DIR)\build rmdir /s /q $(FRONTEND_DIR)\build
	if exist $(FRONTEND_DIR)\node_modules rmdir /s /q $(FRONTEND_DIR)\node_modules

# Clean blockchain network
clean-blockchain:
	@echo "Cleaning blockchain network..."
	@echo "Note: This may require manual cleanup of Docker containers and volumes"
	cd $(NETWORK_DIR) && docker compose down --volumes --remove-orphans

# Format code
format:
	@echo "Formatting code..."
	cd $(BACKEND_DIR) && $(POETRY) run black .
	cd $(BACKEND_DIR) && $(POETRY) run isort .

# Lint code
lint:
	@echo "Linting code..."
	cd $(BACKEND_DIR) && $(POETRY) run flake8 .
	cd $(BACKEND_DIR) && $(POETRY) run mypy .

# Help
help:
	@echo "RoTrust Makefile Help"
	@echo "====================="
	@echo "make setup           - Set up the entire project"
	@echo "make install-deps    - Install Python dependencies using Poetry (without dev dependencies)"
	@echo "make install-dev-deps - Install all dependencies including dev dependencies using Poetry"
	@echo "make setup-frontend  - Set up frontend"
	@echo "make setup-blockchain - Set up blockchain network"
	@echo "make run-backend     - Run backend server using Poetry"
	@echo "make run-frontend    - Run frontend development server"
	@echo "make run-all         - Instructions for running both backend and frontend"
	@echo "make test            - Run all tests"
	@echo "make test-backend    - Run backend tests using Poetry"
	@echo "make test-frontend   - Run frontend tests"
	@echo "make clean           - Clean up all artifacts"
	@echo "make format          - Format code using Poetry's black and isort"
	@echo "make lint            - Lint code using Poetry's flake8 and mypy"
	@echo "make help            - Show this help message"