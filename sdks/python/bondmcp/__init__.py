"""
BondMCP Python SDK

The official Python SDK for the BondMCP health AI protocol.
Provides easy access to consensus-driven health AI with zero hallucinations.
"""

from .client import BondMCP, BondMCPError
from .models import (
    AskRequest,
    AskResponse,
    LabResult,
    LabInterpretRequest,
    LabInterpretResponse,
    PatientContext,
    Citation,
)

__version__ = "1.0.0"
__author__ = "BondMCP Team"
__email__ = "support@bondmcp.com"

__all__ = [
    "BondMCP",
    "BondMCPError",
    "AskRequest", 
    "AskResponse",
    "LabResult",
    "LabInterpretRequest",
    "LabInterpretResponse",
    "PatientContext",
    "Citation",
]

