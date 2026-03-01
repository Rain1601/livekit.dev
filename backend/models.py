from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from backend.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    icon: Mapped[str] = mapped_column(String(50), default="bot")
    mode: Mapped[str] = mapped_column(String(20), default="realtime")

    realtime_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    llm_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    stt_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    tts_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    vad_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    turn_detection_config: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    system_prompt: Mapped[str] = mapped_column(Text, default="You are a helpful voice AI assistant.")
    greeting: Mapped[str] = mapped_column(String(500), default="")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow, onupdate=_utcnow)
