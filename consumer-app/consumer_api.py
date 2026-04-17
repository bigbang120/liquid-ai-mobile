"""
consumer_api.py
=================

This module implements a simple FastAPI application that can serve as a
minimal backend for a consumer health‑monitoring prototype.  It illustrates
how manual input from a front‑end application can be submitted to a server,
how a per‑user baseline is learned over time, how incoming readings are
scored relative to that baseline, and how a dashboard summary can be returned
to the client.  This example is intentionally lightweight so it can be run
locally without any external dependencies beyond FastAPI and Uvicorn.

Features included:

1. **User profiles**: Stored in memory for demonstration.  A profile
   contains the user's ID, name, and any metadata relevant for future
   personalisation.  In a production setting this would be persisted to a
   database.
2. **Readings ingestion**: Clients submit daily physiological metrics
   (resting heart rate, HRV, SpO₂, sleep hours) via a `POST /v1/readings`
   endpoint.  Data are appended to an in‑memory list per user.
3. **Baseline calculation**: A simple rolling baseline is computed over
   the last `WINDOW_DAYS` days per metric.  The baseline includes the
   average, as well as upper/lower bounds defined by a deviation factor.
4. **Risk scoring and alerts**: Each new reading is compared against the
   baseline.  If a metric deviates more than a configurable threshold, an
   alert is generated with a severity of `low`, `medium`, or `high`.
5. **Dashboard summarisation**: The `GET /v1/dashboard/{user_id}` endpoint
   returns the latest reading, baseline comparison, and any alerts.

To run this server locally:

```
pip install fastapi uvicorn
uvicorn consumer_api:app --reload
```

Then you can submit readings using `curl` or a front‑end and fetch the
dashboard summary for a user.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, validator

app = FastAPI(title="Consumer Baseline API", version="0.1.0")

# ----------------------------------------------------------------------------
# Data Models
# ----------------------------------------------------------------------------

class Profile(BaseModel):
    """Represents a user profile.  In a real application this would be
    persisted to a database and include authentication details."""
    user_id: str
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Reading(BaseModel):
    """Represents a single daily reading of physiological metrics."""

    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    resting_heart_rate: float = Field(..., gt=0, description="Beats per minute")
    hrv: float = Field(..., gt=0, description="Heart rate variability (ms)")
    spo2: float = Field(..., ge=0, le=100, description="Blood oxygen saturation (%)")
    sleep_hours: float = Field(..., ge=0, description="Hours of sleep last night")
    note: Optional[str] = None

    @validator("hrv")
    def validate_hrv(cls, v: float) -> float:
        if v > 300:
            raise ValueError("HRV value appears unrealistic")
        return v


class BaselineEntry(BaseModel):
    """Represents baseline statistics for a single metric."""

    baseline_value: float
    lower_bound: float
    upper_bound: float


class SignalStatus(BaseModel):
    """Represents the current reading relative to the baseline."""

    baseline: float
    current: float
    status: str  # "normal", "elevated", "lower_than_usual"


class DashboardResponse(BaseModel):
    """Represents a consumer dashboard summary."""

    user_id: str
    today_status: str  # overall: "stable", "shifted"
    headline: Optional[str] = None
    signals: Dict[str, SignalStatus]
    alerts: List[Dict[str, str]]


class Alert(BaseModel):
    """Represents an alert message."""

    title: str
    detail: str
    severity: str  # "low", "medium", "high"


# ----------------------------------------------------------------------------
# In‑memory storage
# ----------------------------------------------------------------------------

# In a production setting, these structures should be replaced with persistent
# storage (e.g. SQL database).  Here they are module‑level variables for
# demonstration.
PROFILES: Dict[str, Profile] = {}
READINGS: Dict[str, List[Reading]] = {}

# Configuration for baseline calculation
WINDOW_DAYS: int = 7
DEVIATION_THRESHOLDS = {
    "low": 0.10,     # 10% deviation from baseline
    "medium": 0.20,  # 20%
    "high": 0.30,    # 30%
}

# ----------------------------------------------------------------------------
# Helper functions
# ----------------------------------------------------------------------------

def compute_baseline(user_id: str) -> Dict[str, BaselineEntry]:
    """Compute baseline statistics for the given user based on recent readings.

    The baseline for each metric is the mean of the values from the last
    WINDOW_DAYS.  Upper and lower bounds are derived using the medium
    deviation threshold.  If the user has fewer than two readings, the
    baseline is derived from the available data (or set to the current
    value for the first reading).
    """
    readings = READINGS.get(user_id, [])
    if not readings:
        raise HTTPException(status_code=404, detail="No readings for user")

    now = datetime.utcnow()
    cutoff = now - timedelta(days=WINDOW_DAYS)
    # Filter readings within the window
    recent = [r for r in readings if r.timestamp >= cutoff]
    if not recent:
        recent = readings  # fallback to all if none in window

    # Compute mean baseline for each metric
    def mean(values: List[float]) -> float:
        return sum(values) / len(values)

    metrics = {
        "resting_heart_rate": [r.resting_heart_rate for r in recent],
        "hrv": [r.hrv for r in recent],
        "spo2": [r.spo2 for r in recent],
        "sleep_hours": [r.sleep_hours for r in recent],
    }
    baseline_stats = {}
    for name, values in metrics.items():
        base_value = mean(values)
        # use medium threshold for bounds
        delta = DEVIATION_THRESHOLDS["medium"] * base_value
        baseline_stats[name] = BaselineEntry(
            baseline_value=base_value,
            lower_bound=base_value - delta,
            upper_bound=base_value + delta,
        )
    return baseline_stats


def evaluate_reading(baseline: Dict[str, BaselineEntry], reading: Reading) -> (Dict[str, SignalStatus], List[Alert]):
    """Evaluate the latest reading against the baseline and generate alerts.

    Returns a mapping of metric name to SignalStatus and a list of Alerts.
    """
    signals: Dict[str, SignalStatus] = {}
    alerts: List[Alert] = []

    # Helper to compute severity based on deviation
    def severity(deviation: float) -> Optional[str]:
        for sev, thresh in reversed(sorted(DEVIATION_THRESHOLDS.items(), key=lambda x: x[1])):
            if deviation >= thresh:
                return sev
        return None

    for metric in ["resting_heart_rate", "hrv", "spo2", "sleep_hours"]:
        base = baseline[metric]
        current = getattr(reading, metric)
        # Determine status relative to baseline
        if current > base.upper_bound:
            status = "elevated"
            deviation_ratio = (current - base.baseline_value) / base.baseline_value
        elif current < base.lower_bound:
            status = "lower_than_usual"
            deviation_ratio = (base.baseline_value - current) / base.baseline_value
        else:
            status = "normal"
            deviation_ratio = 0.0

        signals[metric] = SignalStatus(
            baseline=base.baseline_value,
            current=current,
            status=status,
        )
        sev = severity(deviation_ratio)
        if sev:
            # Create an alert message tailored to the metric
            if metric == "resting_heart_rate":
                title = "Resting heart rate shift"
                detail = f"Resting heart rate {status.replace('_', ' ')} compared to baseline."
            elif metric == "hrv":
                title = "Heart rate variability shift"
                detail = f"HRV {status.replace('_', ' ')} compared to baseline."
            elif metric == "spo2":
                title = "SpO₂ deviation"
                detail = f"Blood oxygen level {status.replace('_', ' ')} compared to baseline."
            else:  # sleep_hours
                title = "Sleep deviation"
                detail = f"Sleep duration {status.replace('_', ' ')} compared to baseline."
            alerts.append(Alert(title=title, detail=detail, severity=sev))
    return signals, alerts


# ----------------------------------------------------------------------------
# API Endpoints
# ----------------------------------------------------------------------------

@app.post("/v1/profile", response_model=Profile)
def create_profile(profile: Profile) -> Profile:
    """Create or update a user profile.  For simplicity, profiles are stored
    in memory.  In a real application, this would involve authentication and
    persistent storage."""
    PROFILES[profile.user_id] = profile
    return profile


@app.post("/v1/readings", response_model=Reading)
def submit_reading(reading: Reading) -> Reading:
    """Submit a new reading for a user.  Appends the reading to the list
    associated with the user ID.  Returns the recorded reading."""
    READINGS.setdefault(reading.user_id, []).append(reading)
    return reading


@app.get("/v1/baseline/{user_id}")
def get_baseline(user_id: str) -> Dict[str, BaselineEntry]:
    """Return the current baseline statistics for the given user."""
    return compute_baseline(user_id)


@app.get("/v1/dashboard/{user_id}", response_model=DashboardResponse)
def get_dashboard(user_id: str) -> DashboardResponse:
    """Return a dashboard summary for the given user.

    The summary includes the status (stable or shifted), headline message,
    per‑signal status and alerts generated by the most recent reading.
    """
    readings = READINGS.get(user_id)
    if not readings:
        raise HTTPException(status_code=404, detail="No readings found for user")
    latest = readings[-1]
    baseline = compute_baseline(user_id)
    signals, alerts = evaluate_reading(baseline, latest)

    # Determine overall status and headline
    if alerts:
        today_status = "shifted"
        # Use the most severe alert as the headline
        alert_severity_order = {"low": 1, "medium": 2, "high": 3}
        worst = max(alerts, key=lambda a: alert_severity_order[a.severity])
        headline = worst.title
    else:
        today_status = "stable"
        headline = None

    return DashboardResponse(
        user_id=user_id,
        today_status=today_status,
        headline=headline,
        signals=signals,
        alerts=[alert.dict() for alert in alerts],
    )
