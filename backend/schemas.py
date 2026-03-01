from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class AgentCreate(BaseModel):
    name: str
    description: str = ""
    icon: str = "bot"
    mode: str = "realtime"
    realtime_config: dict[str, Any] | None = None
    llm_config: dict[str, Any] | None = None
    stt_config: dict[str, Any] | None = None
    tts_config: dict[str, Any] | None = None
    vad_config: dict[str, Any] | None = None
    turn_detection_config: dict[str, Any] | None = None
    system_prompt: str = "You are a helpful voice AI assistant."
    greeting: str = ""


class AgentUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    icon: str | None = None
    mode: str | None = None
    realtime_config: dict[str, Any] | None = Field(default=None)
    llm_config: dict[str, Any] | None = Field(default=None)
    stt_config: dict[str, Any] | None = Field(default=None)
    tts_config: dict[str, Any] | None = Field(default=None)
    vad_config: dict[str, Any] | None = Field(default=None)
    turn_detection_config: dict[str, Any] | None = Field(default=None)
    system_prompt: str | None = None
    greeting: str | None = None


class AgentResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    mode: str
    realtime_config: dict[str, Any] | None
    llm_config: dict[str, Any] | None
    stt_config: dict[str, Any] | None
    tts_config: dict[str, Any] | None
    vad_config: dict[str, Any] | None
    turn_detection_config: dict[str, Any] | None
    system_prompt: str
    greeting: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
