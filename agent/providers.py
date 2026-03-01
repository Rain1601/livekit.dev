"""Provider registry and factory functions for dynamic AgentSession creation."""

from __future__ import annotations

import logging
import os

from livekit.agents import AgentSession
from livekit.plugins import openai, silero

logger = logging.getLogger("agent.providers")

# ---------------------------------------------------------------------------
# Provider definitions
# ---------------------------------------------------------------------------

REALTIME_PROVIDERS = {
    "openai": {
        "models": ["gpt-4o-realtime-preview"],
        "voices": ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse"],
        "env_key": "OPENAI_API_KEY",
    },
    "google": {
        "models": ["gemini-2.5-flash"],
        "voices": ["Puck", "Charon", "Kore", "Fenrir", "Aoede"],
        "env_key": "GOOGLE_API_KEY",
    },
}

LLM_PROVIDERS = {
    "openai": {
        "models": ["gpt-4o", "gpt-4.1", "gpt-4.1-mini", "gpt-4.1-nano"],
        "env_key": "OPENAI_API_KEY",
    },
    "anthropic": {
        "models": ["claude-sonnet-4-5", "claude-3-5-haiku"],
        "env_key": "ANTHROPIC_API_KEY",
    },
    "google": {
        "models": ["gemini-2.5-pro", "gemini-2.5-flash"],
        "env_key": "GOOGLE_API_KEY",
    },
    "deepseek": {
        "models": ["deepseek-chat", "deepseek-reasoner"],
        "env_key": "DEEPSEEK_API_KEY",
        "base_url": "https://api.deepseek.com/v1",
    },
    "doubao": {
        "models": ["doubao-1.5-pro-32k", "doubao-1.5-lite-32k"],
        "env_key": "DOUBAO_API_KEY",
        "base_url": "https://ark.cn-beijing.volces.com/api/v3",
    },
    "minimax": {
        "models": ["MiniMax-Text-01", "abab6.5s-chat"],
        "env_key": "MINIMAX_API_KEY",
        "base_url": "https://api.minimax.chat/v1",
    },
    "qwen": {
        "models": ["qwen-max", "qwen-plus", "qwen-turbo"],
        "env_key": "DASHSCOPE_API_KEY",
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
    },
}

STT_PROVIDERS = {
    "openai": {
        "models": ["gpt-4o-mini-transcribe", "whisper-1"],
        "env_key": "OPENAI_API_KEY",
    },
    "deepgram": {
        "models": ["nova-3", "nova-2"],
        "env_key": "DEEPGRAM_API_KEY",
    },
    "google": {
        "models": ["chirp_2", "latest_long"],
        "env_key": "GOOGLE_API_KEY",
    },
    "doubao": {
        "models": ["doubao-streaming"],
        "env_key": "DOUBAO_API_KEY",
        "base_url": "https://ark.cn-beijing.volces.com/api/v3",
    },
    "minimax": {
        "models": ["speech-to-text-v1"],
        "env_key": "MINIMAX_API_KEY",
        "base_url": "https://api.minimax.chat/v1",
    },
}

TTS_PROVIDERS = {
    "openai": {
        "voices": ["alloy", "ash", "ballad", "coral", "echo", "fable", "nova", "onyx", "sage", "shimmer"],
        "env_key": "OPENAI_API_KEY",
    },
    "cartesia": {
        "voices": ["694f9389-aac1-45b6-b726-9d9369183238"],
        "env_key": "CARTESIA_API_KEY",
    },
    "elevenlabs": {
        "voices": ["21m00Tcm4TlvDq8ikWAM", "AZnzlk1XvdvUeBnXmlld"],
        "env_key": "ELEVENLABS_API_KEY",
    },
    "google": {
        "voices": ["en-US-Chirp3-HD-Achernar"],
        "env_key": "GOOGLE_API_KEY",
    },
    "doubao": {
        "voices": ["zh_female_shuangkuaisisi_moon_bigtts"],
        "env_key": "DOUBAO_API_KEY",
        "base_url": "https://ark.cn-beijing.volces.com/api/v3",
    },
    "minimax": {
        "voices": ["male-qn-qingse"],
        "env_key": "MINIMAX_API_KEY",
        "base_url": "https://api.minimax.chat/v1",
    },
}

# VAD sensitivity -> activation_threshold mapping
VAD_SENSITIVITY_MAP = {
    "low": 0.7,
    "medium": 0.5,
    "high": 0.3,
}


def _resolve_key(info: dict, keys: dict) -> str:
    """Resolve API key: prefer frontend-supplied keys, fall back to env."""
    env_key = info["env_key"]
    return keys.get(env_key) or os.environ.get(env_key, "")


# ---------------------------------------------------------------------------
# Factory helpers
# ---------------------------------------------------------------------------


def _create_realtime_model(config: dict, keys: dict):
    provider = config.get("provider", "openai")
    model = config.get("model", "gpt-4o-realtime-preview")
    voice = config.get("voice", "alloy")
    temperature = config.get("temperature")

    kwargs: dict = {"model": model, "voice": voice}
    if temperature is not None:
        kwargs["temperature"] = temperature

    if provider == "openai":
        api_key = _resolve_key(REALTIME_PROVIDERS["openai"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return openai.realtime.RealtimeModel(**kwargs)
    elif provider == "google":
        from livekit.plugins import google

        api_key = _resolve_key(REALTIME_PROVIDERS["google"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return google.realtime.RealtimeModel(**kwargs)
    else:
        raise ValueError(f"Unknown realtime provider: {provider}")


def _create_llm(config: dict, keys: dict):
    provider = config.get("provider", "openai")
    model = config.get("model", "gpt-4o")
    temperature = config.get("temperature")

    if provider == "openai":
        kwargs: dict = {"model": model}
        if temperature is not None:
            kwargs["temperature"] = temperature
        api_key = _resolve_key(LLM_PROVIDERS["openai"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return openai.LLM(**kwargs)
    elif provider == "anthropic":
        from livekit.plugins import anthropic

        kwargs = {"model": model}
        if temperature is not None:
            kwargs["temperature"] = temperature
        api_key = _resolve_key(LLM_PROVIDERS["anthropic"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return anthropic.LLM(**kwargs)
    elif provider == "google":
        from livekit.plugins import google

        kwargs = {"model": model}
        if temperature is not None:
            kwargs["temperature"] = temperature
        api_key = _resolve_key(LLM_PROVIDERS["google"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return google.LLM(**kwargs)
    elif provider in ("deepseek", "doubao", "minimax", "qwen"):
        # OpenAI-compatible providers
        info = LLM_PROVIDERS[provider]
        api_key = _resolve_key(info, keys)
        kwargs = {
            "model": model,
            "base_url": info["base_url"],
            "api_key": api_key,
        }
        if temperature is not None:
            kwargs["temperature"] = temperature
        return openai.LLM(**kwargs)
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")


def _create_stt(config: dict, keys: dict):
    provider = config.get("provider", "openai")
    model = config.get("model", "gpt-4o-mini-transcribe")
    language = config.get("language", "en")

    if provider == "openai":
        kwargs: dict = {"model": model, "language": language}
        api_key = _resolve_key(STT_PROVIDERS["openai"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return openai.STT(**kwargs)
    elif provider == "deepgram":
        from livekit.plugins import deepgram

        kwargs = {"model": model, "language": language}
        api_key = _resolve_key(STT_PROVIDERS["deepgram"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return deepgram.STT(**kwargs)
    elif provider == "google":
        from livekit.plugins import google

        kwargs = {"model": model, "languages": [language]}
        api_key = _resolve_key(STT_PROVIDERS["google"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return google.STT(**kwargs)
    elif provider in ("doubao", "minimax"):
        # OpenAI-compatible STT
        info = STT_PROVIDERS[provider]
        api_key = _resolve_key(info, keys)
        return openai.STT(
            model=model,
            language=language,
            base_url=info["base_url"],
            api_key=api_key,
        )
    else:
        raise ValueError(f"Unknown STT provider: {provider}")


def _create_tts(config: dict, keys: dict):
    provider = config.get("provider", "openai")
    voice = config.get("voice", "alloy")

    if provider == "openai":
        kwargs: dict = {"voice": voice}
        api_key = _resolve_key(TTS_PROVIDERS["openai"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return openai.TTS(**kwargs)
    elif provider == "cartesia":
        from livekit.plugins import cartesia

        kwargs = {"voice": voice}
        api_key = _resolve_key(TTS_PROVIDERS["cartesia"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return cartesia.TTS(**kwargs)
    elif provider == "elevenlabs":
        from livekit.plugins import elevenlabs

        kwargs = {"voice": voice}
        api_key = _resolve_key(TTS_PROVIDERS["elevenlabs"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return elevenlabs.TTS(**kwargs)
    elif provider == "google":
        from livekit.plugins import google

        kwargs = {"voice": voice}
        api_key = _resolve_key(TTS_PROVIDERS["google"], keys)
        if api_key:
            kwargs["api_key"] = api_key
        return google.TTS(**kwargs)
    elif provider in ("doubao", "minimax"):
        # OpenAI-compatible TTS
        info = TTS_PROVIDERS[provider]
        api_key = _resolve_key(info, keys)
        return openai.TTS(
            voice=voice,
            base_url=info["base_url"],
            api_key=api_key,
        )
    else:
        raise ValueError(f"Unknown TTS provider: {provider}")


def _create_vad(config: dict):
    """Create a VAD instance from config."""
    sensitivity = config.get("sensitivity", "medium")
    threshold = VAD_SENSITIVITY_MAP.get(sensitivity, 0.5)
    return silero.VAD.load(activation_threshold=threshold)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------


def create_session_from_config(config: dict) -> AgentSession:
    """Create an AgentSession from the frontend-supplied configuration dict."""
    mode = config.get("mode", "realtime")
    keys = config.get("provider_keys", {})

    # VAD (shared by both modes)
    vad_config = config.get("vad", {})
    vad = _create_vad(vad_config)

    # Turn detection / interruption settings
    td_config = config.get("turn_detection", {})
    min_endpointing_delay = td_config.get("silence_duration_ms", 500) / 1000.0
    allow_interruptions = td_config.get("allow_interruptions", True)
    min_interruption_duration = td_config.get("min_interruption_duration_ms", 100) / 1000.0

    if mode == "realtime":
        rt_config = config.get("realtime", {})
        model = _create_realtime_model(rt_config, keys)
        logger.info(
            "Creating realtime session: provider=%s model=%s",
            rt_config.get("provider"),
            rt_config.get("model"),
        )
        return AgentSession(
            llm=model,
            vad=vad,
            allow_interruptions=allow_interruptions,
            min_endpointing_delay=min_endpointing_delay,
            min_interruption_duration=min_interruption_duration,
        )
    else:
        llm_config = config.get("llm", {})
        stt_config = config.get("stt", {})
        tts_config = config.get("tts", {})
        logger.info(
            "Creating pipeline session: llm=%s/%s stt=%s/%s tts=%s/%s",
            llm_config.get("provider"),
            llm_config.get("model"),
            stt_config.get("provider"),
            stt_config.get("model"),
            tts_config.get("provider"),
            tts_config.get("voice"),
        )
        return AgentSession(
            stt=_create_stt(stt_config, keys),
            llm=_create_llm(llm_config, keys),
            tts=_create_tts(tts_config, keys),
            vad=vad,
            allow_interruptions=allow_interruptions,
            min_endpointing_delay=min_endpointing_delay,
            min_interruption_duration=min_interruption_duration,
        )
