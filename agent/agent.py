import asyncio
import json
import logging
from pathlib import Path

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentServer,
    JobContext,
    cli,
)

from agent.providers import create_session_from_config

logger = logging.getLogger("agent")

load_dotenv(Path(__file__).resolve().parent.parent / ".env.local")


DEFAULT_INSTRUCTIONS = """You are a helpful voice AI assistant. The user is interacting with you via voice, even if you perceive the conversation as text.
You eagerly assist users with their questions by providing information from your extensive knowledge.
Your responses are concise, to the point, and without any complex formatting or punctuation including emojis, asterisks, or other symbols.
You are curious, friendly, and have a sense of humor."""


class Assistant(Agent):
    def __init__(self, instructions: str = DEFAULT_INSTRUCTIONS) -> None:
        super().__init__(instructions=instructions)


server = AgentServer()


async def wait_for_participant(ctx: JobContext, timeout: float = 30.0):
    """Wait for a remote (non-agent) participant to join the room."""
    for p in ctx.room.remote_participants.values():
        return p

    fut: asyncio.Future = asyncio.Future()

    def _on_join(participant):
        if not fut.done():
            fut.set_result(participant)

    ctx.room.on("participant_connected", _on_join)
    try:
        return await asyncio.wait_for(fut, timeout=timeout)
    finally:
        ctx.room.off("participant_connected", _on_join)


@server.rtc_session(agent_name="my-agent")
async def my_agent(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    await ctx.connect()

    # Wait for the user participant and read their metadata
    participant = await wait_for_participant(ctx)
    raw_metadata = participant.metadata or "{}"
    try:
        config = json.loads(raw_metadata)
    except json.JSONDecodeError:
        logger.warning("Failed to parse participant metadata, using defaults")
        config = {}

    # Read provider keys from room metadata (kept separate from JWT for security)
    raw_room_metadata = ctx.room.metadata or "{}"
    try:
        room_meta = json.loads(raw_room_metadata)
    except json.JSONDecodeError:
        room_meta = {}
    if "provider_keys" in room_meta:
        config["provider_keys"] = room_meta["provider_keys"]

    logger.info("Agent config from metadata: %s", {k: v for k, v in config.items() if k != "provider_keys"})

    # Read system prompt and greeting from config
    instructions = config.get("system_prompt", DEFAULT_INSTRUCTIONS)
    greeting = config.get("greeting", "")

    # Create session dynamically based on config
    session = create_session_from_config(config)

    await session.start(
        agent=Assistant(instructions=instructions),
        room=ctx.room,
    )

    if greeting:
        await session.say(greeting)


if __name__ == "__main__":
    cli.run_app(server)
