import logging
from logging import Handler
from typing import Optional

from flask import has_request_context, request, g


class RequestContextFilter(logging.Filter):
    """Injects Flask request context fields into log records if available."""

    def filter(self, record: logging.LogRecord) -> bool:
        if has_request_context():
            # Correlation id per request (set in app.before_request)
            request_id = getattr(g, "request_id", "-")

            # User id from auth decorator if present
            user_id: Optional[str] = "-"
            current_user = getattr(g, "current_user", None)
            if isinstance(current_user, dict):
                user_id = current_user.get("id") or "-"

            # Basic request info
            method = getattr(request, "method", "-")
            path = getattr(request, "path", "-")

            setattr(record, "request_id", request_id)
            setattr(record, "user_id", user_id)
            setattr(record, "method", method)
            setattr(record, "path", path)
        else:
            # Populate defaults to avoid KeyError in format string
            for key in ("request_id", "user_id", "method", "path"):
                if not hasattr(record, key):
                    setattr(record, key, "-")
        return True


class SafeFormatter(logging.Formatter):
    """Formatter that guarantees context fields exist to prevent KeyError."""

    def format(self, record: logging.LogRecord) -> str:
        for key in ("request_id", "user_id", "method", "path"):
            if not hasattr(record, key):
                setattr(record, key, "-")
        return super().format(record)


def configure_logging(level: int = logging.INFO) -> None:
    """Configure root logging with a human-friendly format and quiet noisy libs."""
    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # Clear pre-existing handlers that may be added by libraries/basicConfig
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    stream_handler: Handler = logging.StreamHandler()
    stream_handler.setLevel(level)
    stream_handler.addFilter(RequestContextFilter())

    # Example: 2025-08-21 09:41:22 | INFO | src.routes.leads | Found 3 due leads | user=123 req=abc METHOD GET /move-leads
    fmt = (
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s "
        "| user=%(user_id)s req=%(request_id)s | %(method)s %(path)s"
    )
    datefmt = "%Y-%m-%d %H:%M:%S"
    stream_handler.setFormatter(SafeFormatter(fmt=fmt, datefmt=datefmt))

    root_logger.addHandler(stream_handler)

    # Quiet very chatty third-party loggers
    logging.getLogger("werkzeug").setLevel(logging.WARNING)
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    logging.getLogger("google").setLevel(logging.WARNING)
    logging.getLogger("google_genai").setLevel(logging.WARNING)
    logging.getLogger("google_genai.models").setLevel(logging.WARNING)
    logging.getLogger("praw").setLevel(logging.WARNING)

    # Keep our application namespace at INFO by default
    logging.getLogger("src").setLevel(level)


