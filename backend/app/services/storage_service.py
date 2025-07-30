from typing import BinaryIO, Optional, Dict, Any
import boto3
from botocore.exceptions import ClientError
import logging
import os
import uuid
from datetime import datetime
from urllib.parse import urlparse

from backend.app.core.config import settings

class StorageService:
    """
    Service for handling document storage using Amazon S3.
    
    This service provides methods for uploading, downloading, and managing
    documents stored in Amazon S3.
    """
    
    def __init__(self):
        """Initialize the storage service with S3 client."""
        self.logger = logging.getLogger(__name__)
        
        # Initialize S3 client
        self.s3_client = boto3.client(
            's3',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )
        
        self.bucket_name = settings.S3_BUCKET_NAME
        self.backup_bucket = settings.S3_BACKUP_BUCKET
        
        # Ensure buckets exist
        self._ensure_bucket_exists(self.bucket_name)
        self._ensure_bucket_exists(self.backup_bucket)
    
    def _ensure_bucket_exists(self, bucket_name: str) -> None:
        """
        Ensure the specified S3 bucket exists, creating it if necessary.
        
        Args:
            bucket_name: Name of the S3 bucket
        """
        try:
            self.s3_client.head_bucket(Bucket=bucket_name)
            self.logger.info(f"Bucket {bucket_name} exists")
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code')
            if error_code == '404':
                # Bucket doesn't exist, create it
                self.logger.info(f"Creating bucket {bucket_name}")
                self.s3_client.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={
                        'LocationConstraint': settings.AWS_REGION
                    }
                )
                
                # Enable versioning
                self.s3_client.put_bucket_versioning(
                    Bucket=bucket_name,
                    VersioningConfiguration={'Status': 'Enabled'}
                )
            else:
                self.logger.error(f"Error checking bucket {bucket_name}: {str(e)}")
                raise
    
    def upload_document(self, file_obj: BinaryIO, filename: str, 
                        document_type: str, property_id: str) -> str:
        """
        Upload a document to S3.
        
        Args:
            file_obj: File-like object containing the document data
            filename: Original filename
            document_type: Type of document (e.g., "deed", "certificate")
            property_id: ID of the property this document belongs to
            
        Returns:
            str: S3 path to the uploaded document
        """
        try:
            # Generate a unique filename
            ext = os.path.splitext(filename)[1]
            unique_filename = f"{property_id}/{document_type}/{uuid.uuid4().hex}{ext}"
            
            # Upload to S3
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                unique_filename,
                ExtraArgs={
                    'ContentType': self._get_content_type(filename),
                    'Metadata': {
                        'property_id': property_id,
                        'document_type': document_type,
                        'original_filename': filename,
                        'upload_date': datetime.now().isoformat()
                    }
                }
            )
            
            # Return the S3 path
            return f"s3://{self.bucket_name}/{unique_filename}"
            
        except Exception as e:
            self.logger.error(f"Error uploading document: {str(e)}")
            raise Exception(f"Failed to upload document: {str(e)}")
    
    def download_document(self, s3_path: str) -> Dict[str, Any]:
        """
        Download a document from S3.
        
        Args:
            s3_path: S3 path to the document (s3://bucket/key)
            
        Returns:
            Dict containing the document data and metadata
        """
        try:
            # Parse S3 path
            parsed_url = urlparse(s3_path)
            bucket = parsed_url.netloc
            key = parsed_url.path.lstrip('/')
            
            # Get object
            response = self.s3_client.get_object(Bucket=bucket, Key=key)
            
            # Return document data and metadata
            return {
                'data': response['Body'].read(),
                'content_type': response.get('ContentType', 'application/octet-stream'),
                'metadata': response.get('Metadata', {}),
                'last_modified': response.get('LastModified'),
                'size': response.get('ContentLength', 0)
            }
            
        except Exception as e:
            self.logger.error(f"Error downloading document: {str(e)}")
            raise Exception(f"Failed to download document: {str(e)}")
    
    def delete_document(self, s3_path: str) -> bool:
        """
        Delete a document from S3.
        
        Args:
            s3_path: S3 path to the document (s3://bucket/key)
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            # Parse S3 path
            parsed_url = urlparse(s3_path)
            bucket = parsed_url.netloc
            key = parsed_url.path.lstrip('/')
            
            # Delete object
            self.s3_client.delete_object(Bucket=bucket, Key=key)
            
            return True
            
        except Exception as e:
            self.logger.error(f"Error deleting document: {str(e)}")
            raise Exception(f"Failed to delete document: {str(e)}")
    
    def list_documents(self, property_id: str, document_type: Optional[str] = None) -> list:
        """
        List documents for a property.
        
        Args:
            property_id: ID of the property
            document_type: Optional document type to filter by
            
        Returns:
            list: List of document paths
        """
        try:
            # Construct prefix
            prefix = f"{property_id}/"
            if document_type:
                prefix += f"{document_type}/"
            
            # List objects
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )
            
            # Extract document paths
            documents = []
            for obj in response.get('Contents', []):
                documents.append(f"s3://{self.bucket_name}/{obj['Key']}")
            
            return documents
            
        except Exception as e:
            self.logger.error(f"Error listing documents: {str(e)}")
            raise Exception(f"Failed to list documents: {str(e)}")
    
    def _get_content_type(self, filename: str) -> str:
        """
        Determine content type based on file extension.
        
        Args:
            filename: Filename with extension
            
        Returns:
            str: MIME content type
        """
        ext = os.path.splitext(filename)[1].lower()
        content_types = {
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.txt': 'text/plain'
        }
        
        return content_types.get(ext, 'application/octet-stream')