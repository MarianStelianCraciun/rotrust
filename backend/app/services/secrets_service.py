import boto3
import json
import logging
from botocore.exceptions import ClientError
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig

from backend.app.core.config import settings

class SecretsService:
    """
    Service for managing secrets using AWS Secrets Manager.
    
    This service provides methods for retrieving and storing secrets
    in AWS Secrets Manager with local caching for performance.
    """
    
    def __init__(self):
        """Initialize the secrets service with AWS Secrets Manager client."""
        self.logger = logging.getLogger(__name__)
        
        # Initialize Secrets Manager client
        self.secretsmanager_client = boto3.client(
            'secretsmanager',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        
        # Initialize secret cache for better performance
        cache_config = SecretCacheConfig()
        self.cache = SecretCache(
            config=cache_config,
            client=self.secretsmanager_client
        )
        
    def get_secret(self, secret_name: str, default_value: str = None) -> str:
        """
        Get a secret from AWS Secrets Manager.
        
        Args:
            secret_name: Name of the secret
            default_value: Default value to return if secret not found
            
        Returns:
            str: Secret value
        """
        try:
            # Try to get secret from cache
            secret = self.cache.get_secret_string(secret_name)
            
            # Parse JSON if the secret is stored as JSON
            try:
                secret_dict = json.loads(secret)
                # If the secret is a dictionary, return the 'value' key
                if isinstance(secret_dict, dict) and 'value' in secret_dict:
                    return secret_dict['value']
            except json.JSONDecodeError:
                # If not JSON, return as is
                pass
                
            return secret
            
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code')
            if error_code == 'ResourceNotFoundException':
                self.logger.warning(f"Secret {secret_name} not found, using default value")
                # If secret doesn't exist and we're in development, create it with default value
                if default_value and settings.ENVIRONMENT == 'development':
                    self.create_secret(secret_name, default_value)
                    return default_value
                return default_value
            else:
                self.logger.error(f"Error retrieving secret {secret_name}: {str(e)}")
                # Return default value if provided, otherwise raise exception
                if default_value is not None:
                    return default_value
                raise
                
        except Exception as e:
            self.logger.error(f"Error retrieving secret {secret_name}: {str(e)}")
            # Return default value if provided, otherwise raise exception
            if default_value is not None:
                return default_value
            raise
    
    def create_secret(self, secret_name: str, secret_value: str) -> bool:
        """
        Create a new secret in AWS Secrets Manager.
        
        Args:
            secret_name: Name of the secret
            secret_value: Value of the secret
            
        Returns:
            bool: True if creation was successful
        """
        try:
            # Create secret
            self.secretsmanager_client.create_secret(
                Name=secret_name,
                SecretString=json.dumps({'value': secret_value})
            )
            
            self.logger.info(f"Secret {secret_name} created successfully")
            return True
            
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code')
            if error_code == 'ResourceExistsException':
                # Secret already exists, update it
                self.update_secret(secret_name, secret_value)
                return True
            else:
                self.logger.error(f"Error creating secret {secret_name}: {str(e)}")
                raise
                
        except Exception as e:
            self.logger.error(f"Error creating secret {secret_name}: {str(e)}")
            raise
    
    def update_secret(self, secret_name: str, secret_value: str) -> bool:
        """
        Update an existing secret in AWS Secrets Manager.
        
        Args:
            secret_name: Name of the secret
            secret_value: New value of the secret
            
        Returns:
            bool: True if update was successful
        """
        try:
            # Update secret
            self.secretsmanager_client.update_secret(
                SecretId=secret_name,
                SecretString=json.dumps({'value': secret_value})
            )
            
            self.logger.info(f"Secret {secret_name} updated successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error updating secret {secret_name}: {str(e)}")
            raise
    
    def delete_secret(self, secret_name: str, force_delete: bool = False) -> bool:
        """
        Delete a secret from AWS Secrets Manager.
        
        Args:
            secret_name: Name of the secret
            force_delete: Whether to force delete without recovery
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            # Delete secret
            self.secretsmanager_client.delete_secret(
                SecretId=secret_name,
                ForceDeleteWithoutRecovery=force_delete
            )
            
            self.logger.info(f"Secret {secret_name} deleted successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"Error deleting secret {secret_name}: {str(e)}")
            raise