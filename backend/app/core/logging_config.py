import logging
import os
import sys
import watchtower
from logging.config import dictConfig
from backend.app.core.config import settings

def configure_logging():
    """
    Configure logging for the application.
    
    In AWS environments, this will set up CloudWatch logging.
    In other environments, it will log to the console and file.
    """
    # Determine if we're running in AWS
    is_aws = os.getenv("AWS_EXECUTION_ENV") is not None
    
    # Base logging configuration
    log_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
                "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": sys.stdout,
                "formatter": "default",
                "level": "INFO",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "filename": "logs/rotrust.log",
                "maxBytes": 10485760,  # 10 MB
                "backupCount": 5,
                "formatter": "default",
                "level": "INFO",
            },
        },
        "loggers": {
            "": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": True,
            },
            "uvicorn": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
            "uvicorn.access": {
                "handlers": ["console", "file"],
                "level": "INFO",
                "propagate": False,
            },
        },
    }
    
    # Add CloudWatch handler if running in AWS
    if is_aws:
        # Create logs directory if it doesn't exist
        os.makedirs("logs", exist_ok=True)
        
        # Add CloudWatch handler
        log_config["handlers"]["cloudwatch"] = {
            "class": "watchtower.CloudWatchLogHandler",
            "log_group": f"rotrust-{settings.ENVIRONMENT}",
            "stream_name": "application",
            "formatter": "json",
            "level": "INFO",
            "boto3_session": None,  # Will use default credentials
        }
        
        # Add CloudWatch handler to all loggers
        for logger_name in log_config["loggers"]:
            log_config["loggers"][logger_name]["handlers"].append("cloudwatch")
    
    # Apply configuration
    dictConfig(log_config)
    
    # Log startup message
    logging.info(f"Logging configured. Environment: {settings.ENVIRONMENT}, AWS: {is_aws}")