"""
BondMCP Data Models

Pydantic models for request and response data structures.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Citation(BaseModel):
    """Source citation for health information."""
    source: str = Field(..., description="Name of the source")
    url: Optional[str] = Field(None, description="URL of the source")
    relevance_score: float = Field(..., description="Relevance score (0-1)")


class AskRequest(BaseModel):
    """Request model for asking health questions."""
    query: str = Field(..., description="The health question to ask")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for context")
    include_citations: bool = Field(True, description="Whether to include citations")
    model_preference: str = Field("consensus", description="AI model preference")


class AskResponse(BaseModel):
    """Response model for health questions."""
    answer: str = Field(..., description="The health answer")
    confidence_score: float = Field(..., description="Confidence score (0-1)")
    citations: Optional[List[Citation]] = Field(None, description="Source citations")
    conversation_id: str = Field(..., description="Conversation ID")
    model_used: List[str] = Field(..., description="AI models used")


class LabResult(BaseModel):
    """Laboratory test result."""
    test_name: str = Field(..., description="Name of the test")
    value: float = Field(..., description="Test result value")
    unit: str = Field(..., description="Unit of measurement")
    reference_range: str = Field(..., description="Normal reference range")


class PatientContext(BaseModel):
    """Patient context information."""
    age: Optional[int] = Field(None, description="Patient age")
    gender: Optional[str] = Field(None, description="Patient gender")
    medical_history: Optional[List[str]] = Field(None, description="Medical history")


class LabInterpretRequest(BaseModel):
    """Request model for lab result interpretation."""
    lab_results: List[LabResult] = Field(..., description="Laboratory results")
    patient_context: Optional[PatientContext] = Field(None, description="Patient context")


class LabInterpretResponse(BaseModel):
    """Response model for lab result interpretation."""
    interpretation: str = Field(..., description="Lab results interpretation")
    abnormal_results: List[LabResult] = Field(..., description="Abnormal results")
    recommendations: List[str] = Field(..., description="Clinical recommendations")
    urgency_level: str = Field(..., description="Urgency level (low/medium/high/critical)")

