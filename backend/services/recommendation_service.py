"""
Recommendation Service
======================
Bridges the FastAPI backend to the existing /ml_pipeline package.

The ML pipeline is NOT modified — this service only imports
`RecommendationPipeline` and feeds it the local schemes dataset, then
returns the structured recommendation list.
"""

from __future__ import annotations

import json
import os
import sys
from typing import Any, Dict, List, Optional

# Make the project root importable so `import ml_pipeline.*` works
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from ml_pipeline.recommendation_pipeline import RecommendationPipeline  # noqa: E402

DATASET_PRIMARY = os.path.join(_PROJECT_ROOT, "dataset", "schemes.json")
DATASET_FALLBACK = os.path.join(_PROJECT_ROOT, "ml_pipeline", "dataset", "schemes_sample.json")

_pipeline: Optional[RecommendationPipeline] = None


def _load_schemes() -> List[Dict[str, Any]]:
    path = DATASET_PRIMARY if os.path.exists(DATASET_PRIMARY) else DATASET_FALLBACK
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _get_pipeline() -> RecommendationPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = RecommendationPipeline(use_chromadb=False)
        _pipeline.load_schemes(_load_schemes())
    return _pipeline


def recommend(
    query: Optional[str] = None,
    profile: Optional[Dict[str, Any]] = None,
    top_k: int = 10,
) -> List[Dict[str, Any]]:
    pipeline = _get_pipeline()
    return pipeline.recommend(user_input=query, profile=profile, top_k=top_k)
