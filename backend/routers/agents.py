from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Agent
from backend.schemas import AgentCreate, AgentResponse, AgentUpdate

router = APIRouter(prefix="/api/agents", tags=["agents"])


@router.get("", response_model=list[AgentResponse])
def list_agents(db: Session = Depends(get_db)):
    return db.query(Agent).order_by(Agent.updated_at.desc()).all()


@router.post("", response_model=AgentResponse, status_code=201)
def create_agent(body: AgentCreate, db: Session = Depends(get_db)):
    agent = Agent(**body.model_dump())
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent


@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: str, body: AgentUpdate, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(agent, key, value)
    db.commit()
    db.refresh(agent)
    return agent


@router.delete("/{agent_id}", status_code=204)
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()


@router.post("/{agent_id}/duplicate", response_model=AgentResponse, status_code=201)
def duplicate_agent(agent_id: str, db: Session = Depends(get_db)):
    original = db.get(Agent, agent_id)
    if not original:
        raise HTTPException(status_code=404, detail="Agent not found")
    clone = Agent(
        id=str(uuid.uuid4()),
        name=f"{original.name} (Copy)",
        description=original.description,
        icon=original.icon,
        mode=original.mode,
        realtime_config=original.realtime_config,
        llm_config=original.llm_config,
        stt_config=original.stt_config,
        tts_config=original.tts_config,
        vad_config=original.vad_config,
        turn_detection_config=original.turn_detection_config,
        system_prompt=original.system_prompt,
        greeting=original.greeting,
    )
    db.add(clone)
    db.commit()
    db.refresh(clone)
    return clone
